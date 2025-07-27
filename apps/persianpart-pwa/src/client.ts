import type { AppRouter } from '#persianpart/libs/app';

import { request } from '@gecut/signal';
import localStorageJson from '@gecut/utilities/local-storage-json';
import { createTRPCProxyClient, httpLink } from '@trpc/client';

import { errorHandlingLink } from './ui/helpers/error-handling-link';

export const api = createTRPCProxyClient<AppRouter>({
  links: [
    errorHandlingLink,
    httpLink({
      url: 'https://api.persianpartshop.ir',
      fetch: (input: RequestInfo | URL, init?: RequestInit | undefined) => {
        request('loading', 'start');

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        return fetch(input, init)
          .then((response) => {
            clearTimeout(timeoutId);

            return response;
          })
          .finally(() => {
            request('loading', 'end');
          });
      },
      headers() {
        const userId = localStorageJson.get('user.id', '');

        if (userId !== '') {
          return {
            Authorization: 'Bearer ' + userId,
          };
        }

        return {};
      },
    }),
  ],
  transformer: undefined,
});
