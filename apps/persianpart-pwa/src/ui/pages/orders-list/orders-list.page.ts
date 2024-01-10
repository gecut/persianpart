import requiredAdmin from '#persianpart/decorators/require-admin';
import type { OrderJsonEntity } from '#persianpart/entities/order';
import dataManager from '#persianpart/manager/data';
import { PageData } from '#persianpart/ui/helpers/page-data';
import { router } from '#persianpart/ui/router';

import { ReceiverController } from '@gecut/data-manager/controllers/receiver';
import i18n from '@gecut/i18n';
import { MaterialSymbols } from '@gecut/icons/material-symbols';
import { PageList } from '@gecut/lit-helper/pages/list';
import { createSignalProvider, dispatch } from '@gecut/signal';
import { css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';

import type { RenderResult } from '@gecut/types';

declare global {
  interface HTMLElementTagNameMap {
    'page-orders-list': PageOrders;
  }
}

@customElement('page-orders-list')
@requiredAdmin
export class PageOrders extends PageList<'orders', typeof dataManager> {
  static override styles = [
    ...PageList.styles,
    css`
      .success {
        color: var(--md-sys-color-success);
      }
      .pending {
        color: var(--md-sys-color-warning);
      }
      .cancel {
        color: var(--md-sys-color-danger);
      }
    `,
  ];
  static override signals = {
    order: createSignalProvider('order'),
  };

  data = new ReceiverController(this, 'data', 'orders', dataManager, {
    success: this.renderData.bind(this),
    'first-pending': () => html`${PageData.fetchingCard}`,
    error: () => html`${PageData.fetchErroredCard}`,
  });

  override connectedCallback() {
    super.connectedCallback();

    dispatch('headline', i18n.msg('orders-list'));
  }

  static itemIconContent(item: OrderJsonEntity): RenderResult {
    switch (item.status) {
      case 'accepted':
        return html`
          <md-icon class="success" slot="start">
            ${unsafeSVG(MaterialSymbols.OutlineRounded.CheckCircle)}
          </md-icon>
        `;
      case 'awaiting-confirmation':
        return html`
          <md-icon class="pending" slot="start">
            ${unsafeSVG(MaterialSymbols.Outline.Pending)}
          </md-icon>
        `;
      case 'canceled':
        return html`
          <md-icon class="cancel" slot="start">
            ${unsafeSVG(MaterialSymbols.OutlineRounded.Cancel)}
          </md-icon>
        `;
    }
  }

  protected override filter(order: OrderJsonEntity): boolean {
    super.filter(order);

    return (
      new Date(order.createdAt ?? '').toDateString() === router.params['date']
    );
  }

  protected override renderItem(order: OrderJsonEntity) {
    super.renderItem(order);

    const totalPrice = order.products
      .map((product) => product.price * product.amount)
      .reduce((p, c) => p + c, 0);

    return html`
      <label>
        <md-list-item
          .href=${router.link('order-details', { order: order._id ?? '' })}
        >
          <span slot="headline">
            ${order.user.firstName + ' ' + order.user.lastName}
          </span>
          <span slot="supporting-text">
            ${i18n.msg(
              'item-order-text',
              i18n.int(totalPrice),
              i18n.msg('$financial-unit'),
            )}
          </span>
          <span slot="trailing-supporting-text">
            ${i18n.time(order.createdAt ?? '')}
          </span>
          ${PageOrders.itemIconContent(order)}
        </md-list-item>
      </label>
    `;
  }
}
