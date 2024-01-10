import '@material/web/icon/icon';
import { html, nothing, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { when } from 'lit/directives/when.js';

import { GecutComponent } from '../_base';

import styles from './navigation-tab.css?inline';

import type { RenderResult } from '@gecut/types';

declare global {
  interface HTMLElementTagNameMap {
    'g-navigation-tab': GecutNavigationTab;
  }
}

export type GecutNavigationTabContent = {
  route: string;
  icon: string;
  label: string;
  badge?: true | string;
  hidden?: boolean;
};

@customElement('g-navigation-tab')
export class GecutNavigationTab extends GecutComponent {
  static override styles = [...GecutComponent.styles, unsafeCSS(styles)];

  @property({ type: Object, attribute: false })
  content?: GecutNavigationTabContent;

  @property({ type: Boolean, reflect: true })
  active = false;

  override render() {
    super.render();

    if (this.content == null) return nothing;

    return html`
      <a href=${this.content.route}>
        ${when(
          this.content.badge != null,
          () => html`
            <span class="badge">
              ${typeof this.content?.badge === 'string'
                ? this.content?.badge
                : nothing}
            </span>
          `,
        )}

        <div class="icon">
          <md-icon>${unsafeSVG(this.content.icon)}</md-icon>
        </div>
        <span class="text">${this.content.label}</span>
      </a>
    `;
  }

  static override render(
    content: GecutNavigationTabContent,
    active = false,
  ): RenderResult {
    super.render();

    return html`<g-navigation-tab
      .content=${content}
      ?hidden=${content.hidden}
      ?active=${active}
    ></g-navigation-tab>`;
  }
}
