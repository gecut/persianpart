import type { OrderJsonEntity } from '#persianpart/entities/order';
import { OrderModel, orderInputValidation } from '#persianpart/entities/order';
import { ProductModel } from '#persianpart/entities/product';
import { sendSMS } from '#persianpart/libs/send-sms';
import { userProcedure, router, adminProcedure } from '#persianpart/libs/trpc';

import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const order = router({
  repository: adminProcedure.query(
    async () => (await OrderModel.find().populate('user')) as OrderJsonEntity[],
  ),
  list: userProcedure.query(async (options) => {
    return (await OrderModel.find({
      user: options.ctx.user,
    })) as OrderJsonEntity[];
  }),
  new: userProcedure.input(orderInputValidation).mutation(async (options) => {
    sendSMS({
      apikey:
        '636756372B66647532716F533068746E3138365938624B38423942686763584C57796531593950364C76303D',
      token: `${options.ctx.user.firstName} ${options.ctx.user.lastName}`,
      receptor: ['09101154220', '09155595488'],
    });
    // استخراج لیست محصولات از ورودی
    const { products } = options.input;

    // دریافت اطلاعات محصولات از دیتابیس
    const productIds = products.map((p) => p._id);
    const dbProducts = await ProductModel.find({ _id: { $in: productIds } });

    // ایجاد یک map برای دسترسی سریع به محصولات
    const dbProductMap = new Map(dbProducts.map((p) => [p._id.toString(), p]));

    // بررسی موجودی‌ها و ساخت عملیات‌های آپدیت
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bulkOps: any[] = [];

    for (const item of products) {
      const productInDb = dbProductMap.get(item._id.toString());

      if (!productInDb) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `محصولی با آیدی ${item._id} یافت نشد.`,
        });
      }

      const newQuantity = productInDb.quantity - item.amount;

      if (newQuantity < 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `موجودی محصول '${productInDb.name}' کافی نیست.`,
        });
      }

      bulkOps.push({
        updateOne: {
          filter: { _id: item._id },
          update: { $inc: { quantity: -item.amount } },
        },
      });
    }

    try {
      // به‌روزرسانی موجودی محصولات
      if (bulkOps.length > 0) {
        await ProductModel.bulkWrite(bulkOps, { ordered: false });
      }

      // ایجاد سفارش
      const order = await OrderModel.create(options.input);

      return order;
    } catch (error) {
      console.error('خطا در ایجاد سفارش:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'خطایی در ثبت سفارش رخ داد. لطفاً دوباره تلاش کنید.',
      });
    }
  }),
  edit: adminProcedure
    .input(
      orderInputValidation.partial({
        products: true,
        status: true,
        user: true,
      }),
    )
    .mutation(
      async (options) =>
        await OrderModel.findByIdAndUpdate(options.input._id, options.input),
    ),
  delete: adminProcedure.input(z.string()).mutation(async (options) => {
    const order = await OrderModel.findById(options.input);

    if (!order) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'سفارش مورد نظر یافت نشد.',
      });
    }

    if (!order.products?.length) {
      await order.deleteOne();
      return [];
    }

    try {
      // ساخت آرایه‌ای از عملیات bulk برای به‌روزرسانی موجودی محصولات
      const bulkOps = order.products.map((orderProduct) => ({
        updateOne: {
          filter: { _id: orderProduct._id },
          update: { $inc: { quantity: orderProduct.amount } },
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      })) as any[];

      // اجرای تمام آپدیت‌ها در یک عملیات bulk
      const result = await ProductModel.bulkWrite(bulkOps, { ordered: false });

      if (result.hasWriteErrors) {
        console.warn('برخی از محصولات به‌روزرسانی نشدند.');
      }

      await order.deleteOne();

      return [];
    } catch (error) {
      console.error('خطا هنگام حذف سفارش:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'خطایی در حذف سفارش رخ داد. لطفاً بعداً دوباره تلاش کنید.',
      });
    }
  }),
});
