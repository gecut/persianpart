import '#persianpart/ui/pages/new-order/new-order.page';
import '#persianpart/ui/pages/order-details/order-details.page';
import '#persianpart/ui/pages/orders-categories/orders-categories.page';
import '#persianpart/ui/pages/orders-list/orders-list.page';
import '#persianpart/ui/pages/products/products.page';
import '#persianpart/ui/pages/settings/settings.page';
import '#persianpart/ui/pages/sign-in/sign-in.page';
import '#persianpart/ui/pages/support/support.page';
import '#persianpart/ui/pages/user/user.page';
import '#persianpart/ui/pages/users/users.page';

import type { Route } from '@vaadin/router';

export const routes: Route[] = [
  {
    path: '/',
    name: 'home',
    redirect: '/products',
  },

  {
    path: '/products',
    name: 'products',
    component: 'page-products',
  },

  {
    path: '/settings',
    name: 'settings',
    component: 'page-settings',
  },

  {
    path: '/orders',
    children: [
      {
        path: '/',
        name: 'orders-categories',
        component: 'page-orders-categories',
      },
      {
        path: '/new',
        name: 'new-order',
        component: 'page-new-order',
      },
      {
        path: '/list/:date',
        name: 'orders-list',
        component: 'page-orders-list',
      },
      {
        path: '/:order',
        name: 'order-details',
        component: 'page-order-details',
      },
    ],
  },

  {
    path: '/support',
    name: 'support',
    component: 'page-support',
  },

  {
    path: '/user',
    children: [
      {
        path: '/',
        name: 'user-profile',
        component: 'page-user',
      },
      {
        path: '/sign-in',
        name: 'sign-in',
        component: 'page-sign-in',
      },
    ],
  },

  {
    path: '/users',
    name: 'user-list',
    component: 'page-users',
  },
];
