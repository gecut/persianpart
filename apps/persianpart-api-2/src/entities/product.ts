import mongoose from 'mongoose';
import { z } from 'zod';

import type { BaseEntity, JsonEntity } from './_base';

export interface ProductInterface extends BaseEntity {
  nickId: string;
  name: string;
  unit: string;
  quantity: number;
  price: number;
}

export type ProductJsonEntity = JsonEntity<ProductInterface>;

export const productSchema = new mongoose.Schema<ProductInterface>(
  {
    nickId: { type: String, required: false },
    name: { type: String, required: true },
    unit: { type: String, required: true },
    price: { type: Number, default: 0, required: true },
    quantity: { type: Number, default: 0, required: true },
  },
  {
    timestamps: true,
  },
);

export const productInputValidation = z
  .object({
    _id: z.string(),
    nickId: z.string(),
    name: z.string(),
    unit: z.string(),
    price: z.number(),
    quantity: z.number(),
  })
  .partial({
    _id: true,
    nickId: true,
  });

export const ProductModel = mongoose.model<ProductInterface>(
  'Product',
  productSchema,
);
