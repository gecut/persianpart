import {
  cancelNextIdleCallback,
  nextIdleCallback,
} from '@gecut/utilities/polyfill';
import { html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';

import { GecutComponent } from '../_base';
import {
  GecutNavigationTab,
  type GecutNavigationTabContent,
} from '../navigation-tab/navigation-tab';

import styles from './navigation-bar.css?inline';

import type { RenderResult } from '@gecut/types';

declare global {
  interface HTMLElementTagNameMap {
    'g-navigation-bar': GecutNavigationBar;
  }
}

@customElement('g-navigation-bar')
export class GecutNavigationBar extends GecutComponent {
  static override styles = [...GecutComponent.styles, unsafeCSS(styles)];

  @property({ type: Boolean, reflect: true })
  island = false;

  @property({ type: Boolean, reflect: true, attribute: 'auto-island' })
  autoIsland = false;

  private scheduleUpdateDebounce?: number;

  override render() {
    super.render();

    return html`
      <div class="nav-container">
        <slot></slot>
      </div>
    `;
  }

  static override render(
    currentPath: string,
    tabs: GecutNavigationTabContent[],
    island = false,
    autoIsland = false,
  ): RenderResult {
    super.render();

    return html`<g-navigation-bar ?island=${island} ?auto-island=${autoIsland}>
      ${map(tabs, (tab) =>
        GecutNavigationTab.render(tab, tab.route === currentPath),
      )}
    </g-navigation-bar>`;
  }

  protected override async scheduleUpdate() {
    if (this.scheduleUpdateDebounce != null) {
      cancelNextIdleCallback(this.scheduleUpdateDebounce);
    }

    await new Promise<void>((resolve) => {
      this.scheduleUpdateDebounce = nextIdleCallback(() => resolve());
    });

    super.scheduleUpdate();
  }
}
