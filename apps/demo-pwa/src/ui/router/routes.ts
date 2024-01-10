import type { Route } from '@vaadin/router';

import '#demo/ui/pages/home.page';
import '#demo/ui/pages/settings.page';

export const routes: Route[] = [
  {
    path: '/sample/:slug',
    name: 'sample',
    component: 'page-home',
  },
  {
    path: '/settings',
    name: 'settings',
    component: 'page-settings',
  },
];
