import { Signale } from 'signale';

import config from '../config';

export const globalLogger = new Signale({
  disabled: !config.logger,
});
