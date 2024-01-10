import type { NewOrder } from '#hami/config';
import { isFieldExits } from '#hami/controllers/is-field-exists';
import icons from '#hami/ui/icons';

import i18n from '@gecut/i18n';
import { dispatch } from '@gecut/signal';
import { M3 } from '@gecut/ui-kit';
import { join } from '@gecut/utilities/join';
import { sanitizer } from '@gecut/utilities/sanitizer';
import { flow } from '@lit-labs/virtualizer/layouts/flow.js';
import { html } from 'lit';

import { notFoundListCard } from '../cards/not-found-list-card';
import { headingPageTypography } from '../typographies/heading-page-typography';

import type { PartialDeep, Projects, RenderResult } from '@gecut/types';
import type { Lit } from '@gecut/ui-kit';

export function productItem(
  product: Projects.Hami.Product,
  orderProduct:
    | PartialDeep<Projects.Hami.OrderProduct, { recurseIntoArrays: true }>
    | undefined,
): M3.Types.ItemRendererReturn {
  return M3.Renderers.renderListItem({
    component: 'list-item',
    type: 'list-item',
    attributes: {
      headline: product.code + ' - ' + product.name,
      supportingText: join(
        ' - ',
        i18n.int(orderProduct?.salesPrice ?? 0),
        i18n.int(orderProduct?.purchasePrice ?? 0),
      ),
      multiLineSupportingText: true,
      trailingSupportingText:
        i18n.int(orderProduct?.quantity ?? 0) + ' ' + orderProduct?.unit,
      classes: ['product-item'],
    },
    children: [
      {
        component: 'icon',
        type: 'svg',
        attributes: { slot: 'start' },
        SVG: icons.outlineRounded.category,
      },
    ],
  });
}

export function productList(
  order: Partial<NewOrder>,
  products: Projects.Hami.Product[],
): Lit.Types.LitVirtualizerContent<Projects.Hami.Product> {
  return {
    component: 'lit-virtualizer',
    type: 'lit-virtualizer',

    attributes: {
      // scroller: true,
      items: products,
      layout: flow({
        direction: 'vertical',
      }),
      renderItem: (product) => {
        const orderProduct = (order.productList ?? []).find(
          (_orderProduct) => _orderProduct?.productId === product.id,
        );

        return html`${productItem(product, orderProduct)}`;
      },
    },
  };
}

export function productsListCard(
  order: Partial<NewOrder>,
  products: Projects.Hami.Product[],
): M3.Types.SurfaceCardRendererReturn {
  if (products.length === 0) {
    return M3.Renderers.renderSurfaceCard(notFoundListCard());
  }

  return M3.Renderers.renderSurfaceCard({
    component: 'surface-card',
    type: 'filled',
    attributes: {
      styles: {
        'margin-top': 'var(--sys-spacing-track,8px)',
        'margin-bottom': 'calc(3*var(--sys-spacing-track,8px))',
      },
    },
    children: [
      productList(order, products) as Lit.Types.LitVirtualizerContent<unknown>,
    ],
  });
}

function descriptionCard(order: Partial<NewOrder>): RenderResult {
  const headline = M3.Renderers.renderTypoGraphy(
    headingPageTypography(i18n.msg('description')),
  );
  const descriptionCardTemplate = M3.Renderers.renderSurfaceCard({
    component: 'surface-card',
    type: 'filled',
    attributes: {
      styles: {
        'margin-top': 'var(--sys-spacing-track,8px)',
        'margin-bottom': 'var(--sys-spacing-track,8px)',
        'padding': 'calc(2*var(--sys-spacing-track,8px))',
        'padding-top': 'var(--sys-spacing-track,8px)',
      },
    },
    children: [
      {
        component: 'form-builder',
        type: 'form-builder',
        attributes: {
          styles: {
            'margin-top': '8px',
            '--padding-horizontal': '0',
          },
          activeSlide: 'initial',
          data: {
            slides: {
              initial: [
                {
                  component: 'text-field',
                  type: 'filled',
                  attributes: {
                    inputType: 'text',
                    name: 'description',
                    value: order.description,
                    label: i18n.msg('description'),
                  },
                },
              ],
            },
            onChange: (event) => {
              const description = event.values?.['initial']['description'];

              if (description != null) {
                dispatch('new-order', {
                  description,
                });
              }
            },
          },
        },
      },
    ],
  });

  return html`${headline}${descriptionCardTemplate}`;
}

