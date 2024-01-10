import { validators } from '#hami/controllers/default-validators';
import icons from '#hami/ui/icons';

import i18n from '@gecut/i18n';
import { request } from '@gecut/signal';
import { M3 } from '@gecut/ui-kit';

import { notificationStatusSelect } from '../selects/notification-status-select';

import type { Projects } from '@gecut/types';

export function addNotificationDialog(
  notification?: Projects.Hami.Notification,
): M3.Types.DialogContent {
  const isEdit = notification != null;
  const title = isEdit ?
    i18n.msg('edit-notification') :
    i18n.msg('add-notification');

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
            if (notification == null) return;

            notification.active = false;

            target.disabled = true;
            await request('patch-notification-storage', {
              data: [notification],
            });
            target.disabled = false;

            request('notification-storage', {});
            (await request('dialog', {}, 'cacheFirst')).close();
            request('messenger', {
              component: 'snack-bar',
              type: 'ellipsis-message',
              attributes: {
                message: i18n.msg('notification-successfully-deleted'),
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
            '--padding-vertical': '0px',
          },
          data: {
            slides: {
              notification: [
                {
                  component: 'text-field',
                  type: 'filled',
                  attributes: {
                    inputType: 'text',
                    name: 'message',
                    label: i18n.msg('message'),
                    value: notification?.message,
                  },
                  validator: validators('required'),
                },
                notificationStatusSelect(notification?.status),
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
                const _notification = event.values[
                  'notification'
                ] as unknown as Projects.Hami.Notification;

                if (_notification != null) {
                  if (notification?.id != null) {
                    _notification.id = notification.id;
                  }

                  await request('patch-notification-storage', {
                    data: [_notification],
                  });
                  request('notification-storage', {});
                  (await request('dialog', {}, 'cacheFirst')).close();
                  request('messenger', {
                    component: 'snack-bar',
                    type: 'ellipsis-message',
                    attributes: {
                      message: i18n.msg('notification-successfully-registered'),
                      align: 'bottom',
                      duration: 2_000,
                      closeButton: true,
                    },
                  });
                }
              }
            },
          },
          activeSlide: 'notification',
        },
      },
    ],
  );
}
