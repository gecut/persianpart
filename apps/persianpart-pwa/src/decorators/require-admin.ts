import type { UserJsonEntity } from '#persianpart/entities/user';
import { router } from '#persianpart/ui/router';

import { request } from '@gecut/signal';
import { untilNextFrame } from '@gecut/utilities/delay';

import type { Constructor } from '@gecut/types';
import type { LitElement } from 'lit';

export default function requiredAdmin<T extends Constructor<LitElement>>(
  target: T,
): T {
  return class extends target {
    override connectedCallback() {
      request('fullscreenLoader', 'start');

      let user: Partial<UserJsonEntity>;

      request('data.user', {}, 'cacheFirst')
        .then((_user) => {
          user = _user;
        })
        .finally(async () => {
          if (user?._id == null) {
            router.go('sign-in');
          } else if (user.permission != 'root') {
            router.go('user-profile');
          }

          await untilNextFrame();

          request('fullscreenLoader', 'end');
        });

      super.connectedCallback();
    }
  };
}
