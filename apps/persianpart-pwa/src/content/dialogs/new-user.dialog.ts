import type { UserJsonEntity } from '#persianpart/entities/user';
import dataManager from '#persianpart/manager/data';

import i18n from '@gecut/i18n';
import { getValue } from '@gecut/signal';
import { M3 } from '@gecut/ui-kit';
import textFieldRules from '@gecut/utilities/text-field-rules';
import textFieldTransformers from '@gecut/utilities/text-field-transformers';

export default M3.Content.dialog(
  [i18n.msg('new-user')],
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
                  label: i18n.msg('permission'),
                  value: 'user',
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
                component: 'button',
                type: 'filled',
                action: 'form_submit',
                disabled: 'auto',
                children: [i18n.msg('create')],
              },
            ],
          },
          async onSubmit(event) {
            if (event.validate === true && event.values != null) {
              await dataManager.senders?.newUser.send(
                event.values['initial'] as unknown as UserJsonEntity,
              );

              getValue('dialog')?.close();
            }
          },
        },
      },
    },
  ],
);
