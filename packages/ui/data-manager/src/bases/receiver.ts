import localStorageJson from '@gecut/utilities/local-storage-json';
import { nextAnimationFrame } from '@gecut/utilities/polyfill';

import { globalObject } from '../core';

import { SubscribeService } from './subscribe';

import type { ReceiverFunction, ReceiverServiceCache } from '../types';

const MemoryCache: Record<string, Promise<unknown>> = {};

export class ReceiverService<Data> extends SubscribeService<Data> {
  constructor(
    name: string,
    receiverFunction: ReceiverFunction<Data>,
    cache: ReceiverServiceCache = false,
  ) {
    super();

    this.cache = cache;
    this.name = name;
    this.receiverFunction = receiverFunction.bind(null);
    this.serviceName = 'receiver';

    globalObject[name] = this as ReceiverService<unknown>;

    this.logger.methodArgs?.('constructor', { name });

    if (this.cache === 'local-storage') {
      this.readLocalStorageCache();
    }

    nextAnimationFrame(() => this.update());
  }

  updateIndex = 0;
  cache: ReceiverServiceCache = false;

  private receiverFunction: ReceiverFunction<Data>;
  private firstPending = false;

  async update(force = false) {
    this.logger.methodArgs?.('update', { force });

    const label = `RequestService.receive(${this.updateIndex++})`;

    this.logger.time?.(label);

    if (
      (force === false && this.status === 'pending') ||
      (this.name != null && this.name in MemoryCache)
    ) {
      return MemoryCache[this.name!] ?? this.logger.timeEnd?.(label);
    }

    const request = this.receiverFunctionWithErrorHandling().then((data) => {
      if (this.name != null) delete MemoryCache[this.name];

      return data;
    });

    if (this.name != null) MemoryCache[this.name] = request;

    const data = await request;

    if (data != null) {
      this.share(data);

      if (this.cache === 'local-storage') {
        this.writeLocalStorageCache();
      }
    }

    this.logger.timeEnd?.(label);
  }

  async data(): Promise<Data | null> {
    this.logger.methodFull?.('data', {}, this._data);

    if (this._data == null) await this.update();

    return this._data;
  }

  clearCache() {
    if (this.cache === 'local-storage') return this.clearLocalStorageCache();
  }

  protected async receiverFunctionWithErrorHandling(): Promise<Data | null> {
    this.logger.method?.('receiverFunctionWithErrorHandling');

    if (!this.firstPending) {
      this.status = 'first-pending';

      this.firstPending = true;
    } else {
      this.status = 'pending';
    }

    try {
      const data = await this.receiverFunction();
      this.status = 'success';

      return data;
    } catch (error) {
      this.status = 'error';

      this.logger.error(
        'receiverFunctionWithErrorHandling',
        'get_data_failed',
        error,
      );
    }

    return null;
  }

  protected async writeLocalStorageCache() {
    if (this.name == null) return;

    return localStorageJson.set(this.name, await this.data());
  }
  protected readLocalStorageCache() {
    if (this.name == null) return;

    this._data = localStorageJson.get(this.name, null);

    return this._data;
  }
  protected clearLocalStorageCache() {
    if (this.name == null) return;

    return localStorageJson.set(this.name, '');
  }
}
