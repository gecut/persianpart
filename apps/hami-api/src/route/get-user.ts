import { logger } from '../lib/config';
import { nanoServer } from '../lib/server';
import { tokenGenerator } from '../lib/token';
import { requireSignedIn } from '../util/require-signed-in';

import type { Projects } from '@gecut/types';

nanoServer.route(
  'GET',
  '/user/',
  async (connection): Promise<Projects.Hami.Routes['user']> => {
    logger.logMethod?.('get-user');

    const user = await requireSignedIn(connection);

    return {
      ok: true,
      data: {
        ...user,
        token: tokenGenerator.generate(user.id),
      },
    };
  },
);
