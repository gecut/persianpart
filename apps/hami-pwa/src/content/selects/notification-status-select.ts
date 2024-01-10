import i18n from '@gecut/i18n';
import { Projects } from '@gecut/types';

import type { FormSelectContent } from '@gecut/form-builder';
import type { M3 } from '@gecut/ui-kit';

export function notificationStatusSelect(
  value: Projects.Hami.Notification['status'] = 'normal',
): FormSelectContent {
  return {
    component: 'select',
    type: 'filled',
    attributes: {
      label: i18n.msg('status'),
      value,
      name: 'status',
      styles: {
        'z-index': 'var(--sys-zindex-dropdown)',
      },
    },
    children: Projects.Hami.notificationStatusList.map(
      (status): M3.Types.SelectOptionContent => ({
        component: 'select-option',
        type: 'select-option',
        attributes: {
          value: status,
          headline: i18n.msg(status),
        },
      }),
    ),
  };
}
