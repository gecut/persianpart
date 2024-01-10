import type { OrderJsonEntity } from '#persianpart/entities/order';
import { OrderModel, orderInputValidation } from '#persianpart/entities/order';
import { ProductModel } from '#persianpart/entities/product';
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
    const order = await OrderModel.create(options.input);

    for await (const orderProduct of order.products) {
      const newQuantity = orderProduct.quantity - orderProduct.amount;

      if (newQuantity < 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'quantity-value-cannot-be-less-than-zero',
        });
      }

      await ProductModel.findByIdAndUpdate(orderProduct._id, {
        quantity: orderProduct.quantity - orderProduct.amount,
      });
    }

    return order;
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

    for await (const orderProduct of order.products) {
      try {
        const product = await ProductModel.findById(orderProduct._id);

        product.quantity += orderProduct.amount;

        await product.save();
      } catch (error) {
        console.log(error);
      }
    }

    await order.deleteOne();

    return [];
  }),
});
