import type { UserJsonEntity } from '#persianpart/entities/user';
import dataManager from '#persianpart/manager/data';
import { router } from '#persianpart/ui/router';

import i18n from '@gecut/i18n';
import { MaterialSymbols } from '@gecut/icons/material-symbols';
import { GecutApp } from '@gecut/lit-helper/pages/app';
import { getValue } from '@gecut/signal';
import { M3 } from '@gecut/ui-kit';
import debounce from '@gecut/utilities/debounce';
import { html, nothing, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { guard } from 'lit/directives/guard.js';
import { when } from 'lit/directives/when.js';

import styles from './app.element.css?inline';
import './navigation-bar';
import './top-app-bar';

import type { RenderResult } from '@gecut/types';
import type { PropertyValues } from 'lit';

declare global {
  interface HTMLElementTagNameMap {
    'app-root': AppRoot;
  }
}

@customElement('app-root')
export class AppRoot extends GecutApp {
  static override styles = [...GecutApp.styles, unsafeCSS(styles)];

  @property({ type: Boolean, reflect: true })
  fullscreenLoader = false;

  @property({ type: Boolean, reflect: true })
  fullscreen = false;

  @state()
  private user: Partial<UserJsonEntity> | null = null;

  private fullscreenLoaderChangeDebounced = debounce(
    () => this.fullscreenLoaderChange(),
    512,
  );

  override connectedCallback() {
    super.connectedCallback();

    dataManager.receivers.user.data().then((user) => (this.user = user));

    this.addSignalListener('fullscreenLoader', () => {
      this.fullscreenLoaderChangeDebounced();
    });
  }

  override render(): RenderResult {
    return html`
      ${guard([this.fullscreenLoader], () => this.fullscreenLoaderTemplate)}

      <persianpart-top-app-bar></persianpart-top-app-bar>

      ${when(this.fullscreen === false, () =>
        GecutApp.renderNavigationBottom(
          [
            {
              label: i18n.msg('settings'),
              icon: MaterialSymbols.FilledRounded.Settings,
              route: router.link('settings'),
              hidden: this.user?.permission !== 'root',
            },
            {
              label: i18n.msg('support'),
              icon: MaterialSymbols.Filled.Call,
              route: router.link('support'),
              hidden: this.user?.permission === 'root',
            },
            {
              label: i18n.msg('orders'),
              icon: MaterialSymbols.FilledRounded.Grading,
              route: router.link('orders-categories'),
              hidden: this.user?.permission !== 'root',
            },
            {
              label: i18n.msg('home'),
              icon: MaterialSymbols.FilledRounded.Home,
              route: router.link('products'),
            },
            {
              label: i18n.msg('users'),
              icon: MaterialSymbols.FilledRounded.Group,
              route: router.link('user-list'),
              hidden: this.user?.permission !== 'root',
            },
            {
              label: i18n.msg('profile'),
              icon: MaterialSymbols.FilledRounded.Person,
              route: router.link('user-profile'),
            },
          ],
          false,
          true,
        ),
      )}

      <main role="main">
        <dialog-outlet></dialog-outlet>
        <messenger-outlet></messenger-outlet>
        <fab-outlet></fab-outlet>
      </main>
    `;
  }

  protected firstUpdated(changedProperties: PropertyValues<this>): void {
    super.firstUpdated(changedProperties);

    router.outlet = this.renderRoot.querySelector('main');

    this.addSignalListener('fullscreen', (fullscreen) => {
      if (this.fullscreen !== fullscreen) {
        this.fullscreen = fullscreen;
      }
    });
  }

  private get fullscreenLoaderTemplate(): RenderResult {
    if (this.fullscreenLoader === false) return nothing;

    return html`
      <div class="fullscreen-loading">
        ${M3.Renderers.renderCircularProgress({
          component: 'circular-progress',
          type: 'circular-progress',
          attributes: {
            indeterminate: true,
            styles: { '--_size': '40px' },
            slot: 'trailing',
          },
        })}
      </div>
    `;
  }

  private fullscreenLoaderChange(): void {
    const fullscreenLoader = getValue('fullscreenLoader') ?? 0;
    const loader = fullscreenLoader > 0;

    if (this.fullscreenLoader !== loader) {
      this.fullscreenLoader = loader;
    }
  }
}
