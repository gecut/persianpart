import { Projects } from '@gecut/types';

import { config, logger } from '../lib/config';
import { nanoServer } from '../lib/server';
import { storageClient } from '../lib/storage';
import { requireSignedIn } from '../util/require-signed-in';

nanoServer.route('PATCH', '/customer-storage/', async (connection) => {
  logger.logMethod?.('patch-customer-storage');

  const user = await requireSignedIn(connection);

  const bodyJson = await connection.requireJsonBody<{
    data: Array<Partial<Projects.Hami.Customer>>;
  }>();

  for (let customer of bodyJson.data) {
    customer = await storageClient.set(
      Projects.Hami.customerRequire({
        creatorId: user.id,
        ...customer,
      }),
      config.customerStorage,
    );
  }

  return {
    ok: true,
    data: {},
  };
});
