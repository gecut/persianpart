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
      'mongodb://root:SXtEaCZGuryBaeGcAXMpl3KnMdFd5keG@3b94eaef-0f84-4c7a-a26c-536bd3cde1ec.hsvc.ir:30025/?authMechanism=DEFAULT',
      'string',
    ),
  },
};
