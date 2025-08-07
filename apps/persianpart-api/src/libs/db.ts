import { SettingModel } from '#persianpart/entities/setting';
import { UserModel } from '#persianpart/entities/user';

import mongoose from 'mongoose';

import config from '../config';

import { globalLogger } from './signale';

const dbLogger = globalLogger.scope('database');

export async function initializeDB() {
  dbLogger.await('Initializing Database');

  try {
    await mongoose.connect(config.database.url);

    dbLogger.success('Database Initialized');
  } catch (error) {
    dbLogger.error('Initializing Database Error:', error);
  }
}

export async function addRootUser() {
  const addRootUserLogger = dbLogger.scope('addRootUser');

  if (((await UserModel.count?.()) ?? 1) >= 1) {
    const user = await UserModel.findOne({});

    addRootUserLogger.success('User:', user);

    return;
  }

  addRootUserLogger.info(`addRootUser`);

  const user = await UserModel.create({
    firstName: 'محمدمهدی',
    lastName: 'زمانیان',
    password: 'mmz1384',
    permission: 'root',
    phoneNumber: '09155595488',
  });

  addRootUserLogger.success('User Created:', user);
}
export async function addSetting() {
  if (((await SettingModel.count?.()) ?? 1) > 0) return;

  const addSettingLogger = dbLogger.scope('addSetting');

  addSettingLogger.info(`addSetting`);

  const setting = await SettingModel.create({
    status: 'up',
  });

  addSettingLogger.success('Setting Created:', setting);
}

initializeDB()
  .then(() => addRootUser())
  .then(() => addSetting());
