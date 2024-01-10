import appStyles from '@gecut/common/styles/helpers/app.css?inline';
import { GecutNavigationBar } from '@gecut/components/navigation-bar/navigation-bar';
import '@gecut/components/navigation-tab/navigation-tab';
import { MaterialSymbols } from '@gecut/icons/material-symbols';
import { loggerElement } from '@gecut/mixins';
import { html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { guard } from 'lit/directives/guard.js';
import { registerSW } from 'virtual:pwa-register';

import { router } from '../router';

import type { GecutNavigationTabContent } from '@gecut/components/navigation-tab/navigation-tab';
import type { RenderResult } from '@gecut/types';
import type { PropertyValues } from 'lit';

declare global {
  interface HTMLElementTagNameMap {
    'app-root': AppRoot;
  }
}

@customElement('app-root')
export class AppRoot extends loggerElement {
  static override styles = [unsafeCSS(appStyles)];

  @property({ type: Boolean, reflect: true })
  navigationIsland = false;

  private sw = registerSW({
    immediate: true,
  });

  override render(): RenderResult {
    return html`
      ${AppRoot._renderNavigationBottom(
        [
          {
            icon: MaterialSymbols.FilledRounded.Home,
            label: 'خانه',
            route: router.link('sample', { slug: 'خانه' }),
            badge: '2',
          },
          {
            icon: MaterialSymbols.FilledRounded.DoneAll,
            label: 'پیام',
            route: router.link('sample', { slug: 'پیام' }),
            badge: '99+',
          },
          {
            icon: MaterialSymbols.FilledRounded.Person,
            label: 'شخصی',
            route: router.link('sample', { slug: 'شخصی' }),
            badge: true,
          },
          {
            icon: MaterialSymbols.FilledRounded.Settings,
            label: 'تنظیمات',
            route: router.link('settings'),
          },
        ],
        this.navigationIsland,
        true,
      )}

      <main role="main"></main>
    `;
  }

  static _renderNavigationBottom(
    tabs: GecutNavigationTabContent[],
    island = false,
    autoIsland = false,
  ) {
    return guard([island, autoIsland, ...tabs], () =>
      GecutNavigationBar.render(
        location.pathname + location.hash,
        tabs,
        island,
        autoIsland,
      ),
    );
  }

  protected firstUpdated(changedProperties: PropertyValues<this>): void {
    super.firstUpdated(changedProperties);

    router.outlet = this.renderRoot.querySelector('main');

    window.addEventListener('vaadin-router-location-changed', () => {
      this.requestUpdate();
    });

    this.sw();
  }
}
