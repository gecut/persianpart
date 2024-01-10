import i18n from '@gecut/i18n';
import { M3 } from '@gecut/ui-kit';

import { customerCard } from '../cards/customer-card';
import { customerProjectListCard } from '../cards/customer-projects-list-card';
import { orderCard } from '../cards/order-card';

import type { Projects } from '@gecut/types';

export function customerDialog(
  customer: Projects.Hami.CustomerModel,
): M3.Types.DialogContent {
  return M3.Content.dialog(
    [i18n.msg('customer-profile')],
    [
      customerCard(customer, true),
      customerProjectListCard(customer),
      ...customer.orderList.slice(0, 15).map((order) => orderCard(order)),
    ],
  );
}
