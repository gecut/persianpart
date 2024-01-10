import type { NewOrder } from '#hami/config';
import { validators } from '#hami/controllers/default-validators';

import i18n from '@gecut/i18n';
import { dispatch } from '@gecut/signal';
import { M3 } from '@gecut/ui-kit';
import textFieldTransformers from '@gecut/utilities/text-field-transformers';
import { html } from 'lit';

import { notFoundListCard } from '../cards/not-found-list-card';
import { headingPageTypography } from '../typographies/heading-page-typography';

import type { Projects, RenderResult } from '@gecut/types';

function productCard(
  product: Projects.Hami.Product,
  order: Partial<NewOrder>,
): M3.Types.SurfaceCardContent {
  const orderProductIndex = (order.productList ?? []).findIndex(
    (_orderProduct) => _orderProduct?.productId === product.id,
  );
  const orderProduct = order.productList?.[orderProductIndex];

  if (orderProductIndex === -1 || orderProduct == null) {
    return notFoundListCard();
  }

  return {
    component: 'surface-card',
    type: 'filled',
    attributes: {
      styles: {
        'margin-top': 'var(--sys-spacing-track,8px)',
        'margin-bottom': 'calc(2*var(--sys-spacing-track,8px))',
        'padding': 'calc(2*var(--sys-spacing-track,8px))',
        'padding-top': 'var(--sys-spacing-track,8px)',
      },
    },
    children: [
      {
        component: 'typography',
        type: 'h1',
        children: [product.name],
        attributes: { classes: ['surface-card__title'] },
      },
      {
        component: 'form-builder',
        type: 'form-builder',
        attributes: {
          styles: {
            'margin-top': '8px',
            '--padding-horizontal': '0',
          },
          activeSlide: 'initial',
          data: {
            slides: {
              initial: [
                [
                  {
                    component: 'text-field',
                    type: 'outlined',
                    attributes: {
                      inputType: 'number',
                      name: 'quantity',
                      label: i18n.msg('quantity'),
                      value: orderProduct.quantity?.toString(),
                      textDirection: 'ltr',
                    },
                    validator: validators('required', 'numeric'),
                    transformers: textFieldTransformers.numberHelper,
                  },
                  {
                    component: 'text-field',
                    type: 'outlined',
                    attributes: {
                      inputType: 'text',
                      name: 'unit',
                      label: i18n.msg('unit'),
                      value: orderProduct.unit ?? product.unit,
                    },
                    validator: validators('required'),
                  },
                ],
                [
                  {
                    component: 'text-field',
                    type: 'outlined',
                    attributes: {
                      inputType: 'number',
                      name: 'salesPrice',
                      label: i18n.msg('sales-price'),
                      value: orderProduct.salesPrice?.toString(),
                      textDirection: 'ltr',
                    },
                    validator: validators('required', 'numeric'),
                    transformers: textFieldTransformers.numberHelper,
                  },
                  {
                    component: 'text-field',
                    type: 'outlined',
                    attributes: {
                      inputType: 'number',
                      name: 'discount',
                      label: i18n.msg('discount'),
                      value: (orderProduct.discount ?? 0).toString(),
                      prefixText: '%',
                      textDirection: 'ltr',
                    },
                    validator: validators('required', 'numeric'),
                    transformers: textFieldTransformers.numberHelper,
                  },
                ],
              ],
            },
            onChange: (event) => {
              const orderProduct = event.values?.['initial'] as NonNullable<
                NewOrder['productList']
              >[number];

              if (orderProduct != null) {
                dispatch('new-order', {
                  productList: (order.productList ?? []).map(
                    (_orderProduct) => {
                      if (_orderProduct?.productId === product.id) {
                        _orderProduct.discount = Number(
                          orderProduct.discount ?? 0,
                        );
                        _orderProduct.salesPrice = Number(
                          orderProduct.salesPrice ?? 0,
                        );
                        _orderProduct.quantity = Number(
                          orderProduct.quantity ?? 0,
                        );
                        _orderProduct.unit = orderProduct.unit;
                      }

                      return _orderProduct;
                    },
                  ),
                });
              }
            },
          },
        },
      },
    ],
  };
}

function productList(
  products: Projects.Hami.Product[],
  order: Partial<NewOrder>,
): M3.Types.SurfaceCardContent[] {
  return products.map((product) => productCard(product, order));
}

function enterProductsValuesCard(
  products: Projects.Hami.Product[],
  order: Partial<NewOrder>,
  query = '',
): M3.Types.SurfaceCardRendererReturn | M3.Types.DivisionRendererReturn {
  products = products.filter((product) => product.active === true);

  if (query.trim() !== '') {
    products = products.filter((product) =>
      String(Object.values(product).join(' ')).includes(query),
    );
  }

  if (products.length === 0) {
    return M3.Renderers.renderSurfaceCard(notFoundListCard());
  }

  return M3.Renderers.renderDivision({
    component: 'division',
    type: 'div',
    children: productList(products, order),
  });
}

export function enterProductsValuesPage(
  products: Projects.Hami.Product[],
  order: Partial<NewOrder>,
): RenderResult {
  products = products.filter((product) =>
    (order.productList ?? [])
      .map((orderProduct) => orderProduct?.productId ?? '')
      .includes(product.id),
  );

  const headline = M3.Renderers.renderTypoGraphy(
    headingPageTypography(i18n.msg('enter-products-values')),
  );

  return html`${headline}${enterProductsValuesCard(products, order)}`;
}
