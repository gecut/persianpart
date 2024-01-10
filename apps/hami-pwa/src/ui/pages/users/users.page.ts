import { usersListCard } from '#hami/content/cards/users-list-card';
import { newUserFAB } from '#hami/content/fabs/new-user-fab';
import { headingPageTypography } from '#hami/content/typographies/heading-page-typography';
import { ifAdmin } from '#hami/controllers/if-admin';
import { PageBase } from '#hami/ui/helpers/page-base';
import icons from '#hami/ui/icons';
import { routerGo, urlForName } from '#hami/ui/router';

import i18n from '@gecut/i18n';
import { request } from '@gecut/signal';
import { M3 } from '@gecut/ui-kit';
import { html, unsafeCSS } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import styles from './users.page.scss?inline';

import type { Projects, RenderResult } from '@gecut/types';
import type { PropertyValues } from 'lit';

declare global {
  interface HTMLElementTagNameMap {
    'page-users': PageUsers;
  }
}

@customElement('page-users')
export class PageUsers extends PageBase {
  static override styles = [unsafeCSS(styles), ...PageBase.styles];

  @state()
  private users: Record<string, Projects.Hami.UserModel> = {};

  @state()
  private query = '';

  private usersSearchBoxComponent = M3.Renderers.renderTextField({
    component: 'text-field',
    type: 'outlined',

    attributes: {
      inputType: 'search',
      name: 'usersSearch',
      placeholder: i18n.msg('search'),
      hasLeadingIcon: true,
      styles: { width: '100%' },
    },
    children: [
      {
        component: 'icon',
        type: 'svg',
        SVG: icons.filledRounded.search,
        attributes: { slot: 'leadingicon' },
      },
    ],
    transformers: (target) => {
      target.addEventListener('input', () => {
        this.query = target.value;
      });

      return target;
    },
  });

  override connectedCallback(): void {
    super.connectedCallback();

    ifAdmin(
      () => {
        request('fab', [newUserFAB()]);
      },
      () => {
        routerGo(urlForName('Home'));
      },
    );

    this.addSignalListener('user-storage', (value) => {
      this.log.property?.('user-storage', value);

      this.users = value.data;
    });
  }

  override render(): RenderResult {
    super.render();

    return html`${this.renderUsersCard()}`;
  }

  protected firstUpdated(changedProperties: PropertyValues<this>): void {
    super.firstUpdated(changedProperties);

    request('user-storage', {}, 'cacheFirst');
  }

  private renderUsersCard(): RenderResult {
    const titleTemplate = M3.Renderers.renderTypoGraphy(
      headingPageTypography(i18n.msg('users')),
    );

    return html`
      <div class="card-box">
        ${titleTemplate}

        <div class="search-box">${this.usersSearchBoxComponent}</div>

        ${usersListCard(Object.values(this.users), this.query)}
      </div>
    `;
  }
}
