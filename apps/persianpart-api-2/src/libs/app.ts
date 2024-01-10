import { order } from '#persianpart/routes/order';
import { product } from '#persianpart/routes/product';
import { setting } from '#persianpart/routes/setting';
import { user } from '#persianpart/routes/user';

import { publicProcedure, router } from './trpc';

export const appRouter = router({
  health: publicProcedure.query(() => {
    return {
      app: '..:: Gecut Hami API ::..',
      message: 'Hello ;)',
    };
  }),
  product,
  order,
  user,
  setting,
});

export type AppRouter = typeof appRouter;
