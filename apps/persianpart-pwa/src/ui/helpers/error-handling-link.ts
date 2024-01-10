import type { AppRouter } from '#persianpart/libs/app';

import i18n from '@gecut/i18n';
import { request } from '@gecut/signal';
import localStorageJson from '@gecut/utilities/local-storage-json';
import { observable } from '@trpc/server/observable';

import type { TRPCLink } from '@trpc/client';

export const errorHandlingLink: TRPCLink<AppRouter> = () => {
  return ({ next, op }) => {
    return observable((observer) => {
      const unsubscribe = next(op).subscribe({
        next(value) {
          observer.next(value);
        },
        error(error) {
          if (error.message === 'unauthorized') {
            localStorageJson.set('user.id', null);
          }

          if (navigator.onLine !== true) {
            request('messenger', {
              attributes: {
                message: i18n.msg(
                  'you-are-offline-error-communicating-with-server',
                ),
                closeButton: true,
              },
            });
          } else {
            const errorMessageTranslated = i18n.msg(error.message);

            request('messenger', {
              attributes: {
                message:
                  errorMessageTranslated !== error.message
                    ? errorMessageTranslated
                    : i18n.msg('error-communicating-with-the-server'),
                closeButton: true,
              },
            });
          }

          observer.error(error);
        },
        complete() {
          observer.complete();
        },
      });

      return unsubscribe;
    });
  };
};
