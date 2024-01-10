import calcTotals from '#hami/controllers/calc-totals';
import icons from '#hami/ui/icons';

import i18n from '@gecut/i18n';
import { request } from '@gecut/signal';
import { join } from '@gecut/utilities/join';
import { sanitizer } from '@gecut/utilities/sanitizer';

import { addSupplierDialog } from '../dialogs/add-supplier-dialog';
import { paragraphTypographies } from '../typographies/surface-card-paragraph-typography';

import type { Projects } from '@gecut/types';
import type { M3 } from '@gecut/ui-kit';

export function supplierCard(
  supplier: Projects.Hami.SupplierModel,
  editable = false,
): M3.Types.SurfaceCardContent {
  return {
    component: 'surface-card',
    type: 'filled',
    attributes: {
      styles: {
        'position': 'relative',
        'margin-top': 'calc(.2*var(--sys-spacing-track,8px))',
        'margin-bottom': 'calc(2*var(--sys-spacing-track,8px))',
        'padding':
          'var(--sys-spacing-track,8px) calc(2*var(--sys-spacing-track,8px)) calc(2*var(--sys-spacing-track,8px))',
      },
    },
    children: [
      {
        component: 'typography',
        type: 'h1',
        children: [
          sanitizer.str(supplier.firstName),
          ' ',
          sanitizer.str(supplier.lastName),
        ],
        attributes: { classes: ['surface-card__title'] },
      },
      {
        component: 'icon-button',
        type: 'icon-button',
        iconSVG: icons.outlineRounded.edit,
        attributes: {
          disabled: editable !== true,
          styles: {
            'position': 'absolute',
            'top': '16px',
            'inset-inline-end': '16px',
          },
        },
        transformers: (target) => {
          target.addEventListener('click', () => {
            request('dialog', addSupplierDialog(supplier));
          });

          return target;
        },
      },
      ...paragraphTypographies([
        join(': ', i18n.msg('unique-code'), supplier.uniqueCode),
        join(
          ': ',
          i18n.msg('phone-number'),
          i18n.phone(sanitizer.str(supplier.phoneNumber), true),
        ),
        join(
          ': ',
          i18n.msg('number-of-orders'),
          i18n.int(supplier.orderList.length),
        ),
        join(
          ': ',
          i18n.msg('total-purchase-of-orders'),
          i18n.int(calcTotals.orderListTotalPurchase(supplier.orderList)),
        ) + ' ریال',
        join(
          ': ',
          i18n.msg('total-profit-of-orders'),
          i18n.int(calcTotals.orderListTotalProfit(supplier.orderList)),
        ) + ' ریال',
        join(': ', i18n.msg('address'), sanitizer.str(supplier.address)),
        join(
          ': ',
          i18n.msg('description'),
          sanitizer.str(supplier.description),
        ),
      ]),
      {
        component: 'button',
        type: 'filled-tonal',
        attributes: {
          target: '_blank',
          href: `https://orders.hami-app.ir/bill/supplier/${supplier.id}`,
          styles: {
            'margin-top': '16px',
          },
        },
        children: ['صورت حساب'],
      },
    ],
  };
}
