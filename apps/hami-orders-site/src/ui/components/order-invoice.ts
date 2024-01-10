import hamiLogo from '#hami/ui/assets/hami-logo.webp?inline';
import invoicesStyles from '#hami/ui/stylesheets/invoices.scss?inline';
import tableStyles from '#hami/ui/stylesheets/table.scss?inline';

import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import type { Projects } from '@gecut/types';

declare global {
  interface HTMLElementTagNameMap {
    'order-invoice': OrderInvoice;
  }
}

const eh = <T>(t: () => T): T | string => {
  try {
    return t();
  } catch (error) {
    console.log(error);

    return 'خطا در نمایش';
  }
};

@customElement('order-invoice')
export class OrderInvoice extends LitElement {
  static styles = [unsafeCSS(tableStyles), unsafeCSS(invoicesStyles)];

  @property({ type: Object, attribute: false })
  order?: Projects.Hami.OrderModel;

  @property({ type: String, reflect: true })
  invoice: 'customer' | 'supplier' = 'customer';

  override render() {
    return html`
      <header>
        <div class="logo">
          <img src=${hamiLogo} />
        </div>
        <div class="title">
          <h1>فاکتور فروش کالا و خدمات</h1>
          <h2>کلینیک ساختمانی حامی</h2>
        </div>
        <div class="order-info">
          <div class="order-id-box">
            <span>شماره: </span>
            <span>
              ${eh(() =>
                Number(this.order.id).toLocaleString('fa-IR', {
                  useGrouping: false,
                }),
              )}
            </span>
          </div>
          <div class="order-date-box">
            <span>تاریخ: </span>
            <span>
              ${eh(() =>
                new Date(this.order.registrationDate).toLocaleDateString('fa'),
              )}
            </span>
          </div>
        </div>
      </header>
      ${this.renderInfoBox()}
      <section>
        <h1 class="title-box">اطلاعات فاکتور</h1>

        <table class="tg">
          <thead>
            <tr>
              <th>ردیف</th>
              <th>عنوان کالا/خدمات</th>
              <th>مقدار</th>
              <th>واحد</th>
              <th>نرخ</th>
              <th>مبلغ</th>
              <th>تخفیف</th>
              <th>جمع کل</th>
            </tr>
          </thead>
          <tbody>
            ${this.renderRows()}

            <tr>
              <td colspan="2">
                تعداد: ${this.order.productList.length.toLocaleString('fa')}
              </td>
              <td>
                ${eh(() =>
                  this.order.productList
                    .map((product) => product.quantity)
                    .reduce((p, c) => p + c, 0)
                    .toLocaleString('fa'),
                )}
              </td>
              <td></td>
              <td>
                ${eh(() =>
                  this.order.productList
                    .map(
                      (product) =>
                        (this.invoice !== 'customer' ?
                          product.purchasePrice :
                          product.salesPrice) * product.quantity,
                    )
                    .reduce((p, c) => p + c, 0)
                    .toLocaleString('fa'),
                )}
              </td>
              <td></td>
              <td></td>
              <td>
                ${eh(() =>
                  this.order.productList
                    .map(
                      (product) =>
                        (this.invoice !== 'customer' ?
                          product.purchasePrice :
                          product.salesPrice) *
                        product.quantity *
                        (1 - product.discount / 100),
                    )
                    .reduce((p, c) => p + c, 0)
                    .toLocaleString('fa'),
                )}
              </td>
            </tr>
            <tr>
              <td colspan="9">توضیحات: ${this.order.description}</td>
            </tr>
            <tr>
              <td colspan="6" rowspan="2"></td>
              <td>مبلغ کل فاکتور</td>
              <td>
                ${eh(() =>
                  this.order.productList
                    .map(
                      (product) =>
                        (this.invoice !== 'customer' ?
                          product.purchasePrice :
                          product.salesPrice) * product.quantity,
                    )
                    .reduce((p, c) => p + c, 0)
                    .toLocaleString('fa'),
                )}
              </td>
            </tr>
            <tr>
              <td>تخفیف</td>
              <td>()</td>
            </tr>
            <tr>
              <td colspan="6"></td>
              <td>قابل پرداخت</td>
              <td>
                ${eh(() =>
                  this.order.productList
                    .map(
                      (product) =>
                        (this.invoice !== 'customer' ?
                          product.purchasePrice :
                          product.salesPrice) *
                        product.quantity *
                        (1 - product.discount / 100),
                    )
                    .reduce((p, c) => p + c, 0)
                    .toLocaleString('fa'),
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    `;
  }

  private renderInfoBox() {
    if (this.invoice === 'supplier') {
      return html`
        <section>
          <h1 class="title-box">مشخصات فروشنده</h1>

          <p>
            عنوان: ${this.order?.supplier?.firstName}
            ${this.order?.supplier?.lastName}
          </p>
          <p>شماره تماس: ${this.order?.supplier?.phoneNumber}</p>
        </section>
        <section>
          <h1 class="title-box">مشخصات خریدار</h1>

          <p>عنوان: کلینیک ساختمانی حامی</p>
        </section>
      `;
    }

    return html`
      <section>
        <h1 class="title-box">مشخصات فروشنده</h1>

        <p>عنوان: کلینیک ساختمانی حامی</p>
      </section>
      <section>
        <h1 class="title-box">مشخصات خریدار</h1>

        <p>
          عنوان: ${this.order?.customer?.firstName}
          ${this.order?.customer?.lastName}
        </p>
        <p>شماره تماس: ${this.order?.customer?.phoneNumber}</p>
        <p>آدرس پروژه: ${this.order?.customerProject?.projectAddress}</p>
        <p>
          شماره تماس سرپرست: ${this.order?.customerProject?.supervisorPhone}
        </p>
      </section>
    `;
  }

  private renderRows() {
    return this.order.productList.map((product, index) => {
      const productPrice =
        this.invoice !== 'customer' ?
          product.purchasePrice :
          product.salesPrice;

      const totalPrice =
        productPrice * product.quantity * (1 - product.discount / 100);

      return html`
        <tr>
          <td>
            ${eh(
              () => (index + 1)?.toLocaleString('fa', { useGrouping: false }),
            )}
          </td>
          <td>${product.product.name}</td>
          <td>${eh(() => product.quantity?.toLocaleString('fa'))}</td>
          <td>${product.unit}</td>
          <td>${eh(() => productPrice?.toLocaleString('fa'))}</td>
          <td>
            ${eh(() => (productPrice * product.quantity)?.toLocaleString('fa'))}
          </td>
          <td>${eh(() => product.discount?.toLocaleString('fa'))}</td>
          <td>${eh(() => totalPrice?.toLocaleString('fa'))}</td>
        </tr>
      `;
    });
  }
}
