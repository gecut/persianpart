import type { UserJsonEntity } from '#persianpart/entities/user';
import dataManager from '#persianpart/manager/data';

import i18n from '@gecut/i18n';
import { getValue, request } from '@gecut/signal';
import { M3 } from '@gecut/ui-kit';
import isEqual from '@gecut/utilities/is-equal';
import textFieldRules from '@gecut/utilities/text-field-rules';
import textFieldTransformers from '@gecut/utilities/text-field-transformers';

export default (user: UserJsonEntity) =>
  M3.Content.dialog(
    [i18n.msg('user-edit')],
    [
      {
        component: 'form-builder',
        type: 'form-builder',
        attributes: {
          activeSlide: 'initial',
          data: {
            slides: {
              initial: [
                {
                  component: 'text-field',
                  type: 'outlined',
                  attributes: {
                    inputType: 'text',
                    name: 'firstName',
                    value: user.firstName,
                    label: i18n.msg('first-name'),
                  },
                  validator: textFieldRules('required'),
                },
                {
                  component: 'text-field',
                  type: 'outlined',
                  attributes: {
                    inputType: 'text',
                    name: 'lastName',
                    value: user.lastName,
                    label: i18n.msg('last-name'),
                  },
                  validator: textFieldRules('required'),
                },
                {
                  component: 'text-field',
                  type: 'outlined',
                  attributes: {
                    inputType: 'tel',
                    name: 'phoneNumber',
                    value: user.phoneNumber,
                    label: i18n.msg('phone-number'),
                  },
                  validator: textFieldRules('required', 'numeric', 'phone'),
                  transformers: [textFieldTransformers.phoneNumberHelper],
                },
                {
                  component: 'text-field',
                  type: 'outlined',
                  attributes: {
                    inputType: 'text',
                    name: 'password',
                    value: user.password,
                    label: i18n.msg('password'),
                  },
                  validator: textFieldRules('required'),
                  transformers: [textFieldTransformers.passwordHelper],
                },
                {
                  component: 'select',
                  type: 'outlined',
                  attributes: {
                    name: 'permission',
                    value: user.permission,
                    label: i18n.msg('permission'),
                  },
                  children: [
                    {
                      component: 'select-option',
                      type: 'select-option',
                      attributes: {
                        value: 'root',
                        headline: i18n.msg('root'),
                      },
                    },
                    {
                      component: 'select-option',
                      type: 'select-option',
                      attributes: {
                        value: 'user',
                        headline: i18n.msg('user'),
                      },
                    },
                  ],
                },
                {
                  component: 'select',
                  type: 'outlined',
                  attributes: {
                    name: 'active',
                    value: user.active ? 'active' : 'inactive',
                    label: i18n.msg('status'),
                  },
                  children: [
                    {
                      component: 'select-option',
                      type: 'select-option',
                      attributes: {
                        value: 'active',
                        headline: i18n.msg('active'),
                      },
                    },
                    {
                      component: 'select-option',
                      type: 'select-option',
                      attributes: {
                        value: 'inactive',
                        headline: i18n.msg('inactive'),
                      },
                    },
                  ],
                },
                {
                  component: 'button',
                  type: 'filled',
                  action: 'form_submit',
                  disabled: 'auto',
                  children: [i18n.msg('user-edit')],
                },
              ],
            },
            async onSubmit(event) {
              if (event.validate === true && event.values != null) {
                const value = event.values['initial'] as unknown as Omit<
                  UserJsonEntity,
                  'active'
                > & { active: 'active' | 'inactive' };

                await dataManager.senders?.editUser.send({
                  ...value,

                  active: isEqual(value.active, 'active'),
                  _id: user._id,
                })

                getValue('dialog')?.close();

                request('messenger', {
                  attributes: {
                    closeButton: true,
                    message: i18n.msg('user-successfully-edited'),
                  },
                });
              }
            },
          },
        },
      },
    ],
  );
