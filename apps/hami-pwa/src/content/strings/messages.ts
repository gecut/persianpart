import i18n from '@gecut/i18n';
import { join } from '@gecut/utilities/join';

import type { Projects } from '@gecut/types';

const orderSupplier = (order: Projects.Hami.OrderModel): string => {
  const products = order.productList
    .map((orderProduct) =>
      join(
        ' ',
        i18n.int(orderProduct.quantity),
        orderProduct.unit,
        orderProduct.product.name,
      ),
    )
    .join('\n');

  return join(
    '\n',
    products,
    '\n',
    order.customerProject.projectAddress != null ?
      order.customerProject.projectAddress + '\n' :
      '',
    order.customerProject.supervisorName,
    order.customerProject.supervisorPhone,
    i18n.date(order.evacuationDate),
  );
};

export default { orderSupplier };
