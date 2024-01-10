import { createLogger } from '@gecut/logger';
import { join } from '@gecut/utilities/join';
import { cancelNextAnimationFrame, nextAnimationFrame } from '@gecut/utilities/polyfill';
import {
  type LitElement,
  type ReactiveController,
  type ReactiveControllerHost,
  noChange,
} from 'lit';

import type { DataManager } from '../index';
import type { Status } from '../types';
import type { Logger } from '@gecut/logger';
import type { RenderResult, SanitizeFunction } from '@gecut/types';

export type ReceiverControllerRenderers<Data> = Partial<{
  success: (data?: Data) => RenderResult;
  pending: () => RenderResult;
  error: () => RenderResult;
  'first-pending': () => RenderResult;
}>;

export class ReceiverController<
  Name extends keyof GecutReceiverServices,
  LocalDataManager extends DataManager,
  Host extends ReactiveControllerHost & LitElement,
> implements ReactiveController {
  /**
   * This constructor function initializes the properties of a class instance.
   * @param host - The `host` parameter is an object that represents the host element where the
   * controller is being added. It should implement the `ReactiveControllerHost` interface, which
   * provides methods for adding and removing controllers.
   * @param {Name} name - The `name` parameter is a variable of type `Name`. It is used to store the
   * name of the controller.
   * @param {LocalDataManager} dataManager - The `dataManager` parameter is an instance of the
   * `_DataManager` class. It is used to manage and handle data related operations within the
   * controller.
   *
   * @example
   *
   * ```ts
   * //@customElement("test-receiver")
   * export class TestReceiver extends LitElement {
   *    todoStorage = new ReceiverController(this, "todo-storage", dataManager);
   *
   *    override render() {
   *        return html`${this.todoStorage.value}`;
   *    }
   * }
   * ```
   */
  constructor(
    host: Host,
    propName: SanitizeFunction<keyof Host>,
    name: Name,
    dataManager: LocalDataManager,
    renderers: ReceiverControllerRenderers<GecutReceiverServices[Name]>,
  ) {
    this.name = name;
    this.dataManager = dataManager;
    this.propName = propName;
    this.renderers = renderers;

    this.subscribeKey = join(
      '-',
      host.tagName.toLowerCase(),
      this.name,
      this.uuid,
    );

    (this.host = host).addController(this);

    this.logger = createLogger(
      `gecut/data-manager/receiver-controller/${
        this.name
      }/${this.host.tagName.toLowerCase()}`,
    );

    this.logger.methodArgs?.('constructor', {
      host,
      propName,
      name,
      dataManager,
      renderers,
    });
  }

  subscribeKey: string;
  value?: GecutReceiverServices[Name];
  status: Status = 'first-pending';
  logger: Logger;

  private name: Name;
  private host: Host;
  private propName: SanitizeFunction<keyof Host>;
  private dataManager: LocalDataManager;
  private uuid = new Date().getTime().toString(16);
  private renderers: ReceiverControllerRenderers<GecutReceiverServices[Name]>;
  private statusRendered?: Status;
  private updateDebounce?: number;
  private _changeStatus = this.changeStatus.bind(this);

  hostConnected() {
    this.dataManager.receivers[this.name]?.subscribe(
      this.subscribeKey,
      (data) => {
        this.value = data;
        this.statusRendered = undefined;

        this.requestUpdate();
      },
    );

    this.dataManager.receivers[this.name]?.on(
      'status-change',
      this._changeStatus,
    );

    nextAnimationFrame(
      () => this.dataManager.receivers[this.name]?.data(),
    );
  }
  hostDisconnected() {
    this.dataManager.receivers[this.name]?.unsubscribe(this.subscribeKey);

    this.dataManager.receivers[this.name]?.rm(
      'status-change',
      this._changeStatus,
    );
  }

  render(outUpdate = false): RenderResult {
    let result: RenderResult | undefined;

    if (this.status === this.statusRendered && outUpdate === false) {
      this.logger.methodFull?.('render', {}, 'noChange');

      return noChange;
    }

    this.statusRendered = this.status;

    switch (this.status) {
      case 'success':
        result = this.renderers['success']?.call(this.host, this.value);
        break;
      case 'pending':
        result = this.renderers['pending']?.call(this.host);
        break;
      case 'error':
        result = this.renderers['error']?.call(this.host);
        break;
      case 'first-pending':
        result = this.renderers['first-pending']?.call(this.host);
        break;
    }

    this.logger.methodFull?.(
      'render',
      {},
      (this.status ?? 'noChange') +
        (result != null ? '-exists' : '-not-exists'),
    );

    return result ?? noChange;
  }

  get service() {
    return this.dataManager.receivers[this.name];
  }

  private changeStatus(status: Status) {
    this.logger.methodArgs?.('changeStatus', { status });

    this.status = status;

    this.requestUpdate();
  }

  private requestUpdate() {
    this.logger.method?.('requestUpdate');

    if (this.updateDebounce) cancelNextAnimationFrame(this.updateDebounce);

    this.updateDebounce = nextAnimationFrame(() =>
      this.host.requestUpdate(this.propName),
    );
  }
}
