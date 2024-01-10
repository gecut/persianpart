import { env } from '@gecut/utilities/env';

type Config = {
  logger: boolean;
  host: string;
  port: number;
  database: {
    url: string;
  };
};

export default <Config>{
  logger: env('DEBUG', '1', 'string') === '1',

  host: env('HOST', '0.0.0.0', 'string'),
  port: env('PORT', 3000, 'number'),

  database: {
    url: env(
      'DATABASE_URL',
      'mongodb://root:SXtEaCZGuryBaeGcAXMpl3KnMdFd5keG@5edd8e38-b84c-4669-a596-6002e6611838.hsvc.ir:31210/?authMechanism=DEFAULT',
      'string',
    ),
  },
};
