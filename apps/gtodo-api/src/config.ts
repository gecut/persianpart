import { env } from '@gecut/utilities/env';

type Config = {
  host: string;
  port: number;
  db: string;
};

export default <Config>{
  host: env('HOST', '0.0.0.0', 'string'),
  port: env('PORT', 3000, 'number'),
  db: env('DB', 'db/gtodo-api/todo.json', 'string'),
};
