import icons from '#hami/ui/icons';

import i18n from '@gecut/i18n';
import { request } from '@gecut/signal';

import { addCustomerDialog } from '../dialogs/add-customer-dialog';

import type { M3 } from '@gecut/ui-kit';

export function newCustomerFAB(): M3.Types.FABContent {
  return {
    component: 'fab',
    type: 'fab',
    attributes: {
      size: 'medium',
      variant: 'primary',
      label: i18n.msg('new-customer'),
    },
    children: [
      {
        component: 'icon',
        type: 'svg',
        SVG: icons.filledRounded.add,
        attributes: { slot: 'icon' },
      },
    ],
    transformers: (target) => {
      target.addEventListener('click', () => {
        request('dialog', addCustomerDialog());
      });

      return target;
    },
  };
}
