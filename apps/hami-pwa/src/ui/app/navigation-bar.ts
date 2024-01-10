import { urlForName } from '#hami/ui/router';

import i18n from '@gecut/i18n';
import { map } from '@gecut/lit-helper/utilities/map';
import { scheduleSignalElement } from '@gecut/mixins';
import { request } from '@gecut/signal';
import { css, html, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';

import icons from '../icons';

import type { Projects, RenderResult } from '@gecut/types';

declare global {
  interface HTMLElementTagNameMap {
    'hami-navigation-bar': HNavigationBar;
  }
}

type navigationBarConfigType = Array<{
  label: string;
  href: string;
  activeIcon: string;
  inactiveIcon: string;
  hidden: boolean;
}>;

@customElement('hami-navigation-bar')
export class HNavigationBar extends scheduleSignalElement {
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

  @state()
  private user?: Projects.Hami.SignInResponse;

  @state()
  private slug = '';

  override connectedCallback() {
    super.connectedCallback();

    this.addSignalListener('user', (value) => {
      this.user = value;
    });

    this.addSignalListener('bottom-app-bar-hidden', (value) => {
      this.hidden = value;
    });

    // eslint-disable-next-line wc/require-listener-teardown
    window.addEventListener('vaadin-router-location-changed', (event) => {
      this.slug = '/' + event.detail.location.pathname.split('/')[1];
    });

    request('user', {}, 'cacheFirst');
  }

  override render(): RenderResult {
    if (this.user == null) return nothing;

    return html`
      <md-navigation-bar>
        ${map(
          this,
          HNavigationBar.navigationBarConfig(this.user.role),
          (tab) => html`
            <a class="navigation-tab" .href=${tab.href} ?hidden=${tab.hidden}>
              <md-navigation-tab
                .label=${tab.label}
                ?active=${tab.href === this.slug}
              >
                <md-icon slot="activeIcon">
                  ${unsafeSVG(tab.activeIcon)}
                </md-icon>
                <md-icon slot="inactiveIcon">
                  ${unsafeSVG(tab.inactiveIcon)}
                </md-icon>
              </md-navigation-tab>
            </a>
          `,
        )}
      </md-navigation-bar>
    `;
  }

  static navigationBarConfig = (
    role: Projects.Hami.User['role'],
  ): navigationBarConfigType => [
    {
      label: i18n.msg('orders'),
      href: urlForName('Orders'),
      activeIcon: icons.filledRounded.grading,
      inactiveIcon: icons.filledRounded.grading,
      hidden: false,
    },
    {
      label: i18n.msg('products'),
      href: urlForName('Products'),
      activeIcon: icons.filledRounded.category,
      inactiveIcon: icons.outlineRounded.category,
      hidden: false,
    },
    {
      label: i18n.msg('home'),
      href: urlForName('Home'),
      activeIcon: icons.filledRounded.home,
      inactiveIcon: icons.outlineRounded.home,
      hidden: false,
    },
    {
      label: i18n.msg('suppliers'),
      href: urlForName('Suppliers'),
      activeIcon: icons.filledRounded.supervisorAccount,
      inactiveIcon: icons.outlineRounded.supervisorAccount,
      hidden: role === 'seller',
    },
    {
      label: i18n.msg('user-profile'),
      href: urlForName('User'),
      activeIcon: icons.filledRounded.person,
      inactiveIcon: icons.outlineRounded.person,
      hidden: role !== 'seller',
    },
    {
      label: i18n.msg('customers'),
      href: urlForName('Customers'),
      activeIcon: icons.filledRounded.group,
      inactiveIcon: icons.outlineRounded.group,
      hidden: false,
    },
  ];
}
