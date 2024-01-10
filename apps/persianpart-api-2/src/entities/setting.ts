import mongoose from 'mongoose';
import { z } from 'zod';

import type { BaseEntity, JsonEntity } from './_base';
import type { ArrayValues } from '@gecut/types';

export const settingStatusList = ['up', 'down'] as const;

export interface SettingInterface extends BaseEntity {
  status: ArrayValues<typeof settingStatusList>;
  productsHistory: Array<Date>;
}

export type SettingJsonEntity = JsonEntity<SettingInterface>;

const settingSchema = new mongoose.Schema<SettingInterface>(
  {
    status: { type: String, required: true, default: 'up' },
    productsHistory: [{ type: Date, required: true }],
  },
  {
    timestamps: true,
  },
);

export const settingInputValidation = z.object({
  status: z.string(),
});

export const SettingModel = mongoose.model('Setting', settingSchema);
