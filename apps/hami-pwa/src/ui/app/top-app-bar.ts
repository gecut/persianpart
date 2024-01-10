import config from '#hami/config';
import messagesDialogs from '#hami/content/dialogs/messages.dialogs';
import { isAdmin } from '#hami/controllers/is-admin';
import hamiLogo from '#hami/ui/assets/hami-logo.webp?inline';
import { routerGo, urlForName } from '#hami/ui/router';

import i18n from '@gecut/i18n';
import { scheduleSignalElement } from '@gecut/mixins';
import { expire } from '@gecut/signal';
import { M3 } from '@gecut/ui-kit';
import { sanitizer } from '@gecut/utilities/sanitizer';
import { css, html } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import { cache } from 'lit/directives/cache.js';
import { guard } from 'lit/directives/guard.js';
import { when } from 'lit/directives/when.js';

import icons from '../icons';

import type { RenderResult } from '@gecut/types';
import type { PropertyValues } from 'lit';

declare global {
  interface HTMLElementTagNameMap {
    'hami-top-app-bar': HTopAppBar;
  }
}

@customElement('hami-top-app-bar')
export class HTopAppBar extends scheduleSignalElement {
  static override styles = [
    css`
      :host {
        z-index: 1;
      }

      .navigation-tab {
        flex: 1 1 auto;
        text-decoration: none;
      }

      md-navigation-tab {
        height: 100%;
      }

      *[hidden] {
        display: none;
      }
    `,
  ];

  static reloadIconButton = M3.Renderers.renderIconButton({
    component: 'icon-button',
    type: 'icon-button',
    attributes: { ariaLabel: 'Reload', slot: 'leading' },
    iconSVG: icons.outlineRounded.home,
    events: {
      click: () => window.location.reload(),
    },
  });

  static signOutIconButton = M3.Renderers.renderIconButton({
    component: 'icon-button',
    type: 'icon-button',
    attributes: { ariaLabel: 'Log Out', slot: 'leading' },
    iconSVG: icons.filledRounded.logout,

    transformers: (target) => {
      target.addEventListener('click', () => {
        messagesDialogs.untilSignOutConfirmation().then(async () => {
          const admin = await isAdmin();

          localStorage.removeItem('USER_ID');
          localStorage.removeItem('USER_TOKEN');

          for (const cacheName of config.userCacheList) {
            expire(cacheName);
          }

          if (admin === true) {
            for (const cacheName of config.adminUserCacheList) {
              expire(cacheName);
            }
          }

          routerGo(urlForName('Landing'));
        });
      });

      return target;
    },
  });

  static loading = M3.Renderers.renderCircularProgress({
    attributes: {
      indeterminate: true,
      styles: { '--_size': '40px' },
    },
  });

  static hamiLogo = M3.Renderers.renderDivision({
    attributes: {
      styles: {
        'display': 'flex',
        'align-content': 'center',
        'justify-content': 'center',
        'width': '40px',
        'height': '40px',
      },
    },
    children: [
      {
        component: 'img',
        type: 'img',
        attributes: {
          src: hamiLogo,
          alt: 'hami-logo',
          styles: {
            height: '24px',
            margin: 'auto',
          },
        },
      },
    ],
  });

  static headline = i18n.date(new Date().getTime());

  @state()
  private loading = false;

  @state()
  private scrolling = false;

  @query('top-app-bar')
  private topAppBarElement!: M3.Components.TopAppBar;

  override connectedCallback() {
    super.connectedCallback();

    this.addSignalListener('top-app-bar-hidden', (hidden) => {
      if (this.hidden !== hidden) {
        this.hidden = hidden;
      }
    });
    this.addSignalListener('top-app-bar-mode', (mode) => {
      if (this.scrolling !== (mode === 'on-scroll')) {
        this.scrolling = mode === 'on-scroll';
      }
    });
    this.addSignalListener('promises-list', (loadNumbers) => {
      const loading = loadNumbers.length > 0;

      if (this.loading !== loading) {
        this.loading = loading;
      }
    });
  }

  override render(): RenderResult {
    const mode = this.scrolling === true ? 'on-scroll' : 'flat';

    return html`
      ${cache(html`
        <top-app-bar
          type="center"
          .headline=${sanitizer.str(HTopAppBar.headline)}
          .mode=${mode}
        >
          ${HTopAppBar.signOutIconButton} ${HTopAppBar.reloadIconButton}

          <a href=${urlForName('Users')} slot="trailing">
            ${guard([this.loading], () =>
              when(
                this.loading == true,
                () => html`${HTopAppBar.loading}`,
                () => html`${HTopAppBar.hamiLogo}`,
              ),
            )}
          </a>
        </top-app-bar>
      `)}
    `;
  }

  protected shouldUpdate(_changedProperties: PropertyValues<unknown>): boolean {
    if (_changedProperties.has('headline')) {
      this.topAppBarElement.headline = String(HTopAppBar.headline);

      return false;
    }
    if (_changedProperties.has('mode')) {
      this.topAppBarElement.mode =
        String(_changedProperties.get('mode')) === 'on-scroll' ?
          'on-scroll' :
          'flat';

      return false;
    }

    return super.shouldUpdate(_changedProperties);
  }
}
