import calcTotals from '#hami/controllers/calc-totals';
import icons from '#hami/ui/icons';

import i18n from '@gecut/i18n';
import { request } from '@gecut/signal';
import clipboard from '@gecut/utilities/clipboard';
import debounce from '@gecut/utilities/debounce';
import { join } from '@gecut/utilities/join';
import { sanitizer } from '@gecut/utilities/sanitizer';
import shareSMS from '@gecut/utilities/share-sms';

import { editOrderDialog } from '../dialogs/edit-order-dialog';
import { logger } from '../logger';
import messages from '../strings/messages';
import { paragraphTypographies } from '../typographies/surface-card-paragraph-typography';

import type { Projects } from '@gecut/types';
import type { M3 } from '@gecut/ui-kit';

export function orderCard(
  order: Projects.Hami.OrderModel,
  editable = false,
  suppliers: Projects.Hami.Supplier[] = [],
): M3.Types.SurfaceCardContent {
  logger.methodArgs?.('orderCard', { order, editable, suppliers });

  return {
    component: 'surface-card',
    type:
      order.status === 'awaitingConfirmation' || order.status === 'needEdit' ?
        'outlined' :
        'filled',
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
        type: 'h1',
        children: [i18n.msg('order-code'), ': ', order.id],
        attributes: { classes: ['surface-card__title'] },
      },
      {
        component: 'icon-button',
        type: 'icon-button',
        iconSVG: icons.outlineRounded.edit,
        attributes: {
          hidden: editable !== true,
          styles: {
            'position': 'absolute',
            'top': '16px',
            'inset-inline-end': '16px',
          },
        },
        transformers: (target) => {
          target.addEventListener('click', () =>
            request('dialog', editOrderDialog(order, suppliers)),
          );

          return target;
        },
      },
      {
        component: 'icon-button',
        type: 'icon-button',
        iconSVG: icons.outlineRounded.contentCopy,
        attributes: {
          hidden: !order?.supplier?.phoneNumber,
          styles: {
            'position': 'absolute',
            'top': '16px',
            'inset-inline-end': '56px',
            '--_hover-icon-color': 'var(--_icon-color)',
            '--_focus-icon-color': 'var(--_icon-color)',
          },
        },
        transformers: (target) => {
          const debouncedColorReset = debounce(() => {
            target.style.removeProperty('--_icon-color');
          }, 2014);

          target.addEventListener('click', () => {
            clipboard
              .write(messages.orderSupplier(order))
              .then(() => {
                target.style.setProperty(
                  '--_icon-color',
                  'var(--md-sys-color-success)',
                );

                debouncedColorReset();
              })
              .catch(() => {
                target.style.setProperty(
                  '--_icon-color',
                  'var(--md-sys-color-danger)',
                );

                debouncedColorReset();
              });
          });

          return target;
        },
      },
      {
        component: 'icon-button',
        type: 'icon-button',
        iconSVG: icons.outlineRounded.sms,
        attributes: {
          hidden: !order?.supplier?.phoneNumber,
          styles: {
            'position': 'absolute',
            'top': editable ? '56px' : '16px',
            'inset-inline-end': '16px',
          },
        },
        transformers: (target) => {
          target.addEventListener('click', () => {
            if (order.supplier.phoneNumber != null) {
              shareSMS(
                order.supplier.phoneNumber,
                messages.orderSupplier(order),
              );
            }
          });

          return target;
        },
      },
      ...paragraphTypographies([
        join(': ', i18n.msg('status'), i18n.msg(order.status)),
        join(
          ': ',
          i18n.msg('evacuation-date'),
          i18n.date(order.evacuationDate),
        ),
        join(
          ': ',
          i18n.msg('registration-date'),
          i18n.date(order.registrationDate),
        ),
        join(
          '',
          i18n.msg('customer-name'),
          ': ',
          sanitizer.str(order.customer?.firstName),
          ' ',
          sanitizer.str(order.customer?.lastName),
        ),
        join(
          '',
          i18n.msg('supplier-name'),
          ': ',
          sanitizer.str(order.supplier?.firstName),
          ' ',
          sanitizer.str(order.supplier?.lastName),
        ),
        join(': ', i18n.msg('description'), sanitizer.str(order.description)),
        join(
          '',
          i18n.msg('creator'),
          ': ',
          sanitizer.str(order.creator?.firstName),
          ' ',
          sanitizer.str(order.creator?.lastName),
        ),
        join(
          ': ',
          i18n.msg('total-purchase-of-orders'),
          i18n.int(calcTotals.orderListTotalPurchase([order])),
        ) + ' ریال',
        join(
          ': ',
          i18n.msg('total-profit-of-orders'),
          i18n.int(calcTotals.orderListTotalProfit([order])),
        ) + ' ریال',
        join(
          ': ',
          i18n.msg('total-sales-of-orders'),
          i18n.int(calcTotals.orderListTotalSales([order])),
        ) + ' ریال',
        join(
          ': ',
          i18n.msg('project-address'),
          sanitizer.str(order.customerProject?.projectAddress),
        ),
      ]),
      {
        component: 'surface-card',
        type: 'filled',
        attributes: {
          styles: {
            'margin-top': 'var(--sys-spacing-track,8px)',
            'background': 'var(--md-sys-color-surface-container-lowest)',
          },
        },
        children: order.productList.map((orderProduct) => ({
          component: 'list-item',
          type: 'list-item',
          attributes: {
            headline: orderProduct.product.name,
            supportingText: join(
              ' ',
              i18n.msg('sales') + ':',
              i18n.int(orderProduct.salesPrice ?? 0),
              ' - ',
              i18n.msg('purchase') + ':',
              i18n.int(orderProduct.purchasePrice ?? 0),
            ),
            trailingSupportingText: join(
              ' ',
              i18n.int(orderProduct.quantity),
              orderProduct.unit,
            ),
            styles: {
              'width': '100%',
              '--_list-item-container-color': 'transparent',
            },
          },
        })),
      },
      {
        component: 'division',
        type: 'div',
        attributes: {
          styles: {
            'display': 'flex',
            'gap': 'calc(2*var(--sys-spacing-track,8px))',
            'margin-top': 'calc(2*var(--sys-spacing-track,8px))',
          },
        },
        children: [
          {
            component: 'button',
            type: 'filled-tonal',
            attributes: {
              href: 'https://orders.hami-app.ir/order/customer/' + order.id,
              target: '_blank',
              styles: {
                'flex-grow': '1',
              },
            },
            children: [i18n.msg('sales-invoice')],
          },
          {
            component: 'button',
            type: 'filled-tonal',
            attributes: {
              href: 'https://orders.hami-app.ir/order/supplier/' + order.id,
              target: '_blank',
              styles: {
                'flex-grow': '1',
              },
            },
            children: [i18n.msg('purchase-invoice')],
          },
        ],
      },
    ],
  };
}
