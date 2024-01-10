import i18n from '@gecut/i18n';

import { dialog } from './dialog';

import type { DialogContent, IconContent } from '../types/types';

type confirmationDialog = {
  confirmation: {
    title: string;
    icon?: IconContent;
  };
  close: {
    title: string;
    icon?: IconContent;
  };
  onConfirm?: (event: Event) => void;
  onClose?: (event: Event) => void;
};

const confirmationDialogButtonDefault: confirmationDialog = {
  close: {
    title: i18n.msg('close'),
  },
  confirmation: {
    title: i18n.msg('confirmation'),
  },
};

export const confirmationDialog = (
  message: string,
  title: string,
  iconSVG: string,
  buttons: confirmationDialog = confirmationDialogButtonDefault,
  iconColor = 'var(--md-sys-color-warning)',
): DialogContent =>
  dialog(
    [title],
    [
      {
        component: 'typography',
        type: 'p',
        style: 'body-medium',
        children: [message],
      },
    ],
    [
      {
        component: 'button',
        type: 'text',
        attributes: {
          value: 'close',
        },
        children: [...Object.values(buttons.close)],
        events: {
          click: (event) => buttons.onClose?.(event),
        },
      },
      {
        component: 'button',
        type: 'filled',
        attributes: {
          value: 'ok',
          autofocus: true,
        },
        children: [...Object.values(buttons.confirmation)],
        events: {
          click: (event) => buttons.onConfirm?.(event),
        },
      },
    ],
    {
      component: 'icon',
      type: 'svg',
      SVG: iconSVG,
      attributes: {
        styles: {
          color: iconColor,
        },
      },
    },
    {},
    false,
  );
