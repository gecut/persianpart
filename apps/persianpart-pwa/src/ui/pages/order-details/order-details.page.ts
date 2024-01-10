import orderDetail from '#persianpart/content/cards/order-detail';
import requiredAdmin from '#persianpart/decorators/require-admin';
import type { OrderJsonEntity } from '#persianpart/entities/order';
import type { ProductJsonEntity } from '#persianpart/entities/product';
import dataManager from '#persianpart/manager/data';
import { PageData as _PageData } from '#persianpart/ui/helpers/page-data';
import { router } from '#persianpart/ui/router';

import { ReceiverController } from '@gecut/data-manager/controllers/receiver';
import i18n from '@gecut/i18n';
import { PageData } from '@gecut/lit-helper/pages/data';
import { dispatch } from '@gecut/signal';
import { M3 } from '@gecut/ui-kit';
import { join } from '@gecut/utilities/join';
import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';

import type { RenderResult } from '@gecut/types';

declare global {
  interface HTMLElementTagNameMap {
    'page-order-details': PageOrderDetails;
  }
}

@customElement('page-order-details')
@requiredAdmin
export class PageOrderDetails extends PageData<'orders', typeof dataManager> {
  data = new ReceiverController(this, 'data', 'orders', dataManager, {
    success: this.renderData.bind(this),
    'first-pending': () => html`${_PageData.fetchingCard}`,
    error: () => html`${_PageData.fetchErroredCard}`,
  });

  override connectedCallback(): void {
    super.connectedCallback();

    dispatch('headline', i18n.msg('order-detail'));
    dispatch('fab', []);
  }

  static getOrderById(orders: OrderJsonEntity[]): Partial<OrderJsonEntity> {
    return (
      orders.find((order) => {
        return order._id === router.params['order'];
      }) ?? {}
    );
  }

  static productItemList(
    products: Array<
      ProductJsonEntity & {
        amount: number;
      }
    >,
  ): RenderResult {
    return html`<surface-card type="filled" scroller
      >${map(
        products ?? [],
        (product) =>
          html`${M3.Renderers.renderListItem({
            attributes: {
              headline: product.name,
              supportingText: i18n.msg(
                'p-price',
                i18n.int(product.price),
                i18n.msg('$financial-unit'),
              ),
              trailingSupportingText: join(
                ' ',
                i18n.int(product.amount),
                product.unit,
              ),
            },
          })}`,
      )}</surface-card
    >`;
  }

  protected renderData(data: OrderJsonEntity[]): RenderResult {
    super.renderData(data);

    const order = PageOrderDetails.getOrderById(data);

    return html`${this.renderOrderDetail(
      order,
    )}${PageOrderDetails.productItemList(order.products)}`;
  }

  private renderOrderDetail(order: Partial<OrderJsonEntity>): RenderResult {
    this.log.methodArgs?.('renderOrderDetail', order);

    return html`${M3.Renderers.renderSurfaceCard(orderDetail(order))}`;
  }

  // protected renderFetchedTemplate(): RenderResult {
  //   super.renderFetchedTemplate();

  //   return html`${M3.Renderers.renderSurfaceCard(orderDetail(this.data))}${this
  //     .productItemList}`;
  // }

  // protected async fetchData(): Promise<Partial<OrderJsonEntity>> {
  //   super.fetchData();

  //   return PageOrderDetails.getOrderById(await PageBase.data.orders({}));
  // }
}
