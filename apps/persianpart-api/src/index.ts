import { createHTTPServer } from '@trpc/server/adapters/standalone';
import cors from 'cors';
import 'reflect-metadata';

import config from './config';
import { appRouter } from './libs/app';
import { createContext } from './libs/context';
import './libs/db';
import { globalLogger } from './libs/signale';

let requestCounter = 0;
const routerLogger = globalLogger.scope('router');

const server = createHTTPServer({
  middleware: cors(),
  router: appRouter,
  createContext,
  responseMeta(options) {
    const allPublic =
      options.paths != null &&
      options.paths.every((path) => path.includes('public'));

    const allOk = options.errors.length === 0;

    const isQuery = options.type === 'query';

    if (allPublic && allOk && isQuery) {
      return {
        headers: {
          'Cache-Control': `s-maxage=1, stale-while-revalidate=${60 * 60 * 24}`,
        },
      };
    }
    return {};
  },
});

server.listen(config.port, config.host);

server.server.on('listening', () => {
  globalLogger.start(`Server Listening ${config.host}:${config.port}`);
});
server.server.on('request', (request, response) => {
  const label = `(${String(++requestCounter).padStart(5, '·')}) ${
    request.method
  } ${request.url}`;

  routerLogger.time(label);

  response.once('close', () => {
    routerLogger.timeEnd(label);
  });
});
