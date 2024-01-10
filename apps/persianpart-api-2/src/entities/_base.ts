import type mongoose from 'mongoose';

export interface BaseEntity {
  _id: mongoose.Types.ObjectId;

  createdAt: Date;
}

export type JsonEntity<T extends BaseEntity> = Omit<T, '_id' | 'createdAt'> & {
  _id?: string;
  createdAt?: string;
};
