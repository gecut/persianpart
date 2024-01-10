import icons from '#hami/ui/icons';

import i18n from '@gecut/i18n';
import { sanitizer } from '@gecut/utilities/sanitizer';

import type { Projects } from '@gecut/types';
import type { M3 } from '@gecut/ui-kit';

export function userCard(
  user: Projects.Hami.UserModel,
): M3.Types.SurfaceCardContent {
  return {
    component: 'surface-card',
    type: 'filled',
    children: [
      {
        component: 'list',
        type: 'list',
        children: [
          {
            component: 'list-item',
            type: 'list-item',
            attributes: {
              headline: [
                user.gender != null ? i18n.msg(user.gender) : '',
                user.firstName,
                user.lastName,
                `(${i18n.msg(user.role)})`,
              ].join(' '),
            },
            children: [
              {
                component: 'icon',
                type: 'svg',
                attributes: { slot: 'start' },
                SVG: icons.outlineRounded.person,
              },
            ],
          },
          {
            component: 'list-item',
            type: 'list-item',
            attributes: {
              headline: `${i18n.phone(sanitizer.str(user.phoneNumber))}`,
            },
            children: [
              {
                component: 'icon',
                type: 'svg',
                attributes: { slot: 'start' },
                SVG: icons.outlineRounded.call,
              },
            ],
          },
          {
            component: 'list-item',
            type: 'list-item',
            attributes: {
              headline: `${user.email}`,
              hidden: user.email == null,
            },
            children: [
              {
                component: 'icon',
                type: 'svg',
                attributes: { slot: 'start' },
                SVG: icons.filledRounded.alternateEmail,
              },
            ],
          },
        ],
      },
    ],
  };
}
