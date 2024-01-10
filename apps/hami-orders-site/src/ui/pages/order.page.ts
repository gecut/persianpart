import '#hami/ui/components/order-invoice';

import { signalElement } from '@gecut/mixins';
import { request } from '@gecut/signal';
import { html, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import { getVariableFromUrl } from '../router';

import type { Projects, RenderResult } from '@gecut/types';

declare global {
  interface HTMLElementTagNameMap {
    'page-order': PageOrder;
  }
}

@customElement('page-order')
export class PageOrder extends signalElement {
  @state()
  private order?: Projects.Hami.OrderModel;

  @state()
  private invoice: 'customer' | 'supplier' = 'customer';

  override connectedCallback(): void {
    super.connectedCallback();

    this.invoice =
      String(getVariableFromUrl('type')) === 'supplier' ?
        'supplier' :
        'customer';

    this.addSignalListener('order-storage', (value) => {
      this.log.property?.('order-storage', value);

      const orderId = String(getVariableFromUrl('id'));

      this.order = value.data[orderId];
    });

    request('order-storage', {}, 'cacheFirst');
  }

  override render(): RenderResult {
    super.render();

    if (this.order == null || this.invoice == null) return nothing;

    return html`
      <order-invoice
        .order=${this.order}
        .invoice=${this.invoice}
      ></order-invoice>
    `;
  }
}
