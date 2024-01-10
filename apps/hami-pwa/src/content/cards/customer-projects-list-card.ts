import icons from '#hami/ui/icons';

import i18n from '@gecut/i18n';
import { request } from '@gecut/signal';

import { addCustomerProjectDialog } from '../dialogs/add-customer-project-dialog';

import { notFoundListCard } from './not-found-list-card';

import type { Projects } from '@gecut/types';
import type { M3 } from '@gecut/ui-kit';

export function customerProjectItem(
  customer: Projects.Hami.CustomerModel,
  project: Projects.Hami.CustomerProjectModel,
): M3.Types.ListItemContent {
  const balance = customer.orderList
    .filter((order) => order.customerProjectId === project.id)
    .map((order) =>
      order.productList.map(
        (orderProduct) => orderProduct.quantity * orderProduct.salesPrice,
      ),
    )
    .flat()
    .reduce((p, c) => p + c, 0);

  return {
    component: 'list-item',
    type: 'list-item',
    attributes: {
      href: `https://orders.hami-app.ir/bill/customer/${customer.id}-${project.id}`,
      target: '_blank',
      headline: project.projectName,
      supportingText: project.projectAddress,
      trailingSupportingText: i18n.int(balance ?? 0) + ' ریال',
      styles: {
        width: '100%',
      },
      classes: ['project-item'],
    },
    children: [
      {
        component: 'icon',
        type: 'svg',
        attributes: {
          slot: 'start',
        },
        SVG: icons.outlineRounded.edit,
        events: {
          click: async (event: Event) => {
            event.preventDefault();

            (await request('dialog', {}, 'cacheFirst')).close();

            request('dialog', addCustomerProjectDialog(customer.id, project));
          },
        },
      },
    ],
  };
}

export function customerProjectListCard(
  customer: Projects.Hami.CustomerModel,
): M3.Types.SurfaceCardContent {
  if (customer.projectList.length === 0) {
    return notFoundListCard(i18n.msg('project-not-found'));
  }

  return {
    component: 'surface-card',
    type: 'filled',
    attributes: {
      styles: { 'margin-bottom': 'calc(2*var(--sys-spacing-track,8px))' },
    },
    children: customer.projectList
      .filter((project) => project.active)
      .map((project) => customerProjectItem(customer, project)),
  };
}
