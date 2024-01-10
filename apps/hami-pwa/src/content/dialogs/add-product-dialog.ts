import { validators } from '#hami/controllers/default-validators';
import icons from '#hami/ui/icons';

import i18n from '@gecut/i18n';
import { request } from '@gecut/signal';
import { M3 } from '@gecut/ui-kit';

import type { Projects } from '@gecut/types';

export function addProductDialog(
  product?: Projects.Hami.Product,
): M3.Types.DialogContent {
  const isEdit = product != null;
  const title = isEdit ? i18n.msg('edit-product') : i18n.msg('add-product');

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
            if (product == null) return;

            product.active = false;

            target.disabled = true;
            await request('patch-product-storage', {
              data: [product],
            });
            target.disabled = false;

            request('product-storage', {});
            (await request('dialog', {}, 'cacheFirst')).close();
            request('messenger', {
              component: 'snack-bar',
              type: 'ellipsis-message',
              attributes: {
                message: i18n.msg('product-successfully-deleted'),
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
          data: {
            slides: {
              product: [
                {
                  component: 'text-field',
                  type: 'filled',
                  attributes: {
                    inputType: 'text',
                    name: 'code',
                    label: i18n.msg('code'),
                    value: product?.code,
                  },
                  validator: validators('required', 'numeric'),
                },
                {
                  component: 'text-field',
                  type: 'filled',
                  attributes: {
                    inputType: 'text',
                    name: 'name',
                    label: i18n.msg('name'),
                    value: product?.name,
                  },
                  validator: validators('required'),
                },
                [
                  {
                    component: 'text-field',
                    type: 'filled',
                    attributes: {
                      inputType: 'text',
                      name: 'category',
                      label: i18n.msg('category'),
                      value: product?.category,
                    },
                    validator: validators('required'),
                  },
                  {
                    component: 'text-field',
                    type: 'filled',
                    attributes: {
                      inputType: 'text',
                      name: 'brand',
                      label: i18n.msg('brand'),
                      value: product?.brand,
                    },
                    validator: validators('required'),
                  },
                ],
                {
                  component: 'text-field',
                  type: 'filled',
                  attributes: {
                    inputType: 'text',
                    name: 'unit',
                    label: i18n.msg('unit'),
                    value: product?.unit,
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
                    value: product?.description,
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
                  'product'
                ] as unknown as Projects.Hami.Product;

                if (data != null) {
                  if (product != null) {
                    data.id = product.id;
                  }

                  await request('patch-product-storage', {
                    data: [data],
                  });
                  request('product-storage', {});
                  (await request('dialog', {}, 'cacheFirst')).close();
                  request('messenger', {
                    component: 'snack-bar',
                    type: 'ellipsis-message',
                    attributes: {
                      message: i18n.msg('product-successfully-registered'),
                      align: 'bottom',
                      duration: 2_000,
                      closeButton: true,
                    },
                  });
                }
              }
            },
          },
          activeSlide: 'product',
        },
      },
    ],
  );
}
