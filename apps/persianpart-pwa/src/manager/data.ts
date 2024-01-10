import { api } from '#persianpart/client';
import type { OrderJsonEntity } from '#persianpart/entities/order';
import type { ProductJsonEntity } from '#persianpart/entities/product';
import type { SettingJsonEntity } from '#persianpart/entities/setting';
import type {
  UserChangePasswordJsonEntity,
  UserJsonEntity,
} from '#persianpart/entities/user';

import { DataManager } from '@gecut/data-manager/index';
import i18n from '@gecut/i18n';
import { untilIdle } from '@gecut/utilities/delay';
import localStorageJson from '@gecut/utilities/local-storage-json';

export type OrdersCategory = {
  dateKey: string;
  dateLabel: string;
  pendingCount: number;
};

declare global {
  interface GecutReceiverServices {
    // * User Admin Data
    readonly users: UserJsonEntity[];
    readonly orders: OrderJsonEntity[];
    readonly ordersCategories: OrdersCategory[];

    // * Global Data
    readonly products: ProductJsonEntity[];

    // * User Data
    readonly user: Partial<UserJsonEntity>;
    readonly userOrders: OrderJsonEntity[];
    readonly settings: Partial<SettingJsonEntity>;
    readonly _isAuthenticated: boolean;
    readonly _isAdmin: boolean;
  }
  interface GecutSenderServices {
    readonly signIn: {
      phoneNumber: string;
      password: string;
    };
    readonly newUser: UserJsonEntity;
    readonly editUser: Partial<UserJsonEntity>;
    readonly userChangePassword: UserChangePasswordJsonEntity;

    readonly newOrder: Partial<OrderJsonEntity>;
    readonly editOrder: Partial<OrderJsonEntity>;
    readonly deleteOrder: string;

    readonly newProducts: ProductJsonEntity[];
  }
}

export const dataManager = new DataManager(
  {
    // * User Admin Data
    users: {
      async receiverFunction() {
        if ((await dataManager.receivers._isAdmin.data()) === true) {
          return await api.user.repository.query();
        }

        return [];
      },
    },
    orders: {
      async receiverFunction() {
        if ((await dataManager.receivers._isAdmin.data()) === true) {
          return await api.order.repository.query();
        }

        return [];
      },
    },
    ordersCategories: {
      async receiverFunction() {
        const orders = (await dataManager.receivers.orders?.data())?.sort(
          (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
        );

        if (orders == null || orders.length === 0) return [];

        const ordersCategories: GecutReceiverServices['ordersCategories'] = [];

        for (const order of orders) {
          const dateLabel = i18n.date(order.createdAt);

          const category = ordersCategories.find(
            (_order) => _order.dateLabel === dateLabel,
          );

          if (category != null) {
            if (order.status === 'awaiting-confirmation')
              category.pendingCount++;
          } else {
            ordersCategories.push({
              dateKey: new Date(order.createdAt).toDateString(),
              dateLabel,
              pendingCount: order.status === 'awaiting-confirmation' ? 1 : 0,
            });
          }
        }

        return ordersCategories;
      },
    },

    // * Global Data
    products: {
      cache: 'local-storage',
      async receiverFunction() {
        if ((await dataManager.receivers._isAuthenticated.data()) === true) {
          return await api.product.repository.query();
        }

        return [];
      },
    },

    // * User Data
    user: {
      async receiverFunction() {
        if (localStorageJson.get('user.id', null) == null) {
          return {};
        }

        const _return = await api.user.info.query();

        return _return ?? {};
      },
    },
    userOrders: {
      async receiverFunction() {
        if ((await dataManager.receivers._isAuthenticated.data()) === true) {
          return await api.order.list.query();
        }

        return [];
      },
    },
    settings: {
      cache: 'local-storage',
      async receiverFunction() {
        if ((await dataManager.receivers._isAuthenticated.data()) === true) {
          return await api.setting.repository.query();
        }

        return {};
      },
    },
    _isAuthenticated: {
      async receiverFunction() {
        return (await dataManager.receivers.user.data())?.active ?? false;
      },
    },
    _isAdmin: {
      async receiverFunction() {
        return (
          (await dataManager.receivers._isAuthenticated.data()) &&
          (await dataManager.receivers.user.data()).permission === 'root'
        );
      },
    },
  },
  {
    signIn: {
      dependencies: '*',
      async senderFunction(data) {
        const user = await api.user.signIn.mutate(data);

        localStorageJson.set('user.id', String(user._id));

        await untilIdle()
      },
    },
    newUser: {
      dependencies: ['users'],
      async senderFunction(data) {
        await api.user.create.mutate(data);
      },
    },
    editUser: {
      dependencies: ['users', 'user'],
      async senderFunction(data) {
        await api.user.edit.mutate(data);
      },
    },
    userChangePassword: {
      dependencies: ['user'],
      async senderFunction(data) {
        await api.user.changePassword.mutate(data);
      },
    },

    newOrder: {
      dependencies: ['orders', 'userOrders', 'products', 'ordersCategories'],
      async senderFunction(data) {
        await api.order.new.mutate(data);
      },
    },
    editOrder: {
      dependencies: ['orders', 'userOrders', 'products'],
      async senderFunction(data) {
        await api.order.edit.mutate(data);
      },
    },
    deleteOrder: {
      dependencies: ['orders', 'userOrders', 'products'],
      async senderFunction(data) {
        await api.order.delete.mutate(data);
      },
    },

    newProducts: {
      dependencies: '*',
      async senderFunction(data) {
        await api.product.create.mutate(data);
      },
    },
  },
) as DataManager;

export default dataManager;
