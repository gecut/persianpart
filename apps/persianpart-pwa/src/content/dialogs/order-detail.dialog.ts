import type { OrderJsonEntity } from '#persianpart/entities/order';

import i18n from '@gecut/i18n';
import { M3 } from '@gecut/ui-kit';
import { join } from '@gecut/utilities/join';
import { sanitizer } from '@gecut/utilities/sanitizer';

export default (order: OrderJsonEntity): M3.Types.DialogContent =>
  M3.Content.dialog(
    [i18n.msg('order-detail')],
    [
      {
        component: 'surface-card',
        type: 'filled',
        attributes: {
          styles: {
            position: 'relative',
            overflow: 'visible',
            padding: 'calc(2*var(--sys-spacing-track))',
          },
        },
        children: [
          {
            component: 'typography',
            type: 'p',
            children: [
              i18n.msg(
                'od-register-date',
                i18n.dateTime(sanitizer.str(order.createdAt), {
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
                i18n.int(sanitizer.int(order.products?.length)),
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
                    order.products
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
            component: 'typography',
            type: 'p',
            children: [
              i18n.msg('od-status', i18n.msg(sanitizer.str(order.status))),
            ],
            attributes: {
              styles: {
                margin: '0',
              },
            },
          },
        ],
      },
      {
        component: 'surface-card',
        type: 'filled',
        attributes: {
          scroller: true,
          styles: {
            'margin-top': 'calc(2*var(--sys-spacing-track))',
          },
        },
        children: order.products.map(
          (product): M3.Types.ListItemContent => ({
            component: 'list-item',
            type: 'list-item',
            attributes: {
              headline: product.name,
              supportingText: i18n.msg('p-price', i18n.int(product.price)),
              trailingSupportingText: join(
                ' ',
                i18n.int(product.amount),
                product.unit,
              ),
              styles: {
                '--_list-item-label-text-type':
                  '400 0.8rem / 1.5rem var(--md-ref-typeface-plain, Roboto)',
              },
            },
          }),
        ),
      },
    ],
  );
