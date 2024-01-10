import i18n from '@gecut/i18n';
import { Projects } from '@gecut/types';

import type { FormSelectContent } from '@gecut/form-builder';
import type { M3 } from '@gecut/ui-kit';

export function userGenderSelect(
  value: Projects.Hami.User['gender'] = Projects.Hami.userGenderList[0],
): FormSelectContent {
  return {
    component: 'select',
    type: 'filled',
    attributes: {
      label: i18n.msg('gender'),
      name: 'gender',
      value,
    },
    children: Projects.Hami.userGenderList.map(
      (gender): M3.Types.SelectOptionContent => ({
        component: 'select-option',
        type: 'select-option',
        attributes: {
          value: gender,
          headline: i18n.msg(gender),
        },
      }),
    ),
  };
}
