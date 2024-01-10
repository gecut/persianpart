import { ifAdmin } from '#hami/controllers/if-admin';
import icons from '#hami/ui/icons';

import i18n from '@gecut/i18n';
import { request } from '@gecut/signal';
import { M3 } from '@gecut/ui-kit';
import { join } from '@gecut/utilities/join';
import { flow } from '@lit-labs/virtualizer/layouts/flow.js';
import { html } from 'lit';

import { supplierDialog } from '../dialogs/supplier-dialog';

import { notFoundListCard } from './not-found-list-card';

import type { Projects } from '@gecut/types';
import type { Lit } from '@gecut/ui-kit';

export function supplierItem(
  supplier: Projects.Hami.SupplierModel,
): M3.Types.ItemRendererReturn {
  return M3.Renderers.renderListItem({
    component: 'list-item',
    type: 'list-item',
    attributes: {
      headline: supplier.firstName + ' ' + supplier.lastName,
      supportingText: supplier.description,
      multiLineSupportingText: true,
      trailingSupportingText: i18n.msg(
        'number-of-order',
        i18n.int(supplier.orderList.length),
      ),
      classes: ['supplier-item'],
      styles: {
        '--_list-item-trailing-supporting-text-color':
          'var(--md-sys-color-primary)',
      },
    },
    children: [
      {
        component: 'icon',
        type: 'svg',
        attributes: { slot: 'start' },
        SVG: icons.outlineRounded.person,
      },
    ],
    transformers: (target) => {
      ifAdmin(
        () => {
          target.addEventListener('click', () => {
            request('dialog', supplierDialog(supplier, true));
          });
        },
        () => {
          target.addEventListener('click', () => {
            request('dialog', supplierDialog(supplier, false));
          });
        },
      );

      return target;
    },
  });
}

export function supplierList(
  suppliers: Projects.Hami.SupplierModel[],
): Lit.Types.LitVirtualizerContent<Projects.Hami.SupplierModel> {
  return {
    component: 'lit-virtualizer',
    type: 'lit-virtualizer',

    attributes: {
      // scroller: true,
      items: suppliers,
      layout: flow({
        direction: 'vertical',
      }),
      renderItem: (suppliers) => {
        return html`${supplierItem(suppliers)}`;
      },
    },
  };
}

export function suppliersListCard(
  suppliers: Projects.Hami.SupplierModel[],
  query = '',
): M3.Types.SurfaceCardRendererReturn {
  suppliers = suppliers.filter((supplier) => supplier.active === true);

  if (query.trim() !== '') {
    suppliers = suppliers.filter((supplier) =>
      join(
        ' ',
        supplier.firstName,
        supplier.lastName,
        supplier.phoneNumber,
      ).includes(query),
    );
  }

  if (suppliers.length === 0) {
    return M3.Renderers.renderSurfaceCard(notFoundListCard());
  }

  return M3.Renderers.renderSurfaceCard({
    component: 'surface-card',
    type: 'filled',
    children: [
      supplierList(suppliers) as Lit.Types.LitVirtualizerContent<unknown>,
    ],
  });
}
