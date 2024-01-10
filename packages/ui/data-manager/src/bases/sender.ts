import { untilNextFrame } from '@gecut/utilities/delay';
import { nextAnimationFrame } from '@gecut/utilities/polyfill';

import { globalObject, senderLogger } from '../core';

import { SubscribeService } from './subscribe';

import type { SenderFunction } from '../types';

export class SenderService<Data> extends SubscribeService<Data> {
  constructor(
    name: string,
    senderFunction: SenderFunction<Data>,
    dependencies: string[] | '*',
  ) {
    super();

    this.serviceName = 'sender';
    this.name = name;
    this.senderFunction = senderFunction.bind(null);
    this.dependencies =
      dependencies === '*' ? Object.keys(globalObject) : dependencies;

    this.logger.methodArgs?.('constructor', {
      name,
      senderFunction,
      dependencies,
    });
  }

  dependencies: string[] = [];
  updateIndex = 0;

  private senderFunction: SenderFunction<Data>;

  async send(data: Data): Promise<void> {
    senderLogger.methodFull?.('send', {}, data);

    const label = `SenderService.send(${this.updateIndex++})`;

    senderLogger.time?.(label);

    this._data = data;

    if (this._data != null) {
      await this.senderFunctionWithErrorHandling(this._data);
    }

    this.share(this._data);
    this.updateDependencies();

    senderLogger.timeEnd?.(label);
  }

  protected async senderFunctionWithErrorHandling(data: Data): Promise<void> {
    this.logger.methodArgs?.('senderFunctionWithErrorHandling', {
      data,
    });

    this.status = 'pending';

    try {
      await untilNextFrame();

      const response = await Promise.resolve(this.senderFunction(data));
      this.status = 'success';

      return response;
    } catch (error) {
      this.status = 'error';

      senderLogger.error(
        'senderFunctionWithErrorHandling',
        'post_data_failed',
        error,
      );
    }
  }

  private updateDependencies(): void {
    this.logger.method?.('updateDependencies');

    nextAnimationFrame(() => {
      for (const dependencyKey of this.dependencies) {
        const dependency = globalObject[dependencyKey];

        dependency.clearCache();

        if (dependency != null) {
          dependency.update(true);
        } else {
          senderLogger.warning(
            'updateDependencies',
            'dependency_key_not_found',
            `dependency key ('${dependencyKey}') not found`,
          );
        }
      }
    });
  }
}
