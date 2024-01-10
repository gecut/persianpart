import mongoose from 'mongoose';
import { z } from 'zod';

import { productInputValidation } from './product';
import { userInputValidation } from './user';

import type { BaseEntity, JsonEntity } from './_base';
import type { ProductJsonEntity } from './product';
import type { UserInterface, UserJsonEntity } from './user';
import type { ArrayValues } from '@gecut/types';

export const orderStatusList = [
  'accepted',
  'awaiting-confirmation',
  'canceled',
] as const;

export interface OrderInterface extends BaseEntity {
  products: Array<
    ProductJsonEntity & {
      amount: number;
    }
  >;
  status: ArrayValues<typeof orderStatusList>;
  user: UserInterface;
}

export type OrderJsonEntity = Omit<JsonEntity<OrderInterface>, 'user'> & {
  user: UserJsonEntity;
};
export type OrderProduct = OrderJsonEntity['products'][number];

export const orderSchema = new mongoose.Schema<OrderInterface>(
  {
    products: [
      {
        name: { type: String, required: true },
        unit: { type: String, required: true },
        price: { type: Number, default: 0, required: true },
        quantity: { type: Number, default: 0, required: true },
        amount: { type: Number, default: 0, required: true },
      },
    ],
    status: {
      type: String,
      default: 'awaiting-confirmation',
      required: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  },
);

export const orderProductInputValidation = productInputValidation.extend({
  amount: z.number(),
});
export const orderInputValidation = z
  .object({
    _id: z.string(),
    products: z.array(orderProductInputValidation),
    user: userInputValidation,
    status: z.string(),
  })
  .partial({
    _id: true,
  });

export const OrderModel = mongoose.model<OrderInterface>('Order', orderSchema);
