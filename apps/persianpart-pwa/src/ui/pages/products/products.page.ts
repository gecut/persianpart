import newOrderFab from '#persianpart/content/fab/new-order.fab';
import requiredAuthed from '#persianpart/decorators/require-authed';
import type { OrderProduct } from '#persianpart/entities/order';
import type { ProductJsonEntity } from '#persianpart/entities/product';
import dataManager from '#persianpart/manager/data';
import { PageData } from '#persianpart/ui/helpers/page-data';

import { ReceiverController } from '@gecut/data-manager/controllers/receiver';
import i18n from '@gecut/i18n';
import { PageSearchList } from '@gecut/lit-helper/pages/search-list';
import { createSignalProvider, dispatch, request } from '@gecut/signal';
import { css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import placeholderImage from '../../../../public/icon-512-maskable.png';

import { ProductPreview } from './product-preview';

import type { GecutPWAPageMeta } from '@gecut/lit-helper/pages/page';
import type { M3 } from '@gecut/ui-kit';

declare global {
  interface HTMLElementTagNameMap {
    'page-products': PageProducts;
  }
}

@customElement('page-products')
@requiredAuthed
export class PageProducts extends PageSearchList<
  'products',
  typeof dataManager
> {
  static override styles = [
    ...PageSearchList.styles,
    css`
      md-list-item div[slot='start'] {
        overflow: hidden;
        width: 56px;
        height: 56px;
        border-radius: 8px;
      }
      md-list-item div[slot='start'] img {
        height: 100%;
        width: 100%;
        object-fit: cover;
      }
    `,
  ];

  static signals = {
    order: createSignalProvider('order'),
  };

  data = new ReceiverController(this, 'data', 'products', dataManager, {
    success: this.renderData.bind(this),
    'first-pending': () => html`${PageData.fetchingCard}`,
    error: () => html`${PageData.fetchErroredCard}`,
  });

  protected override queryParameters: Partial<{
    name: true;
    unit: true;
    quantity: true;
    price: true;
    _id?: true;
    createdAt?: true;
  }> = {
    name: true,
  };

  private orderProducts: OrderProduct[] = [];
  private fabStatus: 'none' | 'new-order' = 'none';

  override connectedCallback() {
    super.connectedCallback();

    dispatch('headline', i18n.msg('product-list'));

    this.searchBarPlaceHolder = i18n.msg('search-in-products-list');

    this.orderProducts = PageProducts.signals.order.value?.products ?? [];
    request('fab', []);

    this.fabUpdate();

    this.addSignalListener('order', (order) => {
      this.orderProducts = order.products ?? [];

      this.fabUpdate();
    });
  }

  static openProductPreview(image: HTMLImageElement) {
    return (event: MouseEvent) => {
      event.preventDefault();

      ProductPreview.renderPreview(image.src);
    };
  }

  protected override renderItem(product: ProductJsonEntity) {
    super.renderItem(product);

    const price = i18n.msg(
      'p-price',
      i18n.int(Math.ceil(product.price)),
      i18n.msg('$financial-unit'),
    );
    const quantity = i18n.msg(
      'p-quantity',
      i18n.int(Math.floor(product.quantity)),
      product.unit,
    );

    const checked = this.orderProducts
      .map((_product) => _product._id)
      .includes(product._id);

    const image = new Image();

    image.src = placeholderImage;

    const lazyLoadImage = new Image();

    lazyLoadImage.addEventListener('load', () => {
      image.src = lazyLoadImage.src;

      lazyLoadImage.remove();
    });

    lazyLoadImage.src = '/images/' + product.nickId + '.jpeg';

    return html`
      <label>
        <md-list-item>
          <div
            slot="start"
            @click=${PageProducts.openProductPreview(image)}
            @keypress=${PageProducts.openProductPreview(image)}
          >
            ${image}
          </div>

          <span slot="headline">${product.name}</span>
          <span slot="supporting-text">${price}</span>
          <span slot="supporting-text">${quantity}</span>

          <md-checkbox
            slot="end"
            ?checked=${checked}
            @change=${this.productOrderToggle(product)}
          ></md-checkbox>
        </md-list-item>
        <md-divider></md-divider>
      </label>
    `;
  }

  protected override meta(): GecutPWAPageMeta {
    super.meta();

    return {
      title: i18n.msg('product-list'),
    };
  }

  private productOrderToggle(product: ProductJsonEntity) {
    return (event: Event) => {
      const target = event.target as M3.Types.CheckboxRendererReturn;

      if (target.checked === true) {
        const newItem: OrderProduct = {
          ...product,

          amount: 1,
        };

        this.orderProducts = [...this.orderProducts, newItem];
      } else {
        this.orderProducts = this.orderProducts.filter(
          (product) => product._id !== product._id,
        );
      }

      PageProducts.signals.order.dispatch({
        status:
          PageProducts.signals.order.value?.status ?? 'awaiting-confirmation',
        products: this.orderProducts,
      });
    };
  }

  private fabStatusUpdate(fabStatus: 'none' | 'new-order'): void {
    this.log.methodArgs?.('fabStatusUpdate', { fabStatus });

    switch (fabStatus) {
      case 'none':
        request('fab', []);

        break;
      case 'new-order':
        request('fab', [newOrderFab]);

        break;
    }
  }
  private fabUpdate(): void {
    const productLength =
      PageProducts.signals.order?.value?.products?.length ?? 0;

    const oldFabStatus = this.fabStatus;

    if (productLength > 0 && this.fabStatus !== 'new-order') {
      this.fabStatus = 'new-order';
    } else if (productLength === 0 && this.fabStatus !== 'none') {
      this.fabStatus = 'none';
    }

    if (oldFabStatus !== this.fabStatus) {
      this.fabStatusUpdate(this.fabStatus);
    }
  }
}
