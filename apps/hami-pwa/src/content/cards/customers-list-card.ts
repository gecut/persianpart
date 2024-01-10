import icons from '#hami/ui/icons';

import i18n from '@gecut/i18n';
import { request } from '@gecut/signal';
import { M3 } from '@gecut/ui-kit';
import { sanitizer } from '@gecut/utilities/sanitizer';
import { flow } from '@lit-labs/virtualizer/layouts/flow.js';
import { html } from 'lit';

import { customerDialog } from '../dialogs/customer-dialog';

import { notFoundListCard } from './not-found-list-card';

import type { Projects } from '@gecut/types';
import type { Lit } from '@gecut/ui-kit';

export function customerItem(
  customer: Projects.Hami.CustomerModel,
  index: number,
): M3.Types.ItemRendererReturn {
  return M3.Renderers.renderListItem({
    component: 'list-item',
    type: 'list-item',
    attributes: {
      headline:
        index + 1 +
        ' ' +
        customer.firstName +
        ' ' +
        customer.lastName,
      supportingText: customer.description,
      multiLineSupportingText: true,
      trailingSupportingText: i18n.msg(
        'number-of-order',
        i18n.int(customer.orderList.length),
      ),
      classes: ['notification-item'],
      styles: {
        '--_list-item-trailing-supporting-text-color':
          'var(--md-sys-color-primary)',
      },
    },
    children: [
      {
        component: 'icon',
        type: 'svg',
        attributes: {
          slot: 'start',
        },
        SVG: icons.outlineRounded.person,
      },
    ],
    transformers: (target) => {
      target.addEventListener('click', () => {
        request('dialog', customerDialog(customer));
      });

      return target;
    },
  });
}

export function customerList(
  customers: Projects.Hami.CustomerModel[],
): Lit.Types.LitVirtualizerContent<Projects.Hami.CustomerModel> {
  return {
    component: 'lit-virtualizer',
    type: 'lit-virtualizer',

    attributes: {
      // scroller: true,
      items: customers,
      layout: flow({
        direction: 'vertical',
      }),
      renderItem: (customers, index) => {
        return html`${customerItem(customers, index)}`;
      },
    },
  };
}

export function customersListCard(
  customers: Projects.Hami.CustomerModel[],
  query = '',
): M3.Types.SurfaceCardRendererReturn {
  customers = customers.filter((customer) => customer.active === true);

  if (query.trim() !== '') {
    customers = customers.filter((customer) =>
      String(
        sanitizer.str(customer.firstName) +
          sanitizer.str(customer.lastName) +
          customer.phoneNumber,
      ).includes(query),
    );
  }

  if (customers.length === 0) {
    return M3.Renderers.renderSurfaceCard(notFoundListCard());
  }

  return M3.Renderers.renderSurfaceCard({
    component: 'surface-card',
    type: 'filled',
    children: [
      customerList(customers) as Lit.Types.LitVirtualizerContent<unknown>,
    ],
  });
}
