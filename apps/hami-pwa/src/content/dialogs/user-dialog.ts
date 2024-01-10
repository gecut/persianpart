import i18n from '@gecut/i18n';
import { M3 } from '@gecut/ui-kit';

import { orderCard } from '../cards/order-card';
import { userCard } from '../cards/user-card';

import type { Projects } from '@gecut/types';

export function customerItem(
  customer: Projects.Hami.Customer,
  index: number,
): M3.Types.ListItemContent {
  return {
    component: 'list-item',
    type: 'list-item',
    attributes: {
      headline: index + 1 + ' ' + customer.firstName + ' ' + customer.lastName,
      supportingText: customer.description,
      multiLineSupportingText: true,
      styles: {
        '--_list-item-trailing-supporting-text-color':
          'var(--md-sys-color-primary)',
      },
    },
  };
}

export function userDialog(
  user: Projects.Hami.UserModel,
): M3.Types.DialogContent {
  return M3.Content.dialog(
    [i18n.msg('user-profile')],
    [
      userCard(user),
      {
        component: 'typography',
        type: 'h2',
        children: [i18n.msg('customers')],
        attributes: {
          hidden: user.customerList.length <= 0,
        },
      },
      {
        component: 'surface-card',
        type: 'filled',
        children: user.customerList.map((customer, index) =>
          customerItem(customer, index),
        ),
      },
      {
        component: 'typography',
        type: 'h2',
        children: [i18n.msg('orders')],
        attributes: {
          hidden: user.orderList.length <= 0,
        },
      },
      ...user.orderList.slice(0, 15).map((order) => orderCard(order)),
    ],
  );
}
