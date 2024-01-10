import icons from '#hami/ui/icons';

import { dispatch } from '@gecut/signal';

import type { M3 } from '@gecut/ui-kit';

export function nextPageFAB(): M3.Types.FABContent {
  return {
    component: 'fab',
    type: 'fab',
    attributes: {
      size: 'medium',
      variant: 'primary',
    },
    children: [
      {
        component: 'icon',
        type: 'svg',
        attributes: { slot: 'icon' },
        SVG: icons.filledRounded.arrowForward,
      },
    ],
    transformers: (target) => {
      target.addEventListener('click', () => {
        dispatch('new-order-state', 'next');
      });

      return target;
    },
  };
}
