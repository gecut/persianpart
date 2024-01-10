import { MaterialSymbols } from '@gecut/icons/material-symbols';
import { mapSearch } from '@gecut/lit-helper/utilities/map-search';
import debounce from '@gecut/utilities/debounce';
import '@material/web/icon/icon';
import '@material/web/progress/circular-progress';
import '@material/web/textfield/outlined-text-field';
import { css, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { asyncAppend } from 'lit/directives/async-append.js';
import { guard } from 'lit/directives/guard.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';

import { PageList } from './list';

import type { DataManager } from '@gecut/data-manager/index';
import type {
  ConditionalKeys,
  ObjectBooleanize,
  RenderResult,
  UnknownRecord,
} from '@gecut/types';
import type { MdOutlinedTextField } from '@material/web/textfield/outlined-text-field';

export abstract class PageSearchList<
  Name extends ConditionalKeys<GecutReceiverServices, Array<UnknownRecord>>,
  LocalDataManager extends DataManager,
  Data extends Array<UnknownRecord> = GecutReceiverServices[Name],
> extends PageList<Name, LocalDataManager, Data> {
  static override styles = [
    ...PageList.styles,
    css`
      .not-found-message {
        text-align: center;
      }
      md-checkbox {
        overflow: clip;
        overflow: hidden;
      }
      .search {
        --_container-color: var(--md-sys-color-surface-variant);
        --_outline-color: var(--md-sys-color-surface-variant);
        --_container-shape: var(--sys-radius-medium, 16px);

        border-radius: var(--_container-shape);
        background-color: var(--_container-color);
        margin-bottom: var(--sys-spacing-track);
      }
      .search md-circular-progress {
        --_size: 32px;
      }
    `,
  ];

  @property({ type: String, reflect: true })
  query = '';

  @property({ type: Boolean, reflect: true })
  searchBarLoading = false;

  @state()
  protected searchBarPlaceHolder = '';

  protected queryParameters: ObjectBooleanize<Data[number]> = {};

  private _changeSearchQuery = debounce(this.changeSearchQuery.bind(this), 512);

  override render(): RenderResult {
    super.render();

    return html`
      <md-outlined-text-field
        type="text"
        name="search"
        class="search"
        .placeholder=${this.searchBarPlaceHolder}
        hasTrailingIcon
        hasLeadingIcon
        @input=${() => {
          this.searchBarLoading = true;
          this._changeSearchQuery();
        }}
        ?hidden=${this.data.status !== 'success'}
      >
        <md-icon slot="leading-icon">
          ${unsafeSVG(MaterialSymbols.FilledRounded.Search)}
        </md-icon>
        <md-circular-progress
          indeterminate
          slot="trailing-icon"
          ?hidden=${!this.searchBarLoading}
        ></md-circular-progress>
      </md-outlined-text-field>

      ${guard([this.query, this.data.value], () => this.data.render(true))}
    `;
  }

  protected override renderData(data: Data) {
    super.renderData(data);

    return html`
      <surface-card type="filled" scroller>
        ${asyncAppend(
          mapSearch(
            this,
            data,
            this.query,
            this.queryParameters,
            this.renderItem.bind(this),
            () => html`<span class="not-found-message">موردی یافت نشد</span>`,
          ) as AsyncIterable<unknown>,
        )}
      </surface-card>
    `;
  }

  private changeSearchQuery() {
    const target =
      this.renderRoot.querySelector<MdOutlinedTextField>('.search');

    this.query = target?.value ?? '';
    this.searchBarLoading = false;
  }
}
