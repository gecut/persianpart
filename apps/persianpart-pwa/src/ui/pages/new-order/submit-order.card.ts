import messagesDialogs from '#persianpart/content/dialogs/messages.dialogs';
import requiredAuthed from '#persianpart/decorators/require-authed';
import type { OrderJsonEntity } from '#persianpart/entities/order';
import type { UserJsonEntity } from '#persianpart/entities/user';
import dataManager from '#persianpart/manager/data';
import { ComponentBase } from '#persianpart/ui/helpers/component-base';
import { router } from '#persianpart/ui/router';

import i18n from '@gecut/i18n';
import { createSignalProvider, dispatch, request } from '@gecut/signal';
import { M3 } from '@gecut/ui-kit';
import { css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import type { RenderResult } from '@gecut/types';

declare global {
  interface HTMLElementTagNameMap {
    'submit-order-card': SubmitOrderCard;
  }
}

@customElement('submit-order-card')
@requiredAuthed
export class SubmitOrderCard extends ComponentBase {
  static override signals = {
    ...ComponentBase.signals,

    order: createSignalProvider('order'),
    'can-submit-order': createSignalProvider('can-submit-order'),
  };
  static override styles = [
    ...ComponentBase.styles,
    css`
      :host {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
      }
    `,
  ];

  override connectedCallback(): void {
    super.connectedCallback();

    this.addSignalListener('order', () => {
      this.requestUpdate();
    });
    this.addSignalListener('can-submit-order', () => {
      this.requestUpdate();
    });
  }

  override render(): RenderResult {
    super.render();

    const canSubmitOrder =
      SubmitOrderCard.signals['can-submit-order'].value ?? true;
    const orderProducts = SubmitOrderCard.signals.order.value?.products ?? [];
    const totalPrice = orderProducts
      .map((product) => product.price * product.amount)
      .reduce((p, c) => p + c, 0);

    const cardTemplate = M3.Renderers.renderSurfaceCard({
      type: 'filled',
      attributes: {
        styles: {
          display: 'flex',
          overflow: 'visible',
          padding: 'calc(2*var(--sys-spacing-track))',
          flex: '1',
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
              display: 'flex',
              'flex-direction': 'column',
              flex: '1',
              margin: 'auto',
            },
          },
          children: [
            {
              component: 'typography',
              type: 'p',
              style: 'title-medium',
              attributes: {
                styles: {
                  'text-align': 'center',
                },
              },
              children: [
                i18n.msg(
                  'total-price',
                  i18n.int(totalPrice),
                  i18n.msg('$financial-unit'),
                ),
              ],
            },
            {
              component: 'division',
              type: 'div',
              attributes: {
                styles: {
                  display: 'flex',
                  gap: 'var(--sys-spacing-track)',
                  'justify-content': 'center',
                },
              },
              children: [
                {
                  component: 'button',
                  type: 'filled',
                  attributes: {
                    variant: canSubmitOrder ? 'primary' : 'tertiary',
                    disabled: !canSubmitOrder,
                  },
                  children: [i18n.msg('submit-order')],
                  events: {
                    click: async () => {
                      const order = SubmitOrderCard.signals.order.value;
                      const user = await request('data.user', {}, 'cacheFirst');

                      messagesDialogs
                        .untilSubmitOrderConfirmation()
                        .then(async () => {
                          if (order != null && user._id != null) {
                            order.user = user as UserJsonEntity;

                            dispatch('can-submit-order', false);

                            await dataManager.senders.newOrder
                              .send(order as OrderJsonEntity)
                              .finally(() => {
                                dispatch('can-submit-order', true);
                              });

                            router.go('user-profile');

                            SubmitOrderCard.signals.order.dispatch({});

                            request('messenger', {
                              attributes: {
                                message: i18n.msg(
                                  'order-successfully-registered',
                                ),
                                closeButton: true,
                              },
                            });
                          }
                        });
                    },
                  },
                },
                {
                  component: 'button',
                  type: 'filled-tonal',
                  attributes: {
                    variant: 'secondary',
                    href: router.link('products'),
                  },
                  children: [i18n.msg('back')],
                },
              ],
            },
          ],
        },
      ],
    });

    return html`${cardTemplate}`;
  }
}
