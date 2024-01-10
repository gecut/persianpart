import requiredAdmin from '#persianpart/decorators/require-admin';
import type { OrdersCategory } from '#persianpart/manager/data';
import dataManager from '#persianpart/manager/data';
import { PageData } from '#persianpart/ui/helpers/page-data';
import { router } from '#persianpart/ui/router';

import { ReceiverController } from '@gecut/data-manager/controllers/receiver';
import i18n from '@gecut/i18n';
import { MaterialSymbols } from '@gecut/icons/material-symbols';
import { PageList } from '@gecut/lit-helper/pages/list';
import { createSignalProvider, dispatch } from '@gecut/signal';
import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { when } from 'lit/directives/when.js';

declare global {
  interface HTMLElementTagNameMap {
    'page-orders-categories': PageOrdersCategories;
  }
}

@customElement('page-orders-categories')
@requiredAdmin
export class PageOrdersCategories extends PageList<
  'ordersCategories',
  typeof dataManager
> {
  static signals = {
    order: createSignalProvider('order'),
  };

  data = new ReceiverController(this, 'data', 'ordersCategories', dataManager, {
    success: this.renderData.bind(this),
    'first-pending': () => html`${PageData.fetchingCard}`,
    error: () => html`${PageData.fetchErroredCard}`,
  });

  override connectedCallback() {
    super.connectedCallback();

    dispatch('headline', i18n.msg('orders-list'));
    dispatch('fab', []);
  }

  protected renderItem(item: OrdersCategory) {
    super.renderItem(item);

    return html`
      <label>
        <md-list-item
          .href=${router.link('orders-list', { date: item.dateKey })}
        >
          ${when(
            item.pendingCount === 0,
            () =>
              html`<md-icon
                slot="start"
                style="color: var(--md-sys-color-success);"
                >${unsafeSVG(
                  MaterialSymbols.OutlineRounded.CheckCircle,
                )}</md-icon
              >`,
            () =>
              html`<md-icon
                slot="start"
                style="color: var(--md-sys-color-warning);"
                >${unsafeSVG(MaterialSymbols.Outline.Pending)}</md-icon
              >`,
          )}
          <span slot="headline">${item.dateLabel}</span>
          ${when(
            item.pendingCount > 0,
            () =>
              html`<span slot="supporting-text"
                >${i18n.msg(
                  'number-of-orders-pending-confirmation',
                  i18n.int(item.pendingCount),
                )}
              </span>`,
          )}
        </md-list-item>
        <md-divider></md-divider>
      </label>
    `;
  }
}
