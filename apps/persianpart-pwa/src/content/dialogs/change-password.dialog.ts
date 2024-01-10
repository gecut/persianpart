import type { UserChangePasswordJsonEntity } from '#persianpart/entities/user';
import dataManager from '#persianpart/manager/data';

import i18n from '@gecut/i18n';
import { getValue, request } from '@gecut/signal';
import { M3 } from '@gecut/ui-kit';
import textFieldRules from '@gecut/utilities/text-field-rules';
import textFieldTransformers from '@gecut/utilities/text-field-transformers';

export default M3.Content.dialog(
  [i18n.msg('change-password')],
  [
    {
      component: 'form-builder',
      type: 'form-builder',
      attributes: {
        data: {
          slides: {
            initial: [
              {
                component: 'text-field',
                type: 'outlined',
                attributes: {
                  inputType: 'text',
                  name: 'currentPassword',
                  label: i18n.msg('current-password'),
                },
                validator: textFieldRules('required'),
                transformers: textFieldTransformers.passwordHelper,
              },
              {
                component: 'text-field',
                type: 'outlined',
                attributes: {
                  inputType: 'text',
                  name: 'newPassword',
                  label: i18n.msg('new-password'),
                },
                validator: textFieldRules('required'),
                transformers: textFieldTransformers.passwordHelper,
              },
              {
                component: 'text-field',
                type: 'outlined',
                attributes: {
                  inputType: 'tel',
                  name: 'confirmNewPassword',
                  label: i18n.msg('confirm-new-password'),
                },
                validator: textFieldRules('required'),
                transformers: textFieldTransformers.passwordHelper,
              },
              {
                component: 'button',
                type: 'filled',
                action: 'form_submit',
                disabled: 'auto',
                children: [i18n.msg('change-password')],
              },
            ],
          },
          async onSubmit(event) {
            if (event.validate === true && event.values != null) {
              const value = event.values[
                'initial'
              ] as unknown as UserChangePasswordJsonEntity;

              if (value.newPassword !== value.confirmNewPassword) {
                request('messenger', {
                  type: 'wrap-message',
                  attributes: {
                    closeButton: true,
                    message: i18n.msg(
                      'user-new-password-and-confirm-new-password-not-equal',
                    ),
                  },
                });
              } else {
                await dataManager.senders?.userChangePassword.send(value);

                getValue('dialog')?.close();

                request('messenger', {
                  attributes: {
                    closeButton: true,
                    message: i18n.msg(
                      'password-successfully-changed',
                      value.newPassword,
                    ),
                  },
                });
              }
            }
          },
        },
        activeSlide: 'initial',
      },
    },
  ],
);
