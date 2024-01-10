import { html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { NewOrderData } from './new-order.data';

import type { RenderResult } from '@gecut/types';
import type { PropertyValueMap } from 'lit';

declare global {
  interface HTMLElementTagNameMap {
    'page-new-order': PageNewOrder;
  }
}

@customElement('page-new-order')
export class PageNewOrder extends NewOrderData {
  override render(): RenderResult {
    super.render();

    return html`${this.slideStates[this.state]()}`;
  }

  protected firstUpdated(
    _changedProperties: PropertyValueMap<this> | Map<PropertyKey, unknown>,
  ): void {
    super.firstUpdated(_changedProperties);

    this.updateFab();
  }
}