function reviewCard(
  order: Partial<NewOrder>,
  customer: Projects.Hami.CustomerModel | undefined,
  project: Projects.Hami.CustomerProjectModel | undefined,
  productList: Projects.Hami.Product[],
): RenderResult {
  const headline = M3.Renderers.renderTypoGraphy(
    headingPageTypography(i18n.msg('review')),
  );
  const customerCardTemplate = M3.Renderers.renderSurfaceCard({
    component: 'surface-card',
    type: 'filled',
    attributes: {
      styles: {
        'margin-top': 'var(--sys-spacing-track,8px)',
        'margin-bottom': 'var(--sys-spacing-track,8px)',
      },
    },
    children: [
      {
        component: 'list-item',
        type: 'list-item',
        attributes: {
          headline:
            sanitizer.str(customer?.firstName) +
            ' ' +
            sanitizer.str(customer?.lastName),
          supportingText: customer?.description,
        },
        children: [
          {
            component: 'icon',
            type: 'svg',
            attributes: { slot: 'start' },
            SVG: icons.outlineRounded.person,
          },
        ],
      },
      {
        component: 'list-item',
        type: 'list-item',
        attributes: {
          headline: sanitizer.str(project?.projectName),
          supportingText: project?.projectAddress,
          multiLineSupportingText: true,
        },
        children: [
          {
            component: 'icon',
            type: 'svg',
            attributes: { slot: 'start' },
            SVG: icons.filledRounded.corporateFare,
          },
        ],
      },
    ],
  });
  const dateCardTemplate = M3.Renderers.renderSurfaceCard({
    component: 'surface-card',
    type: 'filled',
    attributes: {
      styles: {
        'margin-top': 'var(--sys-spacing-track,8px)',
        'margin-bottom': 'var(--sys-spacing-track,8px)',
      },
    },
    children: [
      {
        component: 'list-item',
        type: 'list-item',
        attributes: {
          headline: i18n.msg('registration-date'),
          supportingText: i18n.date(order.registrationDate ?? 0),
          hidden: isFieldExits(order.registrationDate) === false,
        },
        children: [
          {
            component: 'icon',
            type: 'svg',
            attributes: { slot: 'start' },
            SVG: icons.outlineRounded.event,
          },
        ],
      },
      {
        component: 'list-item',
        type: 'list-item',
        attributes: {
          headline: i18n.msg('evacuation-date'),
          supportingText: i18n.date(order.evacuationDate ?? 0),
          hidden: isFieldExits(order.evacuationDate) === false,
        },
        children: [
          {
            component: 'icon',
            type: 'svg',
            attributes: { slot: 'start' },
            SVG: icons.outlineRounded.eventAvailable,
          },
        ],
      },
    ],
  });

  return html`${headline}${customerCardTemplate}${dateCardTemplate}${productsListCard(
    order,
    productList,
  )}`;
}

export function reviewPage(
  order: Partial<NewOrder>,
  customer: Projects.Hami.CustomerModel | undefined,
  project: Projects.Hami.CustomerProjectModel | undefined,
  products: Projects.Hami.Product[],
): RenderResult {
  products = products.filter((product) =>
    (order.productList ?? [])
      .map((orderProduct) => orderProduct?.productId ?? '')
      .includes(product.id),
  );

  return html`${descriptionCard(order)}${reviewCard(
    order,
    customer,
    project,
    products,
  )}`;
}
