import { validators } from '#hami/controllers/default-validators';
import icons from '#hami/ui/icons';

import i18n from '@gecut/i18n';
import { request } from '@gecut/signal';
import { M3 } from '@gecut/ui-kit';
import textFieldTransformers from '@gecut/utilities/text-field-transformers';

import type { Projects } from '@gecut/types';

export function addProductPriceDialog(
  productPrice?: Projects.Hami.ProductPrice,
): M3.Types.DialogContent {
  const isEdit = productPrice != null;
  const title = isEdit ?
    i18n.msg('edit-product-price') :
    i18n.msg('add-product-price');

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
            if (productPrice == null) return;

            productPrice.active = false;

            target.disabled = true;
            await request('patch-product-price-storage', {
              data: [productPrice],
            });
            target.disabled = false;

            request('product-price-storage', {});
            (await request('dialog', {}, 'cacheFirst')).close();
            request('messenger', {
              component: 'snack-bar',
              type: 'ellipsis-message',
              attributes: {
                message: i18n.msg('product-price-successfully-deleted'),
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
              productPrice: [
                {
                  component: 'text-field',
                  type: 'filled',
                  attributes: {
                    inputType: 'text',
                    name: 'name',
                    label: i18n.msg('name'),
                    value: productPrice?.name,
                  },
                  validator: validators('required'),
                },
                [
                  {
                    component: 'text-field',
                    type: 'filled',
                    attributes: {
                      inputType: 'number',
                      name: 'minPrice',
                      label: i18n.msg('min-price'),
                      value: productPrice?.minPrice.toString(),
                    },
                    validator: validators('required'),
                    transformers: textFieldTransformers.numberHelper,
                  },
                  {
                    component: 'text-field',
                    type: 'filled',
                    attributes: {
                      inputType: 'number',
                      name: 'normalPrice',
                      label: i18n.msg('normal-price'),
                      value: productPrice?.normalPrice.toString(),
                    },
                    validator: validators('required'),
                    transformers: textFieldTransformers.numberHelper,
                  },
                ],
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
                const _productPrice = event.values[
                  'productPrice'
                ] as unknown as Projects.Hami.ProductPrice;

                if (_productPrice != null) {
                  if (productPrice?.id != null) {
                    _productPrice.id = productPrice.id;
                  }

                  await request('patch-product-price-storage', {
                    data: [_productPrice],
                  });
                  request('product-price-storage', {});
                  (await request('dialog', {}, 'cacheFirst')).close();
                  request('messenger', {
                    component: 'snack-bar',
                    type: 'ellipsis-message',
                    attributes: {
                      message: i18n.msg(
                        'product-price-successfully-registered',
                      ),
                      align: 'bottom',
                      duration: 2_000,
                      closeButton: true,
                    },
                  });
                }
              }
            },
          },
          activeSlide: 'productPrice',
        },
      },
    ],
  );
}
