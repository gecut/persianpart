import i18n from '@gecut/i18n';
import { request } from '@gecut/signal';
import { nextIdleCallback } from '@gecut/utilities/polyfill';

import proxyConfig from '../proxy.conf.json';

import fa from './content/translation/fa-IR.json';
import { isAdmin } from './controllers/is-admin';

import type { States } from './ui/pages/new-order/new-order.base';
import type {
  AlwatrDocumentStorage,
  AlwatrServiceResponse,
} from '@alwatr/type';
import type { LocaleFileType } from '@gecut/i18n';
import type { PartialDeep, Projects, StringifyableRecord } from '@gecut/types';

i18n.register(fa as LocaleFileType);

export type NewOrder = PartialDeep<
  Projects.Hami.Order,
  { recurseIntoArrays: true }
>;

declare global {
  interface Signals {
    readonly 'customer-storage': AlwatrDocumentStorage<Projects.Hami.CustomerModel>;
    readonly 'notification-storage': AlwatrDocumentStorage<Projects.Hami.Notification>;
    readonly 'order-storage': AlwatrDocumentStorage<Projects.Hami.OrderModel>;
    readonly 'product-price-storage': AlwatrDocumentStorage<Projects.Hami.ProductPrice>;
    readonly 'product-storage': AlwatrDocumentStorage<Projects.Hami.Product>;
    readonly 'supplier-storage': AlwatrDocumentStorage<Projects.Hami.SupplierModel>;
    readonly 'user-storage': AlwatrDocumentStorage<Projects.Hami.UserModel>;

    readonly 'patch-customer-project-storage': Record<string, never>;
    readonly 'patch-customer-storage': Record<string, never>;
    readonly 'patch-notification-storage': Record<string, never>;
    readonly 'patch-product-price-storage': Record<string, never>;
    readonly 'patch-product-storage': Record<string, never>;
    readonly 'patch-supplier-storage': Record<string, never>;
    readonly 'patch-user-storage': Record<string, never>;
    readonly 'put-order': Record<string, never>;

    readonly 'top-app-bar-hidden': boolean;
    readonly 'bottom-app-bar-hidden': boolean;

    readonly user: Projects.Hami.SignInResponse;
    readonly 'search-product-price-query': string;
    readonly 'sign-in': AlwatrServiceResponse<
      Projects.Hami.SignInResponse,
      StringifyableRecord
    >;
    readonly 'top-app-bar-mode': 'flat' | 'on-scroll';
    readonly 'promises-list': string[];

    readonly 'new-order-state': 'next' | 'previous' | States;
    readonly 'new-order': Partial<NewOrder>;
    readonly order: Projects.Hami.Order;
  }
  interface Providers {
    readonly 'customer-storage': Record<string, never>;
    readonly 'notification-storage': Record<string, never>;
    readonly 'order-storage': Record<string, never>;
    readonly 'product-price-storage': Record<string, never>;
    readonly 'product-storage': Record<string, never>;
    readonly 'supplier-storage': Record<string, never>;
    readonly 'user-storage': Record<string, never>;
    readonly user: Record<string, never>;

    readonly 'patch-customer-project-storage': Projects.Hami.PatchRoutes['patch-customer-project-storage'];
    readonly 'patch-customer-storage': Projects.Hami.PatchRoutes['patch-customer-storage'];
    readonly 'patch-notification-storage': Projects.Hami.PatchRoutes['patch-notification-storage'];
    readonly 'patch-product-price-storage': Projects.Hami.PatchRoutes['patch-product-price-storage'];
    readonly 'patch-product-storage': Projects.Hami.PatchRoutes['patch-product-storage'];
    readonly 'patch-supplier-storage': Projects.Hami.PatchRoutes['patch-supplier-storage'];
    readonly 'patch-user-storage': Projects.Hami.PatchRoutes['patch-user-storage'];
    readonly 'put-order': Projects.Hami.PatchRoutes['put-order'];

    readonly 'sign-in': Projects.Hami.SignInRequest;
    readonly 'promises-list': {
      key: string;
      type: 'add' | 'remove';
    };
  }
}

const config = {
  apiUrl: proxyConfig['/api/v0'].target,
  version: '0.0.1',
  userCacheList: <Array<keyof Partial<Signals>>>[
    'customer-storage',
    'order-storage',
    'product-price-storage',
    'product-storage',
    'user',
    'sign-in',
  ],
  userReloadCacheList: <Array<keyof Partial<Providers>>>[
    'customer-storage',
    'order-storage',
    'product-price-storage',
    'product-storage',
    'user',
  ],
  adminUserCacheList: <Array<keyof Partial<Providers>>>[
    'supplier-storage',
    'user-storage',
  ],
};

async function loadData() {
  const admin = await isAdmin();

  for await (const cacheName of config.userReloadCacheList) {
    await request(cacheName, {});
  }

  if (admin === true) {
    for await (const cacheName of config.adminUserCacheList) {
      await request(cacheName, {});
    }
  }

  setTimeout(() => nextIdleCallback(loadData), 60_000);
}

setTimeout(loadData, 60_000);

export default config;
