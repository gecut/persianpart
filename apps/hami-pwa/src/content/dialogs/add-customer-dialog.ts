import { validators } from '#hami/controllers/default-validators';
import icons from '#hami/ui/icons';

import i18n from '@gecut/i18n';
import { request } from '@gecut/signal';
import { M3 } from '@gecut/ui-kit';

import type { Projects } from '@gecut/types';

export function addCustomerDialog(
  customer?: Projects.Hami.CustomerModel,
): M3.Types.DialogContent {
  const isEdit = customer != null;
  const title = isEdit ? i18n.msg('edit-customer') : i18n.msg('add-customer');

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
            if (customer == null) return;

            customer.active = false;

            target.disabled = true;
            await request('patch-customer-storage', {
              data: [customer],
            });
            target.disabled = false;

            request('customer-storage', {});
            (await request('dialog', {}, 'cacheFirst')).close();
            request('messenger', {
              component: 'snack-bar',
              type: 'ellipsis-message',
              attributes: {
                message: i18n.msg('customer-successfully-deleted'),
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
            '--padding-vertical': '0',
          },
          data: {
            slides: {
              customer: [
                {
                  component: 'text-field',
                  type: 'filled',
                  attributes: {
                    inputType: 'text',
                    name: 'firstName',
                    label: i18n.msg('first-name'),
                    value: customer?.firstName ?? 'مهندس',
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
                    value: customer?.lastName,
                  },
                  validator: validators('required'),
                },
                {
                  component: 'text-field',
                  type: 'filled',
                  attributes: {
                    inputType: 'tel',
                    name: 'phoneNumber',
                    textDirection: 'ltr',
                    label: i18n.msg('phone-number'),
                    value: customer?.phoneNumber,
                  },
                  validator: validators('required', 'phone'),
                },
                {
                  component: 'text-field',
                  type: 'filled',
                  attributes: {
                    inputType: 'text',
                    name: 'description',
                    label: i18n.msg('description'),
                    value: customer?.description,
                  },
                },
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
                const customerData = event.values[
                  'customer'
                ] as unknown as Projects.Hami.Customer;
                const userId = localStorage.getItem('USER_ID');

                if (customerData != null && userId != null) {
                  customerData.creatorId = userId;

                  await request('patch-customer-storage', {
                    data: [{ ...(customer ?? {}), ...customerData }],
                  });
                  request('customer-storage', {});
                  (await request('dialog', {}, 'cacheFirst')).close();
                  request('messenger', {
                    component: 'snack-bar',
                    type: 'ellipsis-message',
                    attributes: {
                      message: i18n.msg('customer-successfully-registered'),
                      align: 'bottom',
                      duration: 2_000,
                      closeButton: true,
                    },
                  });
                }
              }
            },
          },
          activeSlide: 'customer',
        },
      },
    ],
  );
}
