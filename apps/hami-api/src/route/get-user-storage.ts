import { get } from '#hami/lib/get-data';
import { isFieldExits } from '#hami/lib/is-exists';
import { when } from '#hami/lib/when';

import { config, logger } from '../lib/config';
import { nanoServer } from '../lib/server';
import { storageClient } from '../lib/storage';
import { requireAdmin } from '../util/require-admin';

import type { Projects } from '@gecut/types';

nanoServer.route(
  'GET',
  '/user-storage/',
  async (connection): Promise<Projects.Hami.Routes['user-storage']> => {
    logger.logMethod?.('get-user-storage');

    await requireAdmin(connection);

    const userStorage = await storageClient.getStorage<Projects.Hami.UserModel>(
      config.userStorage,
    );
    const customerStorage =
      await storageClient.getStorage<Projects.Hami.Customer>(
        config.customerStorage,
      );
    const orderStorage = await storageClient.getStorage<Projects.Hami.Order>(
      config.orderStorage,
    );

    for (const orderId of Object.keys(orderStorage.data)) {
      if (orderStorage.data[orderId].active == false) {
        delete orderStorage.data[orderId];
      }
    }

    for await (const userId of Object.keys(userStorage.data)) {
      const user = userStorage.data[userId];

      const userModel: Projects.Hami.UserModel = {
        orderList: await Promise.all(Object.values(orderStorage.data)
          .filter((order) => order.creatorId === userId)
          .map(async (order) => await orderModel(order))),
        customerList: Object.values(customerStorage.data).filter(
          (customer) => customer.creatorId === userId,
        ),

        ...user,
      };

      userStorage.data[userId] = userModel;
    }

    return userStorage;
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
