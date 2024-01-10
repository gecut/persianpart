import { bottomNavigation } from '#persianpart/content/navigations/bottom.navigation';
import type { UserJsonEntity } from '#persianpart/entities/user';
import { router } from '#persianpart/ui/router';

import { M3 } from '@gecut/ui-kit';
import isEqual from '@gecut/utilities/is-equal';
import { css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { guard } from 'lit/directives/guard.js';
import { repeat } from 'lit/directives/repeat.js';

import { ComponentBase } from '../helpers/component-base';

import type { RenderResult } from '@gecut/types';
import type { RouterLocation } from '@vaadin/router';

declare global {
  interface HTMLElementTagNameMap {
    'persianpart-navigation-bar': NavigationBar;
  }
}

@customElement('persianpart-navigation-bar')
export class NavigationBar extends ComponentBase {
  static override styles = [
    ...ComponentBase.styles,
    css`
      :host {
        overflow: clip;
        overflow: hidden;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
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

  @state()
  private _user: Partial<UserJsonEntity> = {};

  @state()
  private location: RouterLocation = router.location;

  override connectedCallback() {
    super.connectedCallback();

    this.addSignalListener('fullscreen', (fullscreen) => {
      if (this.hidden !== fullscreen) {
        this.hidden = fullscreen;
      }
    });

    // eslint-disable-next-line wc/require-listener-teardown
    window.addEventListener('vaadin-router-location-changed', () => {
      this.location = router.location;
    });

    this.addSignalListener('data.user', (user) => {
      if (!isEqual(user, this._user)) {
        this._user = user;
      }
    });
  }

  override render(): RenderResult {
    return html`
      <md-navigation-bar>
        ${repeat(
          bottomNavigation({
            orders: this._user.permission === 'root',
            users: this._user.permission === 'root',
            settings: this._user.permission === 'root',
            support: this._user.permission !== 'root',
          }),
          (tab) => tab.attributes?.id ?? '',
          (tab) => {
            const windowSlug = this.location.pathname.split('/')[1];
            const tabHref = router.link(String(tab.attributes?.href));
            const tabSlug = tabHref.split('/')[1];
            const selected = tabSlug === windowSlug;

            tab.attributes ??= {};
            tab.attributes.active = selected;

            return guard(
              [selected, tab.attributes?.hidden ?? false, tab.attributes?.id],
              () => html`
                <a
                  .href=${tabHref}
                  class="navigation-tab"
                  ?hidden=${tab.attributes?.hidden ?? false}
                >
                  ${M3.Renderers.renderNavigationTab(tab)}
                </a>
              `,
            );
          },
        )}
      </md-navigation-bar>
    `;
  }
}
