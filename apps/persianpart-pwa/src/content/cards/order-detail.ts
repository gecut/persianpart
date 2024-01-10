import { orderStatusList } from '#persianpart/entities/order';
import type { OrderJsonEntity } from '#persianpart/entities/order';
import dataManager from '#persianpart/manager/data';
import { router } from '#persianpart/ui/router';

import i18n from '@gecut/i18n';
import { MaterialSymbols } from '@gecut/icons/material-symbols';
import { request } from '@gecut/signal';
import { sanitizer } from '@gecut/utilities/sanitizer';

import type { M3 } from '@gecut/ui-kit';

export default function orderDetail(
  _order: Partial<OrderJsonEntity>,
): M3.Types.SurfaceCardContent {
  return {
    component: 'surface-card',
    type: 'filled',
    attributes: {
      classes: ['user-card', 'special-card'],
      styles: {
        overflow: 'visible',
        padding: 'calc(2*var(--sys-spacing-track))',
        position: 'relative',
      },
    },
    children: [
      {
        component: 'icon-button',
        type: 'filled',
        iconSVG: MaterialSymbols.OutlineRounded.DeleteForever,
        attributes: {
          styles: {
            position: 'absolute',
            top: 'calc(2*var(--sys-spacing-track))',
            'inset-inline-end': 'calc(2*var(--sys-spacing-track))',

            '--_container-color': ' var(--md-sys-color-error)',
            '--_focus-icon-color': 'var(--md-sys-color-on-error)',
            '--_hover-icon-color': 'var(--md-sys-color-on-error)',
            '--_hover-state-layer-color': 'var(--md-sys-color-on-error)',
            '--_icon-color': 'var(--md-sys-color-on-error)',
            '--_pressed-icon-color': 'var(--md-sys-color-on-error)',
            '--_pressed-state-layer-color': 'var(--md-sys-color-on-error)',
            '--_selected-container-colo': ' var(--md-sys-color-error)',
          },
        },
        transformers: (target) => {
          target.addEventListener('click', async () => {
            if (_order._id != null) {
              target.disabled = true;

              await dataManager.senders.deleteOrder.send(_order._id);

              request('messenger', {
                attributes: {
                  closeButton: true,
                  message: i18n.msg('order-successfully-deleted'),
                },
              });

              target.disabled = false;

              router.go('orders-categories');
            }
          });

          return target;
        },
      },
      {
        component: 'typography',
        type: 'p',
        children: [
          i18n.msg(
            'od-customer-name',
            sanitizer.str(_order.user?.firstName),
            sanitizer.str(_order.user?.lastName),
          ),
        ],
        attributes: {
          styles: {
            margin: '0',
          },
        },
      },
      {
        component: 'typography',
        type: 'p',
        children: [
          i18n.msg(
            'od-customer-phone-number',
            i18n.phone(sanitizer.str(_order.user?.phoneNumber), true),
          ),
        ],
        attributes: {
          styles: {
            margin: '0',
          },
        },
      },
      {
        component: 'typography',
        type: 'p',
        children: [
          i18n.msg(
            'od-register-date',
            i18n.dateTime(sanitizer.str(_order.createdAt), {
              weekday: 'long',
              day: 'numeric',
              month: 'long',

              hour: 'numeric',
              minute: 'numeric',
            }),
          ),
        ],
        attributes: {
          styles: {
            margin: '0',
          },
        },
      },
      {
        component: 'typography',
        type: 'p',
        children: [
          i18n.msg(
            'od-products-count',
            i18n.int(sanitizer.int(_order.products?.length)),
          ),
        ],
        attributes: {
          styles: {
            margin: '0',
          },
        },
      },
      {
        component: 'typography',
        type: 'p',
        children: [
          i18n.msg(
            'od-total-price',
            i18n.int(
              sanitizer.int(
                _order.products
                  ?.map((product) => product.price * product.amount)
                  .reduce((p, c) => p + c, 0),
              ),
            ),
            i18n.msg('$financial-unit'),
          ),
        ],
        attributes: {
          styles: {
            margin: '0',
          },
        },
      },
      {
        component: 'select',
        type: 'outlined',
        children: orderStatusList.map(
          (status): M3.Types.SelectOptionContent => ({
            component: 'select-option',
            type: 'select-option',
            attributes: {
              value: status,
              headline: i18n.msg(status),
              supportingText: i18n.msg(`supporting-text-${status}`),
              multiLineSupportingText: true,
            },
          }),
        ),
        attributes: {
          label: i18n.msg('order-status'),
          value: _order.status,
          styles: {
            'margin-top': 'calc(2*var(--sys-spacing-track))',
          },
        },
        transformers: (target) => {
          target.addEventListener('change', () => {
            target.disabled = true;

            dataManager.senders.editOrder
              .send({
                _id: _order._id,
                status: target.value as
                  | 'accepted'
                  | 'awaiting-confirmation'
                  | 'canceled',
              })
              .then(() =>
                request('messenger', {
                  attributes: {
                    closeButton: true,
                    message: i18n.msg('order-successfully-edited'),
                  },
                }),
              )
              .finally(() => {
                target.disabled = false;
              });
          });

          return target;
        },
      },
    ],
  };
}
