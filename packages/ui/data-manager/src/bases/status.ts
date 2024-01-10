import { LoggerService } from './logger';

import type { Status, OnStatusChangeFunction } from '../types';

export class StatusService<Data> extends LoggerService {
  protected _data: Data | null = null;

  private _status: Status = 'success';
  private onStatusChangeFunctions: Array<OnStatusChangeFunction<Data>> = [];

  get status(): Status {
    return this._status;
  }
  set status(_: Status) {
    this._status = _;

    this.logger.property?.('status', _);

    for (const func of this.onStatusChangeFunctions) {
      func(this.status, this._data);
    }
  }

  async on(name: 'status-change', _func: OnStatusChangeFunction<Data>) {
    this.logger.methodArgs?.('on', { name, _func });

    if (name === 'status-change') {
      this.onStatusChangeFunctions.push(_func);

      _func(this.status, this._data);
    }
  }

  async rm(name: 'status-change', _func: OnStatusChangeFunction<Data>) {
    this.logger.methodArgs?.('rm', { name, _func });

    if (name === 'status-change') {
      this.onStatusChangeFunctions = this.onStatusChangeFunctions.filter(
        (func) => func === _func,
      );
    }
  }
}
