import config from '#persianpart/config';
import productHistoryCard from '#persianpart/content/cards/product-history.card';
import settingsCard from '#persianpart/content/cards/settings.card';
import requiredAdmin from '#persianpart/decorators/require-admin';
import type { ProductJsonEntity } from '#persianpart/entities/product';
import type { SettingJsonEntity } from '#persianpart/entities/setting';
import dataManager from '#persianpart/manager/data';
import placeholderImage from '#persianpart/ui/assets/persianpart.webp';
import type { PageBaseMeta } from '#persianpart/ui/helpers/page-base';
import { PageBase } from '#persianpart/ui/helpers/page-base';

import i18n from '@gecut/i18n';
import { request } from '@gecut/signal';
import arabicToPersian from '@gecut/utilities/arabic-to-persian';
import { html, nothing, unsafeCSS } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { guard } from 'lit/directives/guard.js';
import { map } from 'lit/directives/map.js';
import Papa from 'papaparse';

import style from './settings.page.css?inline';

import type { RenderResult } from '@gecut/types';
import type { MdFilledButton } from '@material/web/button/filled-button';

declare global {
  interface HTMLElementTagNameMap {
    'page-settings': PageSettings;
  }
}

@customElement('page-settings')
@requiredAdmin
export class PageSettings extends PageBase {
  static override styles = [...PageBase.styles, unsafeCSS(style)];

  @state()
  private productsData: ProductJsonEntity[] = [];

  @state()
  private data: Partial<SettingJsonEntity> = {};

  override connectedCallback(): void {
    super.connectedCallback();

    request('data.settings', {}).then((data) => (this.data = data));
  }

  override render(): RenderResult {
    super.render();

    return html`
      ${guard([this.data.status], () => settingsCard(this.data))}
      ${guard([this.data.productsHistory], () => productHistoryCard(this.data))}

      <surface-card class="data-input" type="filled">
        <h2>${i18n.msg('upload-csv-data')}</h2>

        <md-divider></md-divider>

        <input type="file" @change=${this.fileChanged} />

        <md-divider></md-divider>

        <md-filled-button
          ?disabled=${this.productsData.length === 0}
          @click=${this.buttonClickEvent}
        >
          ${i18n.msg('upload-csv-data')}
        </md-filled-button>
      </surface-card>

      ${guard([this.productsData], () => this.productItemList)}
    `;
  }

  meta(): Partial<PageBaseMeta> {
    super.meta();

    return {
      fab: [],
      fullscreen: false,
      headline: i18n.msg('settings'),
    };
  }

  private fileChanged(event: InputEvent): void {
    const target = event.target as HTMLInputElement;
    const fileReader = new FileReader();

    if (target.files == null) return;

    fileReader.addEventListener('load', () => {
      const data = Papa.parse<ProductJsonEntity>(
        `unit;price;quantity;name;nickId\n` + String(fileReader.result),
        {
          dynamicTyping: true,
          header: true,
          skipEmptyLines: true,
        },
      ).data;

      this.productsData = data
        .map(
          (item): ProductJsonEntity => ({
            nickId: item.nickId,
            name: arabicToPersian(item.name),
            price: item.price,
            quantity: item.quantity,
            unit: item.unit,
          }),
        )
        .filter((item) => item.quantity >= config.limitProductQuantity)
        .sort((a, b) => a.name.localeCompare(b.name));
    });

    fileReader.readAsText(target.files[0]);
  }

  private get productItemList(): RenderResult {
    if (this.productsData.length === 0) return nothing;

    return html`
      <surface-card class="data-show" type="filled" scroller>
        ${map(this.productsData, (product) => {
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
                <div slot="start">${image}</div>

                <span slot="headline">${product.name}</span>
                <span slot="supporting-text">${price}</span>
                <span slot="supporting-text">${quantity}</span>
              </md-list-item>
              <md-divider></md-divider>
            </label>
          `;
        })}
      </surface-card>
    `;
  }

  private buttonClickEvent(event: PointerEvent): void {
    const target = event.target as MdFilledButton;

    target.disabled = true;
    dataManager.senders.newProducts.send(this.productsData).finally(() => {
      target.disabled = false;
    });
  }
}
