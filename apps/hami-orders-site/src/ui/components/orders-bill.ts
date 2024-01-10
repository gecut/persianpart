import hamiLogo from '#hami/ui/assets/hami-logo.webp?inline';
import invoicesStyles from '#hami/ui/stylesheets/invoices.scss?inline';
import tableStyles from '#hami/ui/stylesheets/table.scss?inline';

import i18n from '@gecut/i18n';
import { LitElement, html, nothing, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';

import config from '../../config';

import type { Projects } from '@gecut/types';

declare global {
  interface HTMLElementTagNameMap {
    'orders-bill': OrdersBill;
  }
}

@customElement('orders-bill')
export class OrdersBill extends LitElement {
  static styles = [unsafeCSS(tableStyles), unsafeCSS(invoicesStyles)];

  @property({ type: Array, attribute: false })
  orders?: Projects.Hami.OrderModel[];

  @property({ type: String, attribute: false })
  type?: 'customer' | 'supplier';

  override render() {
    if (this.orders == null || this.type == null) return nothing;

    const ordersDates = this.orders.map((order) => order.meta.created) ?? [];

    const fromDate = Math.min(...ordersDates);
    const toDate = Math.max(...ordersDates);

    return html`
      <header>
        <div class="logo">
          <img src=${hamiLogo} />
        </div>
        <div class="title">
          <h1>صورت حساب کالا و خدمات</h1>
          <h2>کلینیک ساختمانی حامی</h2>
        </div>
        <div class="order-info">
          <div class="order-id-box">
            <span>از: </span>
            <span>${i18n.date(fromDate)}</span>
          </div>
          <div class="order-date-box">
            <span>تا: </span>
            <span>${i18n.date(toDate)}</span>
          </div>
        </div>
      </header>
      ${OrdersBill.renderInfoBox(this.orders ?? [], this.type)}
      <section>
        <h1 class="title-box">اطلاعات صورت حساب</h1>

        <table>
          <thead>
            <tr>
              <th>ردیف</th>
              <th>تاریخ</th>
              <th>محصولات</th>
              <th>بدهكار</th>
              <th>بستانکار</th>
              <th>مانده</th>
            </tr>
          </thead>
          <tbody>
            ${OrdersBill.renderRows(this.orders ?? [], this.type)}
            ${OrdersBill.renderFooterRow(this.orders ?? [], this.type)}
          </tbody>
        </table>
      </section>
    `;
  }

  static productDescription(
    name: string,
    qty: number,
    unit: string,
    fiPrice: number,
  ): string {
    qty = Math.abs(qty);
    fiPrice = Math.abs(fiPrice);

    return `${name} به مقدار ${i18n.int(qty)} ${unit} با نرخ ${i18n.int(
      fiPrice,
    )} مساوی با ${i18n.int(qty * fiPrice)}`;
  }

  static renderRows(
    orders: Projects.Hami.OrderModel[],
    type: 'customer' | 'supplier',
  ) {
    let balance = 0;

    return orders.map((order, index) => {
      const priceList = order.productList.map(
        (orderProduct) =>
          orderProduct.quantity * OrdersBill.price(orderProduct, type),
      );
      const debtorList = priceList.filter((num) => num > 0);
      const creditorList = priceList.filter((num) => num < 0);

      const totalDebtor = debtorList.reduce((p, c) => p + c, 0);
      const totalCreditor = creditorList.reduce((p, c) => p + c, 0);
      const totalPrice = priceList.reduce((p, c) => p + c, 0);

      balance += totalPrice;

      return html`
        <tr>
          <td>${i18n.int(index + 1, { useGrouping: false })}</td>
          <td>${i18n.date(order.meta.created)}</td>
          <td>
            ${order.productList.map(
              (orderProduct) => html`
                <p>
                  ${OrdersBill.productDescription(
                    orderProduct.product.name,
                    orderProduct.quantity,
                    orderProduct.unit,
                    OrdersBill.price(orderProduct, type),
                  )}
                </p>
              `,
            )}
          </td>
          ${when(
            type === 'customer',
            () => html`
              <td>${OrdersBill.decimal(Math.max(totalDebtor, 0))}</td>
              <td>
                ${OrdersBill.decimal(Math.abs(Math.min(totalCreditor, 0)))}
              </td>
            `,
            () => html`
              <td>
                ${OrdersBill.decimal(Math.abs(Math.min(totalCreditor, 0)))}
              </td>
              <td>${OrdersBill.decimal(Math.max(totalDebtor, 0))}</td>
            `,
          )}
          <td>${OrdersBill.decimal(balance)}</td>
        </tr>
      `;
    });
  }

  static renderFooterRow(
    orders: Projects.Hami.OrderModel[],
    type: 'customer' | 'supplier',
  ) {
    const totalBalance = orders
      .map((order) =>
        order.productList.map(
          (orderProduct) =>
            orderProduct.quantity * OrdersBill.price(orderProduct, type),
        ),
      )
      .flat()
      .reduce((p, c) => p + c, 0);

    const totalDebtor = orders
      .map((order) =>
        order.productList
          .map(
            (orderProduct) =>
              orderProduct.quantity * OrdersBill.price(orderProduct, type),
          )
          .filter((num) => num > 0),
      )
      .flat()
      .reduce((p, c) => p + c, 0);

    const totalCreditor = orders
      .map((order) =>
        order.productList
          .map(
            (orderProduct) =>
              orderProduct.quantity * OrdersBill.price(orderProduct, type),
          )
          .filter((num) => num < 0),
      )
      .flat()
      .reduce((p, c) => p + c, 0);

    return html`
      <tr>
        <td colspan="3" style="text-align:end;">مجموع:</td>
        ${when(
          type === 'customer',
          () => html`
            <td>${OrdersBill.decimal(totalDebtor)}</td>
            <td>${OrdersBill.decimal(Math.abs(totalCreditor))}</td>
          `,
          () => html`
            <td>${OrdersBill.decimal(Math.abs(totalCreditor))}</td>
            <td>${OrdersBill.decimal(totalDebtor)}</td>
          `,
        )}
        <td>${OrdersBill.decimal(totalBalance)}</td>
      </tr>
    `;
  }

  static renderInfoBox(
    orders: Projects.Hami.OrderModel[],
    type: 'customer' | 'supplier',
  ) {
    const order = orders[0];

    if (type === 'customer') {
      return html`
        <section>
          <h1 class="title-box">مشخصات خریدار</h1>

          <p>
            عنوان: ${order?.customer?.firstName}
            ${order?.customer?.lastName}
          </p>
          <p>شماره تماس: ${order?.customer?.phoneNumber}</p>
          <p>مکان پروژه: ${order?.customerProject?.projectAddress}</p>
        </section>
      `;
    }

    return html`
      <section>
        <h1 class="title-box">مشخصات تامین کننده</h1>

        <p>
          عنوان: ${order?.supplier?.firstName}
          ${order?.supplier?.lastName}
        </p>
        <p>شماره تماس: ${order?.supplier?.phoneNumber}</p>
      </section>
    `;
  }

  static decimal(_number?: number) {
    if (!_number) return '-';

    return i18n.int(_number) + ' ' + config.financialUnit;
  }

  static price(
    orderProduct: Projects.Hami.OrderProductModel,
    type: 'customer' | 'supplier',
  ) {
    return type === 'customer' ?
      orderProduct.salesPrice :
      orderProduct.purchasePrice;
  }
}
