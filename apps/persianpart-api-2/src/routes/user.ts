import type { UserJsonEntity, UserInterface } from '#persianpart/entities/user';
import {
  userChangePasswordInputValidation,
  userInputValidation,
  UserModel,
} from '#persianpart/entities/user';
import {
  adminProcedure,
  publicProcedure,
  router,
  userProcedure,
} from '#persianpart/libs/trpc';

import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const user = router({
  info: userProcedure.query(async (options) => {
    return options.ctx.user as unknown as UserJsonEntity;
  }),
  repository: adminProcedure.query(async () => {
    return (await UserModel.find()) as UserJsonEntity[];
  }),
  signIn: publicProcedure
    .input(
      z.object({
        phoneNumber: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async (opts) => {
      const user = (await UserModel.findOne({
        phoneNumber: opts.input.phoneNumber,
        password: opts.input.password,
      })) as UserInterface;

      if (user == null) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'user-not-found',
        });
      }

      if (user.active === false) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'user-forbidden',
        });
      }

      return user;
    }),
  create: adminProcedure
    .input(userInputValidation)
    .mutation(async (opts) => await UserModel.create(opts.input)),
  edit: adminProcedure.input(userInputValidation).mutation(async (opts) => {
    const user = await UserModel.findById(opts.input._id);

    if (user == null) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'user-not-found',
      });
    }

    for (const key of Object.keys(opts.input)) {
      const newValue = opts.input[key];
      const oldValue = user[key];

      if (newValue != null && newValue !== oldValue) {
        user[key] = newValue;
      }
    }

    user.save();

    return user;
  }),
  changePassword: userProcedure
    .input(userChangePasswordInputValidation)
    .mutation(async (options) => {
      const user = await UserModel.findById(options.ctx.user.id);

      if (user.password !== options.input.currentPassword) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'user-current-password-incorrect',
        });
      }

      if (options.input.newPassword !== options.input.confirmNewPassword) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'user-new-password-and-confirm-new-password-not-equal',
        });
      }

      user.password = options.input.newPassword;

      user.save();
    }),
});
