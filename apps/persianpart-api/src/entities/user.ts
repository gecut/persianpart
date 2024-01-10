import mongoose from 'mongoose';
import { z } from 'zod';

import type { BaseEntity, JsonEntity } from './_base';

export interface UserInterface extends BaseEntity {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  password: string;
  permission: 'root' | 'user';
  active: boolean;
}

export interface UserChangePasswordInterface {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export type UserJsonEntity = JsonEntity<UserInterface>;
export type UserChangePasswordJsonEntity = UserChangePasswordInterface;

export const userSchema = new mongoose.Schema<UserInterface>(
  {
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    phoneNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    permission: { type: String, default: 'user', required: true },
    active: { type: Boolean, default: true, required: true },
  },
  {
    timestamps: true,
  },
);

export const userInputValidation = z
  .object({
    _id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    phoneNumber: z.string(),
    password: z.string(),
    permission: z.string(),
    active: z.boolean(),
  })
  .partial({
    _id: true,
    firstName: true,
    lastName: true,
    password: true,
    active: true,
  });

export const userChangePasswordInputValidation = z.object({
  currentPassword: z.string(),
  newPassword: z.string(),
  confirmNewPassword: z.string(),
});

export const UserModel = mongoose.model<UserInterface>('User', userSchema);
