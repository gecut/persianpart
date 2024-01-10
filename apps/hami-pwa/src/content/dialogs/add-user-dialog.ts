import { validators } from '#hami/controllers/default-validators';
import icons from '#hami/ui/icons';

import i18n from '@gecut/i18n';
import { request } from '@gecut/signal';
import { M3 } from '@gecut/ui-kit';
import textFieldTransformers from '@gecut/utilities/text-field-transformers';

import { userGenderSelect } from '../selects/user-gender-select';
import { userRoleSelect } from '../selects/user-role-select';

import type { Projects } from '@gecut/types';

export function addUserDialog(
  user?: Projects.Hami.UserModel,
): M3.Types.DialogContent {
  const isEdit = user != null;
  const title = isEdit ? i18n.msg('edit-user') : i18n.msg('add-user');

  return M3.Content.dialog(
    [
      title,
      {
        component: 'icon-button',
        type: 'icon-button',
        iconSVG: icons.outlineRounded.delete,
        attributes: {
          disabled: !(isEdit === true),
          styles: {
            'margin-inline-start': 'auto',
          },
        },
        transformers: (target) => {
          target.addEventListener('click', async () => {
            if (user == null) return;

            user.active = false;

            target.disabled = true;
            await request('patch-user-storage', {
              data: [user],
            });
            target.disabled = false;

            request('user-storage', {});
            (await request('dialog', {}, 'cacheFirst')).close();
            request('messenger', {
              component: 'snack-bar',
              type: 'ellipsis-message',
              attributes: {
                message: i18n.msg('user-successfully-deleted'),
                align: 'bottom',
                duration: 2_000,
                closeButton: true,
              },
            });
          });

          return target;
        },
      },
    ],
    [
      {
        component: 'form-builder',
        type: 'form-builder',
        attributes: {
          styles: {
            'margin-top': '8px',
            '--padding-horizontal': '0',
          },
          data: {
            slides: {
              user: [
                [
                  {
                    component: 'text-field',
                    type: 'filled',
                    attributes: {
                      inputType: 'text',
                      name: 'firstName',
                      label: i18n.msg('first-name'),
                      value: user?.firstName ?? 'مهندس',
                    },
                    validator: validators('required'),
                  },
                  {
                    component: 'text-field',
                    type: 'filled',
                    attributes: {
                      inputType: 'text',
                      name: 'lastName',
                      label: i18n.msg('last-name'),
                      value: user?.lastName,
                    },
                    validator: validators('required'),
                  },
                ],
                {
                  component: 'text-field',
                  type: 'filled',
                  attributes: {
                    inputType: 'tel',
                    name: 'phoneNumber',
                    textDirection: 'ltr',
                    label: i18n.msg('phone-number'),
                    value: user?.phoneNumber,
                  },
                  validator: validators('required', 'phone'),
                  transformers: [textFieldTransformers.phoneNumberHelper],
                },
                {
                  component: 'text-field',
                  type: 'filled',
                  attributes: {
                    inputType: 'password',
                    name: 'password',
                    textDirection: 'ltr',
                    label: i18n.msg('password'),
                    value: user?.password,
                  },
                  validator: validators('required'),
                  transformers: [textFieldTransformers.passwordHelper],
                },
                userRoleSelect(user?.role),
                userGenderSelect(user?.gender),
                {
                  component: 'button',
                  type: 'filled',
                  disabled: 'auto',
                  action: 'form_submit',
                  children: [title],
                },
              ],
            },
            onSubmit: async (event) => {
              if (event.validate === true && event.values != null) {
                const data = event.values[
                  'user'
                ] as unknown as Projects.Hami.User;

                if (data != null) {
                  if (user != null) {
                    data.id = user.id;
                  }

                  await request('patch-user-storage', {
                    data: [data],
                  });
                  request('user-storage', {});
                  (await request('dialog', {}, 'cacheFirst')).close();
                  request('messenger', {
                    component: 'snack-bar',
                    type: 'ellipsis-message',
                    attributes: {
                      message: i18n.msg('user-successfully-registered'),
                      align: 'bottom',
                      duration: 2_000,
                      closeButton: true,
                    },
                  });
                }
              }
            },
          },
          activeSlide: 'user',
        },
      },
    ],
  );
}
