import i18n from '@gecut/i18n';
import { MaterialSymbols } from '@gecut/icons/material-symbols';
import { request } from '@gecut/signal';

import newUserDialog from '../dialogs/new-user.dialog';

import type { M3 } from '@gecut/ui-kit';

export default <Partial<M3.Types.FABContent>>{
  attributes: {
    size: 'medium',
    variant: 'primary',
    label: i18n.msg('new-user'),
  },
  children: [
    {
      component: 'icon',
      type: 'svg',
      SVG: MaterialSymbols.FilledRounded.Add,
      attributes: {
        slot: 'icon',
      },
    },
  ],
  events: {
    click: () => {
      request('dialog', newUserDialog);
    },
  },
};
