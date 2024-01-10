import type { AppRouter } from '#gtodo/libs/app';

import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';

export const api = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'https://api.todo.gecut.ir',
    }),
  ],
  transformer: undefined,
});
