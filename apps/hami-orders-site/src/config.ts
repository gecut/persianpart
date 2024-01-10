import proxyConfig from '../proxy.conf.json';

import type { Projects } from '@gecut/types';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Signals extends Projects.Hami.Routes {}
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Providers
    extends Record<keyof Projects.Hami.Routes, Record<string, never>> {}
}

const config = {
  financialUnit: 'ریال',
  apiUrl: proxyConfig['/api/v0'].target,
  version: '0.0.1',
};

export default config;
