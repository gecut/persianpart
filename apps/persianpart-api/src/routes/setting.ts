import type { SettingJsonEntity } from '#persianpart/entities/setting';
import {
  settingInputValidation,
  SettingModel,
} from '#persianpart/entities/setting';
import { router, adminProcedure, userProcedure } from '#persianpart/libs/trpc';

export const setting = router({
  repository: userProcedure.query(
    async () =>
      ((await SettingModel.findOne({})) ??
        (await SettingModel.create({}))) as SettingJsonEntity,
  ),
  set: adminProcedure
    .input(settingInputValidation)
    .mutation(async (options) => {
      const setting =
        (await SettingModel.findOne({})) ?? (await SettingModel.create({}));

      setting.status = (options.input.status ??
        'up') as SettingJsonEntity['status'];

      setting.productsHistory ??= [];

      setting.save();
    }),
});
