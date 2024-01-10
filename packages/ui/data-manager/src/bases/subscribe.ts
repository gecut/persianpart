import isEqual from '@gecut/utilities/is-equal';

import { StatusService } from './status';

import type { SubscribeFunction } from '../types';

export class SubscribeService<Data> extends StatusService<Data> {
  protected _subscribeStorage: Record<string, SubscribeFunction<Data>> = {};

  subscribe(key: string, func: SubscribeFunction<Data>): void {
    this.logger.methodArgs?.('subscribe', { key, func });

    if (this._subscribeStorage[key] != null) {
      this.logger.warning(
        'subscribe',
        'subscribe_key_exists',
        `this key ('${key}') is exists in subscribe storage`,
      );
    }

    // * run subscribe function for initial
    if (this._data != null) func(this._data);

    this._subscribeStorage[key] = func;
  }

  unsubscribe(key: string): void {
    this.logger.methodArgs?.('unsubscribe', { key });

    if (this._subscribeStorage[key] == null) {
      return this.logger.warning(
        'unsubscribe',
        'subscribe_key_not_exists',
        `this key ('${key}') is not exists in subscribe storage`,
      );
    }

    delete this._subscribeStorage[key];
  }

  protected share(newData: Data, force = false): void {
    const _isEqual = isEqual(this._data, newData);

    this.logger.methodArgs?.('share', {
      newData,
      oldData: this._data,
      isEqual: _isEqual,
    });

    if (force === false && (newData == null || _isEqual)) return;

    this._data = newData;

    for (const func of Object.values(this._subscribeStorage)) {
      func(this._data);
    }
  }
}
