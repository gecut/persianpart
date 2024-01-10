import { suppliersListCard } from '#hami/content/cards/suppliers-list-card';
import { newSupplierFAB } from '#hami/content/fabs/new-supplier-fab';
import { headingPageTypography } from '#hami/content/typographies/heading-page-typography';
import { ifAdmin } from '#hami/controllers/if-admin';
import { PageBase } from '#hami/ui/helpers/page-base';
import icons from '#hami/ui/icons';
import { routerGo } from '#hami/ui/router';

import i18n from '@gecut/i18n';
import { request } from '@gecut/signal';
import { M3 } from '@gecut/ui-kit';
import { html, unsafeCSS } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import styles from './suppliers.page.scss?inline';

import type { Projects, RenderResult } from '@gecut/types';
import type { PropertyValues } from 'lit';

declare global {
  interface HTMLElementTagNameMap {
    'page-suppliers': PageSuppliers;
  }
}

@customElement('page-suppliers')
export class PageSuppliers extends PageBase {
  static override styles = [unsafeCSS(styles), ...PageBase.styles];

  @state()
  private suppliers: Record<string, Projects.Hami.SupplierModel> = {};

  @state()
  private query = '';

  private suppliersSearchBoxComponent = M3.Renderers.renderTextField({
    component: 'text-field',
    type: 'outlined',

    attributes: {
      inputType: 'search',
      name: 'suppliersSearch',
      placeholder: i18n.msg('search'),
      hasLeadingIcon: true,
      styles: { width: '100%' },
    },
    children: [
      {
        component: 'icon',
        type: 'svg',
        SVG: icons.filledRounded.search,
        attributes: { slot: 'leadingicon' },
      },
    ],
    transformers: (target) => {
      target.addEventListener('input', () => {
        this.query = target.value;
      });

      return target;
    },
  });

  override connectedCallback(): void {
    super.connectedCallback();

    ifAdmin(
      () => {
        request('fab', [newSupplierFAB()]);
      },
      () => routerGo('/'),
    );

    this.addSignalListener('supplier-storage', (value) => {
      this.log.property?.('supplier-storage', value);

      this.suppliers = value.data;
    });
  }

  override render(): RenderResult {
    super.render();

    return html`${this.renderSuppliersCard()}`;
  }

  protected firstUpdated(changedProperties: PropertyValues<this>): void {
    super.firstUpdated(changedProperties);

    request('supplier-storage', {}, 'cacheFirst');
  }

  private renderSuppliersCard(): RenderResult {
    const titleTemplate = M3.Renderers.renderTypoGraphy(
      headingPageTypography(i18n.msg('suppliers')),
    );

    return html`
      <div class="card-box">
        ${titleTemplate}

        <div class="search-box">${this.suppliersSearchBoxComponent}</div>

        ${suppliersListCard(Object.values(this.suppliers), this.query)}
      </div>
    `;
  }
}
