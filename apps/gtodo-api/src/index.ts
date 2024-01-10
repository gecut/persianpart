import { createServer } from 'node:http';

import { createHTTPHandler } from '@trpc/server/adapters/standalone';
import cors from 'cors';
import 'reflect-metadata';

import config from './config';
import { appRouter } from './libs/app';
import './libs/db';
import { logger } from './libs/signale';

const handler = createHTTPHandler({
  router: appRouter,
  middleware: cors(),
});

const server = createServer((request, response) => {
  if (request.url === '/health') {
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.write('ok');
    response.end();
  } else {
    handler(request, response);
  }
});

server.listen(config.port, config.host);

server.on('listening', () => {
  logger.success(`Server Listening ${config.host}:${config.port}`);
});

let requestCounter = 0;
const routerLogger = logger.scope('router');

server.on('request', (request, response) => {
  const label = `(${String(++requestCounter).padStart(5, '·')}) ${
    request.method
  } ${request.url}`;

  routerLogger.time(label);

  response.once('close', () => {
    routerLogger.timeEnd(label);
  });
});
