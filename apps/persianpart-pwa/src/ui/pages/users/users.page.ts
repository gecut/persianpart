import userEditDialog from '#persianpart/content/dialogs/user-edit.dialog';
import newUserFab from '#persianpart/content/fab/new-user.fab';
import requiredAdmin from '#persianpart/decorators/require-admin';
import type { UserJsonEntity } from '#persianpart/entities/user';
import dataManager from '#persianpart/manager/data';
import { PageData } from '#persianpart/ui/helpers/page-data';

import { ReceiverController } from '@gecut/data-manager/controllers/receiver';
import i18n from '@gecut/i18n';
import { PageSearchList } from '@gecut/lit-helper/pages/search-list';
import { createSignalProvider, dispatch, request } from '@gecut/signal';
import { html } from 'lit';
import { customElement } from 'lit/decorators.js';

declare global {
  interface HTMLElementTagNameMap {
    'page-users': PageUsers;
  }
}

@customElement('page-users')
@requiredAdmin
export class PageUsers extends PageSearchList<'users', typeof dataManager> {
  static override signals = {
    ...PageSearchList.signals,

    order: createSignalProvider('order'),
  };

  data = new ReceiverController(this, 'data', 'users', dataManager, {
    success: this.renderData.bind(this),
    'first-pending': () => html`${PageData.fetchingCard}`,
    error: () => html`${PageData.fetchErroredCard}`,
  });

  protected override queryParameters: Partial<{
    firstName: true;
    lastName: true;
    phoneNumber: true;
    password: true;
    permission: true;
    active: true;
    _id?: true;
    createdAt?: true;
  }> = {
    firstName: true,
    lastName: true,
    phoneNumber: true,
    permission: true,
  };

  override connectedCallback() {
    super.connectedCallback();

    dispatch('headline', i18n.msg('users-list'));
    request('fab', [newUserFab]);

    this.searchBarPlaceHolder = i18n.msg('search-in-users-list');
  }

  protected override renderItem(item: UserJsonEntity) {
    super.renderItem(item);

    return html`
      <label>
        <md-list-item @click=${() => request('dialog', userEditDialog(item))}>
          <span slot="headline">${item.firstName + ' ' + item.lastName}</span>
          <span slot="supporting-text">${i18n.phone(item.phoneNumber)}</span>
          <span slot="trailing-supporting-text">
            ${i18n.msg(item.permission)}
          </span>
        </md-list-item>
      </label>
    `;
  }
}
