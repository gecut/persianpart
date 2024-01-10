import { attachRouter } from '#hami/ui/router';

import i18n from '@gecut/i18n';
import { signalElement } from '@gecut/mixins';
import { request } from '@gecut/signal';
import '@material/web/icon/icon';
import '@material/web/labs/navigationbar/navigation-bar';
import '@material/web/labs/navigationtab/navigation-tab';
import { html, unsafeCSS } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { registerSW } from 'virtual:pwa-register';

import styles from './app.element.scss?inline';
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
export class AppRoot extends signalElement {
  static override styles = [unsafeCSS(styles)];

  @state()
  private loading = true;

  override connectedCallback(): void {
    super.connectedCallback();

    registerSW({
      onOfflineReady() {
        request('messenger', {
          type: 'wrap-message',
          attributes: {
            message: i18n.msg(
              'web-application-is-now-installed-and-ready-to-work-in-offline-mode-but-the-application-requires-the-internet-to-synchronize-data-with-the-server',
            ),
            align: 'bottom',
            closeButton: true,
          },
        });
      },
      onNeedRefresh() {
        request('messenger', {
          type: 'wrap-message',
          attributes: {
            message: i18n.msg('congratulations-the-web-app-is-ready-to-update'),
            align: 'bottom',
            closeButton: true,
          },
          children: [
            {
              component: 'button',
              type: 'text',
              attributes: { slot: 'action' },
              children: [i18n.msg('update')],
            },
          ],
        });
      },
    });

    this.addSignalListener('promises-list', (value) => {
      if (value.length > 0 && this.loading !== true) {
        this.loading = true;
      } else {
        this.loading = false;
      }
    });
  }

  override render(): RenderResult {
    return html`
      <hami-top-app-bar></hami-top-app-bar>

      <main role="main">
        <dialog-outlet></dialog-outlet>
        <messenger-outlet></messenger-outlet>
        <fab-outlet .animation=${false}></fab-outlet>
      </main>

      <hami-navigation-bar></hami-navigation-bar>
    `;
  }

  override firstUpdated(changedProperties: PropertyValues<this>): void {
    super.firstUpdated(changedProperties);

    const mainContainer = this.renderRoot.querySelector('main');

    if (mainContainer != null) {
      attachRouter(mainContainer);
    }
  }
}
