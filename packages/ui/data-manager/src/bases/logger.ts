import { createLogger } from '@gecut/logger';

import type { Logger } from '@gecut/logger';

export class LoggerService {
  constructor() {
    this.recreateLogger();
  }

  logger!: Logger;

  private _name?: string;
  private _serviceName?: 'receiver' | 'sender';

  get name(): string | undefined {
    return this._name;
  }
  set name(_: string | undefined) {
    this._name = _;

    this.recreateLogger();
  }

  get serviceName(): 'receiver' | 'sender' | undefined {
    return this._serviceName;
  }
  set serviceName(_: 'receiver' | 'sender' | undefined) {
    this._serviceName = _;

    this.recreateLogger();
  }

  private recreateLogger() {
    this.logger = createLogger(
      `gecut/data-manager/${this.serviceName}/${this.name}`,
    );
  }
}
