import { router } from '#persianpart/ui/router';

import i18n from '@gecut/i18n';
import { MaterialSymbols } from '@gecut/icons/material-symbols';

import type { M3 } from '@gecut/ui-kit';

export default <Partial<M3.Types.FABContent>>{
  attributes: {
    size: 'medium',
    variant: 'primary',
    label: i18n.msg('new-order'),
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
      router.go('new-order');
    },
  },
};
