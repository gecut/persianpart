import { notFoundListCard } from '#hami/content/cards/not-found-list-card';
import { orderCard } from '#hami/content/cards/order-card';
import { newOrderFAB } from '#hami/content/fabs/new-order-fab';
import { dateSelect } from '#hami/content/selects/date-select';
import { headingPageTypography } from '#hami/content/typographies/heading-page-typography';
import { ifAdmin } from '#hami/controllers/if-admin';
import { PageBase } from '#hami/ui/helpers/page-base';

import i18n from '@gecut/i18n';
import { request } from '@gecut/signal';
import { M3 } from '@gecut/ui-kit';
import { join } from '@gecut/utilities/join';
import { nextAnimationFrame, nextIdleCallback } from '@gecut/utilities/polyfill';
import uniqueArray from '@gecut/utilities/unique-array';
import { html, nothing, unsafeCSS } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import styles from './orders.page.scss?inline';

import type { Projects, RenderResult } from '@gecut/types';
import type { PropertyValues } from 'lit';

declare global {
  interface HTMLElementTagNameMap {
    'page-orders': PageOrders;
  }
}

@customElement('page-orders')
export class PageOrders extends PageBase {
  static override styles = [unsafeCSS(styles), ...PageBase.styles];

  @state()
  private orders: Record<string, Projects.Hami.OrderModel> = {};

  @state()
  private suppliers: Record<string, Projects.Hami.Supplier> = {};

  @state()
  private isAdmin = false;

  private dateFilter?: Date;

  override connectedCallback(): void {
    super.connectedCallback();

    ifAdmin(() => {
      this.isAdmin = true;
    });

    request('fab', [newOrderFAB()]);

    this.addSignalListener('order-storage', (value) => {
      this.log.property?.('order-storage', value);

      this.orders = value.data;
    });
    this.addSignalListener('supplier-storage', (value) => {
      this.log.property?.('supplier-storage', value);

      this.suppliers = value.data;
    });
  }

  override render(): RenderResult {
    super.render();

    const headline = M3.Renderers.renderTypoGraphy(
      headingPageTypography(i18n.msg('orders')),
    );

    return html`
      ${headline}${this.renderDateFilterSelect()}${this.renderOrderList()}
    `;
  }

  static filterDateByOrder(timestamp: number, date: Date): boolean {
    const orderTime = new Date(timestamp);
    const orderTimeFilter = join(
      '-',
      orderTime.getFullYear().toString(),
      orderTime.getMonth().toString(),
      orderTime.getDate().toString(),
    );
    const timeFilter = join(
      '-',
      date.getFullYear().toString(),
      date.getMonth().toString(),
      date.getDate().toString(),
    );

    return orderTimeFilter === timeFilter;
  }

  protected firstUpdated(changedProperties: PropertyValues<this>): void {
    super.firstUpdated(changedProperties);

    request('order-storage', {}, 'cacheFirst');
    request('supplier-storage', {}, 'cacheFirst');
  }

  private renderOrderList() {
    if (Object.values(this.orders).length === 0) {
      return M3.Renderers.renderSurfaceCard(notFoundListCard());
    }

    const supplierList = Object.values(this.suppliers);

    return Object.values(this.orders)
      .filter(
        (order) =>
          order.active === true &&
          PageOrders.filterDateByOrder(
            order.registrationDate,
            this.dateFilter ?? new Date(this.dateList[0]),
          ),
      )
      .sort((a, b) => a.registrationDate - b.registrationDate)
      .sort((a, b) => statusPriority[a.status] - statusPriority[b.status])
      .reverse()
      .map(
        (order) =>
          html`${M3.Renderers.renderSurfaceCard(
            orderCard(order, this.isAdmin, supplierList),
          )}`,
      );
  }

  private renderDateFilterSelect() {
    if (Object.keys(this.orders).length === 0) return nothing;

    return M3.Renderers.renderSelect(
      dateSelect(
        this.dateFilter?.getTime() ?? this.dateList[0],
        {
          attributes: {
            label: i18n.msg('filter-date'),
            styles: {
              'margin-bottom': 'calc(2*var(--sys-spacing-track))',
            },
          },
          transformers: (target) => {
            target.addEventListener('change', () => {
              this.dateFilter = new Date(Number(target.value));

              nextIdleCallback(() => {
                nextAnimationFrame(() => {
                  this.requestUpdate('dateFilter');
                });
              });
            });

            return target;
          },
        },
        this.dateList.map((date) => new Date(date)),
      ),
    );
  }

  private get dateList() {
    return uniqueArray(
      Object.values(this.orders)
        .filter((order) => order.active === true)
        .map((order) => {
          const date = new Date(order.registrationDate);

          date.setHours(0, 0, 0, 0);

          return date.getTime();
        }),
    ).reverse();
  }
}

const statusPriority = {
  awaitingConfirmation: 10_000,
  accepted: 1_000,
  evacuated: 100,
  canceled: 10,
  failed: 1,
};
