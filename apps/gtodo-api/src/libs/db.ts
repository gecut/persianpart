import path from 'node:path';

import debounce from '@gecut/utilities/debounce';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

import config from '../config';

import { logger } from './signale';


export interface TodoInterface {
  status: boolean;
  message: string;
  id?: string;
  createdAt?: number;
  updatedAt?: number;
}


const file = path.resolve(config.db);

const adapter = new JSONFile<TodoInterface[]>(file);
export const db = new Low<TodoInterface[]>(adapter, []);
export const debouncedWrite = debounce(() => db.write(), 1_000);

db.read()
  .then(() => {
    logger.scope('[db]').success('Database Read');
  })
  .catch((error) => {
    logger.scope('[db]').error('Database Read', error);
  });

export type dbType = typeof db;
