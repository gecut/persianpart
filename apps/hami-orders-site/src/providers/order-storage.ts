import { setProvider } from '@gecut/signal';

import config from '../config';

import type { Projects } from '@gecut/types';

setProvider('order-storage', async () => {
  return await fetch(`${config.apiUrl}/order-all-storage/`).then(
    (response): Promise<Projects.Hami.Routes['order-storage']> =>
      response.json(),
  );
});
