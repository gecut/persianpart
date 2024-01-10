import { get } from '#hami/lib/get-data';
import { isFieldExits } from '#hami/lib/is-exists';
import { when } from '#hami/lib/when';

import { config, logger } from '../lib/config';
import { nanoServer } from '../lib/server';
import { storageClient } from '../lib/storage';

import type { Projects } from '@gecut/types';

nanoServer.route(
  'GET',
  '/order-all-storage/',
  async (): Promise<Projects.Hami.Routes['order-storage']> => {
    logger.logMethod?.('get-order-all-storage');

    const orderStorage =
      await storageClient.getStorage<Projects.Hami.OrderModel>(
        config.orderStorage,
      );

    for await (const orderId of Object.keys(orderStorage.data)) {
      orderStorage.data[orderId] = await orderModel(orderStorage.data[orderId]);
    }

    return orderStorage;
  },
);

export async function orderModel(
  order: Projects.Hami.Order,
): Promise<Projects.Hami.OrderModel> {
  const productStorage = await storageClient.getStorage<Projects.Hami.Product>(
    config.productStorage,
  );
  const productList: Projects.Hami.OrderProductModel[] = [];

  for await (const orderProduct of order.productList) {
    productList.push({
      ...orderProduct,
      product: productStorage.data[orderProduct.productId],
    });
  }

  return {
    ...order,

    creator: await when(isFieldExits(order.creatorId), () =>
      get<Projects.Hami.User>(order.creatorId, config.userStorage),
    ),
    customer: await when(isFieldExits(order.customerId), () =>
      get<Projects.Hami.Supplier>(order.customerId, config.customerStorage),
    ),
    customerProject: await when(
      isFieldExits(order.customerProjectId, order.customerId),
      () =>
        get<Projects.Hami.CustomerProject>(
          order.customerProjectId,
          config.customerProjectStoragePrefix + order.customerId,
        ),
    ),
    supplier: await when(isFieldExits(order.supplierId), () =>
      get<Projects.Hami.Supplier>(order.supplierId, config.supplierStorage),
    ),
    productList,
  };
}
