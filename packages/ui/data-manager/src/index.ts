import {
  cancelNextAnimationFrame,
  nextAnimationFrame,
} from '@gecut/utilities/polyfill';

import { ReceiverService } from './bases/receiver';
import { SenderService } from './bases/sender';
import { logger } from './core';

import type { ReceiverServiceObject, SenderServiceObject } from './types';
import type { Writable } from '@gecut/types';

export class DataManager {
  /**
   * The constructor function initializes receiver and sender services based on the provided objects.
   * @param receivers - The `receivers` parameter is an object that contains receiver services. Each
   * receiver service is represented by a key-value pair, where the key is the name of the receiver
   * service and the value is an object of type `ReceiverServiceObject`. The `ReceiverServiceObject`
   * contains the necessary information for creating
   * @param senders - The `senders` parameter is an object that contains sender services. Each sender
   * service is represented by a key-value pair, where the key is the name of the sender service and
   * the value is an object of type `SenderServiceObject`. The `SenderServiceObject` has the following
   * properties:
   */
  constructor(
    receivers: Partial<{
      [T in keyof GecutReceiverServices]: ReceiverServiceObject<
        GecutReceiverServices[T]
      >;
    }> = {},
    senders: Partial<{
      [T in keyof GecutSenderServices]: SenderServiceObject<
        GecutSenderServices[T]
      >;
    }> = {},
  ) {
    for (const receiverName of Object.keys(receivers) as Array<
      keyof GecutReceiverServices
    >) {
      const receiverObject = receivers[receiverName];

      if (receiverObject != null) {
        this.receivers[receiverName] = new ReceiverService(
          receiverName,
          receiverObject.receiverFunction as never,
          receiverObject.cache,
        ) as never;

        this.receivers[receiverName]?.on('status-change', (status) => {
          if (status === 'pending') {
            this.pendingCount++;
          } else {
            this.pendingCount--;
          }
        });
      }
    }

    for (const senderName of Object.keys(senders) as Array<
      keyof GecutSenderServices
    >) {
      const senderObject = senders[senderName];

      if (senderObject != null) {
        this.senders[senderName] = new SenderService(
          senderName,
          senderObject.senderFunction as never,
          senderObject.dependencies,
        ) as never;

        this.senders[senderName]?.on('status-change', (status) => {
          if (status === 'pending') {
            this.pendingCount++;
          } else {
            this.pendingCount--;
          }
        });
      }
    }
  }

  /* The `receivers` property in the `DataManager` class is defined as a writable object that contains
  receiver services. It uses the `Writable` utility type from the `@gecut/types` module to allow
  modifications to the property. */
  receivers: Writable<
    Partial<{
      [T in keyof GecutReceiverServices]: ReceiverService<
        GecutReceiverServices[T]
      >;
    }>
  > = {};

  /* The `senders` property in the `DataManager` class is defined as a writable object that contains
  sender services. It uses the `Writable` utility type from the `@gecut/types` module to allow
  modifications to the property. */
  senders: Writable<
    Partial<{
      [T in keyof GecutSenderServices]: SenderService<GecutSenderServices[T]>;
    }>
  > = {};

  private _pendingCount = 0;
  private _onPendingFunctions: Array<(pending: boolean) => void> = [];
  private _pendingCountDebounce?: number;

  on(name: 'pending', _func: (pending: boolean) => void) {
    logger.methodArgs?.('on', { name, _func });

    if (name === 'pending') {
      this._onPendingFunctions.push(_func.bind(this));
    }
  }
  clearCache(...names: Array<keyof GecutReceiverServices>) {
    if (names.length === 0) {
      names = Object.keys(this.receivers) as Array<keyof GecutReceiverServices>;
    }

    for (const receiver of Object.values(this.receivers).filter(
      (r) =>
        r.name != null && names.includes(r.name as keyof GecutReceiverServices),
    )) {
      receiver.clearCache();
    }
  }

  get pendingCount() {
    return this._pendingCount;
  }
  set pendingCount(_: number) {
    this._pendingCount = Math.max(_, 0);

    logger.property?.('pendingCount', this._pendingCount);

    if (this._pendingCountDebounce != null) {
      cancelNextAnimationFrame(this._pendingCountDebounce);
    }

    this._pendingCountDebounce = nextAnimationFrame(() => {
      for (const func of this._onPendingFunctions) {
        func.call(this, this.pendingCount >= 0);
      }
    });
  }
}
