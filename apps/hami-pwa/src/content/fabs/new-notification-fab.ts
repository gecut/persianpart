import icons from '#hami/ui/icons';

import { request } from '@gecut/signal';

import { addNotificationDialog } from '../dialogs/add-notification-dialog';

import type { M3 } from '@gecut/ui-kit';

export function newNotificationFAB(): M3.Types.FABContent {
  return {
    component: 'fab',
    type: 'fab',
    attributes: {
      size: 'medium',
      variant: 'secondary',
      ariaLabel: 'New Notification',
    },
    children: [
      {
        component: 'icon',
        type: 'svg',
        SVG: icons.outlineRounded.addAlert,
        attributes: { slot: 'icon' },
      },
    ],
    transformers: (target) => {
      target.addEventListener('click', () => {
        request('dialog', addNotificationDialog());
      });

      return target;
    },
  };
}
