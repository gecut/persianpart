import messageCards from '#persianpart/content/cards/message.cards';
import userProfile from '#persianpart/content/cards/user-profile';
import orderDetailDialog from '#persianpart/content/dialogs/order-detail.dialog';
import requiredAuthed from '#persianpart/decorators/require-authed';
import type { OrderJsonEntity } from '#persianpart/entities/order';
import type { UserJsonEntity } from '#persianpart/entities/user';
import type { PageBaseMeta } from '#persianpart/ui/helpers/page-base';
import { PageBase } from '#persianpart/ui/helpers/page-base';
import { PageData } from '#persianpart/ui/helpers/page-data';

import i18n from '@gecut/i18n';
import { MaterialSymbols } from '@gecut/icons/material-symbols';
import { request } from '@gecut/signal';
import { M3 } from '@gecut/ui-kit';
import { sanitizer } from '@gecut/utilities/sanitizer';
import { html, nothing, unsafeCSS } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';

import style from './user.page.css?inline';

import type { RenderResult } from '@gecut/types';

declare global {
  interface HTMLElementTagNameMap {
    'page-user': PageUser;
  }
}

@customElement('page-user')
@requiredAuthed
export class PageUser extends PageData<Partial<UserJsonEntity>> {
  static override styles = [...PageBase.styles, unsafeCSS(style)];

  @state()
  protected data: Partial<UserJsonEntity> = {};

  @state()
  protected orderList: OrderJsonEntity[] = [];

  @state()
  private orderListShow = false;

  meta(): Partial<PageBaseMeta> {
    super.meta();

    return {
      fab: [],
      fullscreen: false,
      headline: i18n.msg('user-profile'),
    };
  }

  static itemIconContent(item: OrderJsonEntity): M3.Types.IconContent {
    switch (item.status) {
      case 'accepted':
        return {
          component: 'icon',
          type: 'svg',
          SVG: MaterialSymbols.OutlineRounded.CheckCircle,
          attributes: {
            slot: 'start',
            styles: {
              color: 'var(--md-sys-color-success)',
            },
          },
        };
      case 'awaiting-confirmation':
        return {
          component: 'icon',
          type: 'svg',
          SVG: MaterialSymbols.Outline.Pending,
          attributes: {
            slot: 'start',
            styles: {
              color: 'var(--md-sys-color-warning)',
            },
          },
        };
      case 'canceled':
        return {
          component: 'icon',
          type: 'svg',
          SVG: MaterialSymbols.OutlineRounded.Cancel,
          attributes: {
            slot: 'start',
            styles: {
              color: 'var(--md-sys-color-danger)',
            },
          },
        };
    }
  }

  protected renderFetchedTemplate(): RenderResult {
    super.renderFetchedTemplate();

    return html`${this.userProfileTemplate}${when(
      this.orderListShow,
      () => this.userOrderHistoryTemplate,
      () => this.userOrderHideTemplate,
    )}`;
  }

  protected async fetchData(): Promise<Partial<UserJsonEntity>> {
    super.fetchData();

    request('data.user.orders', {}, 'provideOnly').then(
      (orderList) => (this.orderList = orderList),
    );

    return PageBase.data.user({});
  }

  private get userProfileTemplate(): RenderResult {
    if (this.data == null) return nothing;

    return html`${userProfile(this.data)}`;
  }
  private get userOrderHideTemplate(): RenderResult {
    if (this.data == null) return nothing;

    return html`${M3.Renderers.renderSurfaceCard({
      type: 'filled',
      attributes: {
        styles: {
          'display': 'flex',
          'overflow': 'visible',
          'padding': 'calc(2*var(--sys-spacing-track))',
          'flex': '1',
          'justify-content': 'center',
          'align-items': 'center',
        },
      },
      children: [
        {
          component: 'division',
          type: 'div',
          attributes: {
            styles: {
              'display': 'flex',
              'flex-direction': 'column',
              'flex': '1',
              'margin': 'auto',
            },
          },
          children: [
            {
              component: 'icon',
              type: 'svg',
              SVG: MaterialSymbols.FilledRounded.History,
              attributes: {
                styles: {
                  margin: 'auto',
                  width: '6vh',
                  height: '6vh',
                },
              },
            },
            {
              component: 'typography',
              type: 'p',
              style: 'title-large',
              children: [i18n.msg('your-order-history')],
            },
            {
              component: 'button',
              type: 'outlined',
              attributes: {
                hasIcon: true,
                trailingIcon: true,
                styles: {
                  width: '100%',
                },
              },
              children: [
                i18n.msg('click-to-see'),
                {
                  component: 'icon',
                  type: 'svg',
                  SVG: MaterialSymbols.FilledRounded.ChevronRight,
                  attributes: {
                    slot: 'icon',
                  },
                },
              ],
              events: {
                click: () => {
                  this.orderListShow = true;
                },
              },
            },
          ],
        },
      ],
    })}`;
  }
  private get userOrderHistoryTemplate(): RenderResult {
    if (this.data == null) return nothing;

    if (this.orderList.length === 0) {
      return html`${M3.Renderers.renderSurfaceCard(
        messageCards.orderNotFound,
      )}`;
    }

    return html`${M3.Renderers.renderSurfaceCard({
      type: 'filled',
      attributes: {
        scroller: true,
      },
      children: this.orderList
        .sort((a, b) => {
          return (
            new Date(b.createdAt ?? 0).getTime() -
            new Date(a.createdAt ?? 0).getTime()
          );
        })
        .map((order): M3.Types.ListItemContent => {
          const totalPrice = order.products
            .map((product) => product.price * product.amount)
            .reduce((p, c) => p + c, 0);

          return {
            component: 'list-item',
            type: 'list-item',
            attributes: {
              headline: i18n.dateTime(sanitizer.str(order.createdAt)),
              supportingText: i18n.msg(
                'item-order-text',
                i18n.int(totalPrice),
                i18n.msg('$financial-unit'),
              ),
            },
            children: [PageUser.itemIconContent(order)],
            events: {
              click: () => {
                request('dialog', orderDetailDialog(order));
              },
            },
          };
        }),
    })}`;
  }
}
