import '#hami/ui/components/orders-bill';

import { signalElement } from '@gecut/mixins';
import { request } from '@gecut/signal';
import '@material/web/progress/circular-progress';
import { css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import { getVariableFromUrl } from '../router';

import type { Projects, RenderResult } from '@gecut/types';

declare global {
  interface HTMLElementTagNameMap {
    'page-bill': PageBill;
  }
}

@customElement('page-bill')
export class PageBill extends signalElement {
  static styles = [
    css`
      md-circular-progress {
        --_size: clamp(32px, 10vw, 64px);

        position: fixed;
        inset: calc(50% - var(--_size) / 2);
      }
    `,
  ];

  @state()
  private orders?: Projects.Hami.OrderModel[];
  private type: 'customer' | 'supplier' = getVariableFromUrl('type') as
    | 'customer'
    | 'supplier';

  override connectedCallback(): void {
    super.connectedCallback();

    this.addSignalListener('order-storage', (value) => {
      this.log.property?.('order-storage', value);

      if (this.type === 'customer') {
        const id = getVariableFromUrl('id').toString().split('-');

        this.orders = Object.values(value.data)
          .filter((order) => order.customerId === id[0])
          .filter((order) => order.customerProjectId === id[1]);
      } else if (this.type === 'supplier') {
        this.orders = Object.values(value.data).filter(
          (order) => order.supplierId === getVariableFromUrl('id'),
        );
      }
    });

    request('order-storage', {}, 'cacheFirst');
  }

  override render(): RenderResult {
    super.render();

    if (this.orders == null) {
      return html`<md-circular-progress indeterminate></md-circular-progress>`;
    }

    return html`<orders-bill
      .type=${this.type}
      .orders=${this.orders}
    ></orders-bill>`;
  }
}
