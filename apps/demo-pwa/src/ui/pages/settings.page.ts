import pageStyles from '@gecut/common/styles/helpers/page.css?inline';
import { MaterialSymbols } from '@gecut/icons/material-symbols';
import { loggerElement } from '@gecut/mixins';
import '@gecut/ui-kit/m3';
import '@material/web/chips/filter-chip';
import '@material/web/icon/icon';
import '@material/web/list/list';
import '@material/web/list/list-item';
import '@material/web/radio/radio';
import { css, html, unsafeCSS } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';

import type{ MdListItem } from '@material/web/list/list-item';
import type { MdRadio } from '@material/web/radio/radio';

declare global {
  interface HTMLElementTagNameMap {
    'page-settings': PageSettings;
  }
}

@customElement('page-settings')
export class PageSettings extends loggerElement {
  static override styles = [
    unsafeCSS(pageStyles),
    css`
      surface-card {
        padding: 16px;
      }

      surface-card > * {
        width: min-content;
      }

      surface-card form {
        display: flex;
        flex-direction: column;
        width: 100%;
      }
      surface-card form label {
        display: flex;
        width: 100%;
      }
      surface-card form label md-list-item {
        width: 100%;
      }
      surface-card form md-list-item md-icon {
        margin-inline-start: 16px;
      }
    `,
  ];

  @state()
  private themes = {
    _: 'عادی',
    'light.gecut': 'جیکات',
    'light.deep-sky-blue': 'آبی آسمانی',
    'light.brown': 'قهوه ای',
    'light.purple': 'بنفش',

    'dark.gecut': 'جیکات',
  };

  override render() {
    return html`
      <surface-card type="filled">
        <md-filter-chip
          @click=${PageSettings.toggleIsland}
          elevated
          ?selected=${document.querySelector('app-root').navigationIsland}
          label="منو جزیره ای"
        ></md-filter-chip>
      </surface-card>

      <surface-card type="filled">
        <form @change=${PageSettings.themeChanged}>
          ${map(Object.keys(this.themes), (key) => {
            const checked =
              document.documentElement.getAttribute('theme') === key;

            const icon = key.includes('light')
              ? MaterialSymbols.Outline.LightMode
              : key.includes('dark')
              ? MaterialSymbols.OutlineRounded.DarkMode
              : '';

            return html`
              <md-list-item
                headline=${this.themes[key]}
                @click=${PageSettings.themeItemClicked}
              >
                <md-icon slot="start">${unsafeSVG(icon)}</md-icon>

                <md-radio
                  slot="end"
                  name="theme"
                  value=${key}
                  ?checked=${checked}
                  @click=${PageSettings.themeChanged}
                ></md-radio>
              </md-list-item>
            `;
          })}
        </form>
      </surface-card>
    `;
  }

  static toggleIsland() {
    const appRoot = document.querySelector('app-root');

    if (appRoot != null) {
      appRoot.navigationIsland = !appRoot.navigationIsland;
    }
  }

  static themeChanged(event: Event) {
    const target = event.target as MdRadio;

    document.documentElement.setAttribute('theme', target.value);
  }

  static themeItemClicked(event: Event) {
    const target = event.target as MdListItem;

    target.querySelector('md-radio')?.click();
  }
}
