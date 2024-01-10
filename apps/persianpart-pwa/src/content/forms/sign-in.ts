import dataManager from '#persianpart/manager/data';
import { router } from '#persianpart/ui/router';

import i18n from '@gecut/i18n';
import { request } from '@gecut/signal';
import { untilIdle } from '@gecut/utilities/delay';
import { join } from '@gecut/utilities/join';
import random from '@gecut/utilities/random';
import textFieldRules from '@gecut/utilities/text-field-rules';
import textFieldTransformers from '@gecut/utilities/text-field-transformers';

import type { M3 } from '@gecut/ui-kit';

export default function signIn(
  options: Partial<M3.Types.FormBuilderContent> = {},
): M3.Types.FormBuilderContent {
  return {
    component: 'form-builder',
    type: 'form-builder',
    attributes: {
      activeSlide: 'initial',
      classes: ['sign-in-form'],
      data: {
        slides: {
          initial: [
            {
              component: 'text-field',
              type: 'filled',
              attributes: {
                inputType: 'tel',
                name: 'phoneNumber',
                label: i18n.msg('phone-number'),
                placeholder: join(
                  ' ',
                  i18n.msg('example') + ':',
                  random.phoneNumber('IR'),
                ),
              },
              validator: textFieldRules('required', 'numeric', 'phone'),
              transformers: textFieldTransformers.phoneNumberHelper,
            },
            {
              component: 'text-field',
              type: 'filled',
              attributes: {
                inputType: 'password',
                name: 'password',
                label: i18n.msg('password'),
              },
              validator: textFieldRules('required'),
              transformers: textFieldTransformers.passwordHelper,
            },
            {
              component: 'button',
              type: 'filled',
              action: 'form_submit',
              disabled: 'auto',
              attributes: {
                styles: {
                  'margin-inline-start': 'auto',
                },
              },
              children: [i18n.msg('sign-in')],
            },
          ],
        },
        async onSubmit(event) {
          const phoneNumber = event.values?.['initial']['phoneNumber'];
          const password = event.values?.['initial']['password'];

          if (
            event.validate === true &&
            phoneNumber != null &&
            password != null
          ) {
            await dataManager.senders.signIn.send({
              phoneNumber,
              password,
            });

            const user = await dataManager.receivers.user.data();

            if (user?._id != null) {
              request('messenger', {
                attributes: {
                  closeButton: true,
                  message: i18n.msg(
                    'welcome-user',
                    `${user.firstName} ${user.lastName}`,
                  ),
                  duration: 2_000,
                },
              });

              await untilIdle();

              router.go('user-profile');

              await untilIdle();

              window.location.reload();
            }
          } else {
            request('messenger', {
              attributes: {
                closeButton: true,
                message: i18n.msg('login-information-is-invalid'),
                duration: 2_000,
              },
            });
          }
        },
      },
    },
    children: [
      {
        component: 'typography',
        type: 'h1',
        style: 'title-large',
        attributes: {
          slot: 'headline',
        },
        children: [i18n.msg('sign-in')],
      },
    ],

    ...options,
  };
}
