import requiredAuthed from '#persianpart/decorators/require-authed';
import type { OrderProduct } from '#persianpart/entities/order';
import type { PageBaseMeta } from '#persianpart/ui/helpers/page-base';
import { PageBase } from '#persianpart/ui/helpers/page-base';
import { router } from '#persianpart/ui/router';

import i18n from '@gecut/i18n';
import { createSignalProvider } from '@gecut/signal';
import { M3 } from '@gecut/ui-kit';
import isNumber from '@gecut/utilities/is-number';
import textFieldRules from '@gecut/utilities/text-field-rules';
import textFieldTransformers from '@gecut/utilities/text-field-transformers';
import { css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import './submit-order.card';

import type { FormTextFieldContent } from '@gecut/form-builder';
import type { RenderResult } from '@gecut/types';

declare global {
  interface HTMLElementTagNameMap {
    'page-new-order': PageNewOrder;
  }
}

@customElement('page-new-order')
@requiredAuthed
export class PageNewOrder extends PageBase {
  static override signals = {
    ...PageBase.signals,

    'order': createSignalProvider('order'),
    'can-submit-order': createSignalProvider('can-submit-order'),
  };
  static override styles = [
    ...PageBase.styles,
    css`
      :host {
        padding: calc(2 * var(--sys-spacing-track));
        height: 100%;
        display: flex;
        flex-direction: column;
        gap: calc(2 * var(--sys-spacing-track));
      }

      .form-card {
        padding: var(--sys-spacing-track) 0;
      }
      .form-card form-builder {
        --gap: calc(2.2 * var(--sys-spacing-track));
        --padding-horizontal: calc(1.2 * var(--sys-spacing-track));
      }
    `,
  ];

  private products: OrderProduct[] =
    PageNewOrder.signals.order.value?.products ?? [];

  override connectedCallback() {
    this.addSignalListener('order', (order) => {
      this.products = order.products ?? [];
    });

    super.connectedCallback();

    if ((PageNewOrder.signals.order.value?.products ?? []).length === 0) {
      router.go('products');
    }
  }

  override render(): RenderResult {
    super.render();

    return html`${this.formCard}<submit-order-card></submit-order-card>`;
  }

  meta(): Partial<PageBaseMeta> {
    super.meta();

    return {
      fab: [],
      fullscreen: false,
      headline: i18n.msg('new-order'),
    };
  }

  private get formCard(): RenderResult {
    this.log.method?.('formCard');

    const formTemplate = this.products.map(
      (product): FormTextFieldContent => ({
        component: 'text-field',
        type: 'outlined',
        attributes: {
          inputType: 'number',
          name: product._id ?? '',
          value: product.amount.toString(),
          label: i18n.msg(
            'form-product-name',
            product.name,
            i18n.int(product.quantity),
            product.unit,
          ),
          min: '0',
          max: product.quantity.toString(),
        },

        validator: textFieldRules(
          `max${Math.floor(product.quantity) + 1}`,
          `min0`,
          'numeric',
          'required',
        ),

        events: {
          input: (event) => {
            const target = event.target as M3.Types.TextFieldRendererReturn;
            const value = target.valueAsNumber;

            PageNewOrder.signals.order.dispatch({
              ...(PageNewOrder.signals.order.value ?? {}),

              products: this.products.map((_product) => {
                if (_product._id === product._id && isNumber(value)) {
                  return {
                    ..._product,

                    amount: value,
                  };
                }

                return _product;
              }),
            });
          },
        },

        transformers: [
          textFieldTransformers.productQuantityHelper(
            product.price,
            i18n.msg('$financial-unit'),
          ),
        ],
      }),
    );

    const cardTemplate = M3.Renderers.renderSurfaceCard({
      type: 'filled',
      attributes: {
        classes: ['form-card'],
        scroller: true,
      },
      children: [
        {
          component: 'form-builder',
          type: 'form-builder',
          attributes: {
            activeSlide: 'initial',
            data: {
              slides: {
                initial: formTemplate,
              },
              onChange(event) {
                PageNewOrder.signals['can-submit-order'].dispatch(
                  event.validate,
                );
              },
            },
          },
        },
      ],
    });

    return html`${cardTemplate}`;
  }
}
