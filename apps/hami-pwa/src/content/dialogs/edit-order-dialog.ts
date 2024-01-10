import { isFieldExits } from '#hami/controllers/is-field-exists';
import icons from '#hami/ui/icons';

import i18n from '@gecut/i18n';
import { request } from '@gecut/signal';
import { M3 } from '@gecut/ui-kit';
import { sanitizer } from '@gecut/utilities/sanitizer';
import textFieldTransformers from '@gecut/utilities/text-field-transformers';

import { orderStatusSelect } from '../selects/order-status-select';
import { orderSupplierSelect } from '../selects/order-supplier-select';

import type { FormComponent } from '@gecut/form-builder';
import type { Projects } from '@gecut/types';

export function editOrderDialog(
  order: Projects.Hami.OrderModel,
  suppliers: Projects.Hami.Supplier[],
): M3.Types.DialogContent {
  return M3.Content.dialog(
    [
      i18n.msg('order-code') + ': ' + order.id,
      {
        component: 'icon-button',
        type: 'icon-button',
        iconSVG: icons.outlineRounded.delete,
        attributes: {
          styles: {
            'margin-inline-start': 'auto',
          },
        },
        transformers: (target) => {
          target.addEventListener('click', async () => {
            if (order == null) return;

            target.disabled = true;
            await request('put-order', {
              id: order.id,
              active: false,
            });
            target.disabled = false;

            request('order-storage', {});
            (await request('dialog', {}, 'cacheFirst')).close();
            request('messenger', {
              component: 'snack-bar',
              type: 'ellipsis-message',
              attributes: {
                message: i18n.msg('order-successfully-deleted'),
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
        component: 'surface-card',
        type: 'filled',
        attributes: {
          styles: {
            'position': 'relative',
            'margin-top': 'calc(.2*var(--sys-spacing-track,8px))',
            'margin-bottom': 'var(--sys-spacing-track,8px)',
            'padding':
              'var(--sys-spacing-track,8px) calc(2*var(--sys-spacing-track,8px)) calc(2*var(--sys-spacing-track,8px))',
          },
        },
        children: [
          {
            component: 'typography',
            type: 'p',
            children: [i18n.msg('status'), ': ', i18n.msg(order.status)],
            attributes: {
              classes: ['surface-card__paragraph'],
            },
          },
          {
            component: 'typography',
            type: 'p',
            children: [
              i18n.msg('evacuation-date'),
              ': ',
              i18n.date(order.evacuationDate),
            ],
            attributes: {
              classes: ['surface-card__paragraph'],
            },
          },
          {
            component: 'typography',
            type: 'p',
            children: [
              i18n.msg('registration-date'),
              ': ',
              i18n.date(order.registrationDate),
            ],
            attributes: {
              classes: ['surface-card__paragraph'],
            },
          },
          {
            component: 'typography',
            type: 'p',
            children: [
              i18n.msg('customer-name'),
              ': ',
              sanitizer.str(order.customer?.firstName),
              ' ',
              sanitizer.str(order.customer?.lastName),
            ],
            attributes: {
              classes: ['surface-card__paragraph'],
            },
          },
          {
            component: 'typography',
            type: 'p',
            children: [
              i18n.msg('supplier-name'),
              ': ',
              sanitizer.str(order.supplier?.firstName),
              ' ',
              sanitizer.str(order.supplier?.lastName),
            ],
            attributes: {
              classes: ['surface-card__paragraph'],
            },
          },
          {
            component: 'typography',
            type: 'p',
            children: [
              i18n.msg('description'),
              ': ',
              sanitizer.str(order.description),
            ],
            attributes: {
              hidden: order.description === 'no-description',
              classes: ['surface-card__paragraph'],
            },
          },
          {
            component: 'typography',
            type: 'p',
            children: [
              i18n.msg('creator'),
              ': ',
              sanitizer.str(order.creator?.firstName),
              ' ',
              sanitizer.str(order.creator?.lastName),
            ],
            attributes: {
              classes: ['surface-card__paragraph'],
            },
          },
          {
            component: 'typography',
            type: 'p',
            children: [
              i18n.msg('project-address'),
              ': ',
              i18n.msg(sanitizer.str(order.customerProject?.projectAddress)),
            ],
            attributes: {
              hidden:
                isFieldExits(order.customerProject?.projectAddress) === false,
              classes: ['surface-card__paragraph'],
            },
          },
          {
            component: 'form-builder',
            type: 'form-builder',
            attributes: {
              activeSlide: 'initial',
              styles: {
                'margin-top': '16px',
                '--padding-horizontal': '0',
              },
              data: {
                slides: {
                  initial: [
                    orderStatusSelect(order.status),
                    orderSupplierSelect(suppliers, order.supplierId),
                    ...order.productList.map(
                      (orderProduct): FormComponent => ({
                        component: 'division',
                        type: 'div',
                        children: [
                          {
                            component: 'divider',
                          },
                          {
                            component: 'typography',
                            type: 'h4',
                            style: 'title-medium',
                            children: [orderProduct.product.name],
                          },
                          {
                            component: 'division',
                            type: 'div',
                            attributes: {
                              styles: {
                                'display': 'flex',
                                'flex-direction': 'column',
                                'gap': 'calc(2*var(--sys-spacing-track))',
                              },
                            },
                            children: [
                              {
                                component: 'text-field',
                                type: 'outlined',
                                attributes: {
                                  inputType: 'number',
                                  id: `quantity-${orderProduct.productId}`,
                                  name: `quantity-${orderProduct.productId}`,
                                  label: i18n.msg('quantity'),
                                  value: String(orderProduct.quantity),
                                  suffixText: orderProduct.unit,
                                  textDirection: 'ltr',
                                },
                                transformers: [
                                  textFieldTransformers.numberHelper,
                                ],
                              },
                              {
                                component: 'division',
                                type: 'div',
                                attributes: {
                                  styles: {
                                    display: 'flex',
                                    gap: 'calc(2*var(--sys-spacing-track))',
                                  },
                                },
                                children: [
                                  {
                                    component: 'text-field',
                                    type: 'outlined',
                                    attributes: {
                                      inputType: 'number',
                                      id: `purchase-${orderProduct.productId}`,
                                      name: `purchase-${orderProduct.productId}`,
                                      label: i18n.msg('purchase-price'),
                                      value: String(orderProduct.purchasePrice),
                                      textDirection: 'ltr',
                                    },
                                    transformers: [
                                      textFieldTransformers.numberHelper,
                                    ],
                                  },
                                  {
                                    component: 'text-field',
                                    type: 'outlined',
                                    attributes: {
                                      inputType: 'number',
                                      id: `sales-${orderProduct.productId}`,
                                      name: `sales-${orderProduct.productId}`,
                                      label: i18n.msg('sales-price'),
                                      value: String(orderProduct.salesPrice),
                                      textDirection: 'ltr',
                                    },
                                    transformers: [
                                      textFieldTransformers.numberHelper,
                                    ],
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      }),
                    ),
                    {
                      component: 'button',
                      type: 'filled-tonal',
                      action: 'form_submit',
                      disabled: 'auto',
                      children: [i18n.msg('edit-order')],
                    },
                  ],
                },
                onSubmit: async (event) => {
                  if (event.validate === true && event.values != null) {
                    const formValues = event.values[
                      'initial'
                    ] as unknown as Record<string, string> &
                      Pick<Projects.Hami.Order, 'supplierId' | 'status'>;

                    const _order: Partial<Projects.Hami.Order> = {
                      id: order.id,
                      status: formValues.status,
                      supplierId: formValues.supplierId,
                      productList: [],
                    };
                    const productList = order.productList.map(
                      (
                        orderProduct: Projects.Hami.OrderProduct & {
                          product?: unknown;
                        },
                      ) => {
                        delete orderProduct.product;

                        return orderProduct as Projects.Hami.OrderProduct;
                      },
                    );

                    _order.productList = productList.map((orderProduct) => {
                      const purchasePrice =
                        event.formBuilderElement.querySelector<HTMLInputElement>(
                          `#purchase-${orderProduct.productId}`,
                        ).valueAsNumber ?? 0;

                      const salesPrice =
                        event.formBuilderElement.querySelector<HTMLInputElement>(
                          `#sales-${orderProduct.productId}`,
                        ).valueAsNumber ?? 0;

                      const quantity =
                        event.formBuilderElement.querySelector<HTMLInputElement>(
                          `#quantity-${orderProduct.productId}`,
                        ).valueAsNumber ?? 0;

                      orderProduct.purchasePrice = purchasePrice;
                      orderProduct.salesPrice = salesPrice;
                      orderProduct.quantity = quantity;

                      return orderProduct;
                    });

                    await request('put-order', _order);
                    request('order-storage', {});
                    (await request('dialog', {}, 'cacheFirst')).close();
                  }
                },
              },
            },
          },
        ],
      },
    ],
  );
}
