import '../pages/bill.page';
import '../pages/order.page';

import type { Route } from '@vaadin/router';

export const routes: Route[] = [
  {
    path: '/order/:type/:id',
    name: 'order',
    component: 'page-order',
  },
  {
    path: '/bill/:type/:id',
    name: 'bill',
    component: 'page-bill',
  },
];
