import requiredAuthed from '#persianpart/decorators/require-authed';
import type { PageBaseMeta } from '#persianpart/ui/helpers/page-base';
import { PageBase } from '#persianpart/ui/helpers/page-base';

import i18n from '@gecut/i18n';
import { MaterialSymbols } from '@gecut/icons/material-symbols';
import { M3 } from '@gecut/ui-kit';
import { html, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';

import style from './support.page.css?inline';

import type { RenderResult } from '@gecut/types';

declare global {
  interface HTMLElementTagNameMap {
    'page-support': PageSupport;
  }
}

@customElement('page-support')
@requiredAuthed
export class PageSupport extends PageBase {
  static override styles = [...PageBase.styles, unsafeCSS(style)];

  override render(): RenderResult {
    super.render();

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
              SVG: MaterialSymbols.FilledRounded.SupportAgent,
              attributes: {
                styles: {
                  'margin': 'auto',
                  'font-size': '10vh',
                },
              },
            },
            {
              component: 'typography',
              type: 'p',
              style: 'title-large',
              attributes: {
                styles: {
                  'text-align': 'center',
                },
              },
              children: [i18n.msg('call-to-support')],
            },
            {
              component: 'button',
              type: 'outlined',
              attributes: {
                hasIcon: true,
                href: 'tel:09155595488',
                styles: {
                  width: '100%',
                },
              },
              children: [
                i18n.msg('click-to-call-to-support'),
                {
                  component: 'icon',
                  type: 'svg',
                  SVG: MaterialSymbols.Outline.Call,
                  attributes: {
                    slot: 'icon',
                  },
                },
              ],
            },
          ],
        },
      ],
    })}`;
  }

  meta(): Partial<PageBaseMeta> {
    super.meta();

    return {
      fab: [],
      fullscreen: false,
      headline: i18n.msg('support'),
    };
  }
}
