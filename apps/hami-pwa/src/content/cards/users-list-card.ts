import icons from '#hami/ui/icons';

import i18n from '@gecut/i18n';
import { request } from '@gecut/signal';
import { M3 } from '@gecut/ui-kit';
import { join } from '@gecut/utilities/join';
import { flow } from '@lit-labs/virtualizer/layouts/flow.js';
import { html } from 'lit';

import { addUserDialog } from '../dialogs/add-user-dialog';
import { userDialog } from '../dialogs/user-dialog';

import { notFoundListCard } from './not-found-list-card';

import type { Projects } from '@gecut/types';
import type { Lit } from '@gecut/ui-kit';

export function userItem(
  user: Projects.Hami.UserModel,
): M3.Types.ItemRendererReturn {
  return M3.Renderers.renderListItem({
    component: 'list-item',
    type: 'list-item',
    attributes: {
      headline: user.firstName + ' ' + user.lastName,
      supportingText: user.phoneNumber,
      multiLineSupportingText: true,
      trailingSupportingText: i18n.msg(
        'number-of-order',
        i18n.int(user.orderList.length),
      ),
      classes: ['user-item'],
      styles: {
        '--_list-item-trailing-supporting-text-color':
          'var(--md-sys-color-primary)',
        'user-select': 'none',
      },
    },
    children: [
      {
        component: 'icon',
        type: 'svg',
        attributes: { slot: 'start' },
        SVG: icons.outlineRounded.person,
        events: {
          click: (event) => {
            event.stopPropagation();

            request('dialog', userDialog(user));
          },
        },
      },
    ],
    events: {
      click: () => request('dialog', addUserDialog(user)),
    },
  });
}

export function userList(
  users: Projects.Hami.UserModel[],
): Lit.Types.LitVirtualizerContent<Projects.Hami.UserModel> {
  return {
    component: 'lit-virtualizer',
    type: 'lit-virtualizer',

    attributes: {
      // scroller: true,
      items: users,
      layout: flow({
        direction: 'vertical',
      }),
      renderItem: (users) => {
        return html`${userItem(users)}`;
      },
    },
  };
}

export function usersListCard(
  users: Projects.Hami.UserModel[],
  query = '',
): M3.Types.SurfaceCardRendererReturn {
  users = users.filter((user) => user.active === true);

  if (query.trim() !== '') {
    users = users.filter((user) =>
      join(' ', user.firstName, user.lastName, user.phoneNumber).includes(
        query,
      ),
    );
  }

  if (users.length === 0) {
    return M3.Renderers.renderSurfaceCard(notFoundListCard());
  }

  return M3.Renderers.renderSurfaceCard({
    component: 'surface-card',
    type: 'filled',
    children: [userList(users) as Lit.Types.LitVirtualizerContent<unknown>],
  });
}
