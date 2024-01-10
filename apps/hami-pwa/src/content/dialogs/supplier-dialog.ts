import i18n from '@gecut/i18n';
import { M3 } from '@gecut/ui-kit';

import { orderCard } from '../cards/order-card';
import { supplierCard } from '../cards/supplier-card';
import { supplierPhoneNumberListCard } from '../cards/supplier-phone-number-list-card';

import type { Projects } from '@gecut/types';

export function supplierDialog(
  supplier: Projects.Hami.SupplierModel,
  editable = false,
): M3.Types.DialogContent {
  return M3.Content.dialog(
    [i18n.msg('supplier-profile')],
    [
      supplierCard(supplier, editable),
      supplierPhoneNumberListCard(supplier),
      ...supplier.orderList.slice(0, 15).map((order) => orderCard(order)),
    ],
  );
}
