import { createLogger } from '@gecut/logger';

import type { ReceiverService } from './bases/receiver';

export const logger = createLogger('gecut/data-manager');
export const receiverLogger = createLogger('gecut/data-manager/receiver');
export const senderLogger = createLogger('gecut/data-manager/sender');
export const subscribeLogger = createLogger('gecut/data-manager/subscribe');

export const globalObject: Record<string, ReceiverService<unknown>> = {};
