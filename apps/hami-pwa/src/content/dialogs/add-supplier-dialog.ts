import { validators } from '#hami/controllers/default-validators';
import icons from '#hami/ui/icons';

import i18n from '@gecut/i18n';
import { request } from '@gecut/signal';
import { M3 } from '@gecut/ui-kit';

import type { Projects } from '@gecut/types';

export function addSupplierDialog(
  supplier?: Projects.Hami.SupplierModel,
): M3.Types.DialogContent {
  const isEdit = supplier != null;
  const title = isEdit ? i18n.msg('edit-supplier') : i18n.msg('add-supplier');

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
            if (supplier == null) return;

            supplier.active = false;

            target.disabled = true;
            await request('patch-supplier-storage', {
              data: [supplier],
            });
            target.disabled = false;

            request('supplier-storage', {});
            (await request('dialog', {}, 'cacheFirst')).close();
            request('messenger', {
              component: 'snack-bar',
              type: 'ellipsis-message',
              attributes: {
                message: i18n.msg('supplier-successfully-deleted'),
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
              supplier: [
                {
                  component: 'text-field',
                  type: 'filled',
                  attributes: {
                    inputType: 'text',
                    name: 'uniqueCode',
                    label: i18n.msg('unique-code'),
                    value: supplier?.uniqueCode,
                  },
                  validator: validators('required', 'numeric'),
                },
                [
                  {
                    component: 'text-field',
                    type: 'filled',
                    attributes: {
                      inputType: 'text',
                      name: 'firstName',
                      label: i18n.msg('first-name'),
                      value: supplier?.firstName ?? 'مهندس',
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
                      value: supplier?.lastName,
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
                    value: supplier?.phoneNumber,
                  },
                  validator: validators('required', 'phone'),
                },
                {
                  component: 'text-field',
                  type: 'filled',
                  attributes: {
                    inputType: 'text',
                    name: 'address',
                    label: i18n.msg('address'),
                    value: supplier?.address,
                  },
                  validator: validators('required'),
                },
                {
                  component: 'text-field',
                  type: 'filled',
                  attributes: {
                    inputType: 'text',
                    name: 'description',
                    label: i18n.msg('description'),
                    value: supplier?.description,
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
                const data = event.values[
                  'supplier'
                ] as unknown as Projects.Hami.Supplier;

                if (data != null) {
                  if (supplier != null) {
                    data.id = supplier.id;
                  }

                  await request('patch-supplier-storage', {
                    data: [data],
                  });
                  request('supplier-storage', {});
                  (await request('dialog', {}, 'cacheFirst')).close();
                  request('messenger', {
                    component: 'snack-bar',
                    type: 'ellipsis-message',
                    attributes: {
                      message: i18n.msg('supplier-successfully-registered'),
                      align: 'bottom',
                      duration: 2_000,
                      closeButton: true,
                    },
                  });
                }
              }
            },
          },
          activeSlide: 'supplier',
        },
      },
    ],
  );
}
