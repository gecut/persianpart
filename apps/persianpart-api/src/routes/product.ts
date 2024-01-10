import type { ProductJsonEntity } from '#persianpart/entities/product';
import {
  productInputValidation,
  ProductModel,
} from '#persianpart/entities/product';
import { SettingModel } from '#persianpart/entities/setting';
import { adminProcedure, userProcedure, router } from '#persianpart/libs/trpc';

import { z } from 'zod';

export const product = router({
  repository: userProcedure.query(async () => {
    return (await ProductModel.find({
      quantity: { $gte: 1 },
    }).exec()) as unknown as ProductJsonEntity[];
  }),
  create: adminProcedure
    .input(z.array(productInputValidation))
    .mutation(async (opts) => {
      await ProductModel.deleteMany();

      await ProductModel.create(opts.input);

      const setting =
        (await SettingModel.findOne({})) ?? (await SettingModel.create({}));

      setting.productsHistory ??= [];

      setting.productsHistory.unshift(new Date());

      setting.productsHistory = setting.productsHistory.filter(
        (date, index) => {
          date = new Date(date);

          const duplicateIndex = setting.productsHistory.findIndex(
            (_date) => date.toDateString() === _date.toDateString(),
          );

          return index === duplicateIndex;
        },
      );

      if (setting.productsHistory.length > 30) {
        setting.productsHistory.pop();
      }

      setting.save();
    }),
});
