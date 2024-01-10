import i18n from '@gecut/i18n';
import { Projects } from '@gecut/types';

import type { FormSelectContent } from '@gecut/form-builder';
import type { M3 } from '@gecut/ui-kit';

export function userRoleSelect(
  value: Projects.Hami.User['role'] = Projects.Hami.userRoleList[1],
): FormSelectContent {
  return {
    component: 'select',
    type: 'filled',
    attributes: {
      label: i18n.msg('role'),
      name: 'role',
      value,
    },
    children: Projects.Hami.userRoleList.map(
      (role): M3.Types.SelectOptionContent => ({
        component: 'select-option',
        type: 'select-option',
        attributes: {
          value: role,
          headline: i18n.msg(role),
        },
      }),
    ),
  };
}
