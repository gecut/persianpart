import type { UserJsonEntity } from '#persianpart/entities/user';
import { router } from '#persianpart/ui/router';

import i18n from '@gecut/i18n';
import { MaterialSymbols } from '@gecut/icons/material-symbols';
import { request } from '@gecut/signal';
import { M3 } from '@gecut/ui-kit';
import localStorageJson from '@gecut/utilities/local-storage-json';
import { sanitizer } from '@gecut/utilities/sanitizer';

import changePasswordDialog from '../dialogs/change-password.dialog';
import messagesDialogs from '../dialogs/messages.dialogs';

export default function userProfile(_user: Partial<UserJsonEntity>) {
  return M3.Renderers.renderSurfaceCard({
    type: 'filled',
    attributes: {
      classes: ['user-card', 'special-card'],
      styles: {
        overflow: 'visible',
        padding: 'calc(2*var(--sys-spacing-track))',
      },
    },
    children: [
      {
        component: 'typography',
        type: 'p',
        children: [i18n.msg('usp-first-name', sanitizer.str(_user.firstName))],
        attributes: {
          styles: {
            margin: '0',
          },
        },
      },
      {
        component: 'typography',
        type: 'p',
        children: [i18n.msg('usp-last-name', sanitizer.str(_user.lastName))],
        attributes: {
          styles: {
            margin: '0',
          },
        },
      },
      {
        component: 'typography',
        type: 'p',
        children: [
          i18n.msg(
            'usp-phone-number',
            i18n.phone(sanitizer.str(_user.phoneNumber), true),
          ),
        ],
        attributes: {
          styles: {
            margin: '0',
          },
        },
      },
      {
        component: 'division',
        type: 'div',
        attributes: {
          styles: {
            'display': 'flex',
            'gap': 'calc(2*var(--sys-spacing-track))',
            'margin-top': 'calc(2*var(--sys-spacing-track))',
          },
        },
        children: [
          {
            component: 'button',
            type: 'filled',
            children: [
              i18n.msg('change-password'),
              {
                component: 'icon',
                type: 'svg',
                SVG: MaterialSymbols.Outline.Key,
                attributes: {
                  slot: 'icon',
                },
              },
            ],
            attributes: {
              hasIcon: true,
              styles: {
                'flex': '1',
                'min-width': 'max-content',
              },
            },
            events: {
              click: async () => {
                request('dialog', changePasswordDialog);
              },
            },
          },
          {
            component: 'button',
            type: 'filled-tonal',
            children: [
              i18n.msg('logout'),
              {
                component: 'icon',
                type: 'svg',
                SVG: MaterialSymbols.FilledRounded.Logout,
                attributes: {
                  slot: 'icon',
                },
              },
            ],
            attributes: {
              variant: 'tertiary',
              hasIcon: true,
              styles: {
                'flex': '1',
                'min-width': 'max-content',
              },
            },
            events: {
              click: async () => {
                messagesDialogs.untilSignOutConfirmation().then(async () => {
                  localStorageJson.set('user.id', null);
                  await request('data.user', {});
                  router.go('sign-in');
                });
              },
            },
          },
        ],
      },
    ],
  });
}
