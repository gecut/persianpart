import { loggerElement } from '@gecut/mixins';
import '@material/web/elevation/elevation';
import { css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import type { RenderResult } from '@gecut/types';

declare global {
  interface HTMLElementTagNameMap {
    'surface-card': SurfaceCard;
  }
}

@customElement('surface-card')
export class SurfaceCard extends loggerElement {
  static override styles = css`
    :host {
      --md-elevation-level: 0;
      --_container-color: var(--md-sys-color-surface, #fbfdf8);
      --_text-color: var(--md-sys-color-on-surface, #191a19);
      --_gap: 0px;

      display: flex;
      flex-direction: column;
      border-radius: var(--sys-radius-medium, 16px);
      position: relative;
      overflow: hidden;
      background: var(--_container-color);
      color: var(--_text-color);
    }

    :host([hidden]) {
      display: none;
    }

    :host([scroller]) .scroller {
      overflow: auto;
    }

    .scroller {
      display: flex;
      flex-direction: column;
      /* overflow: hidden; */
      gap: var(--_gap);
    }

    .scroller::-webkit-scrollbar {
      width: var(--sys-scrollbar-size);
      height: var(--sys-scrollbar-size);
    }

    .scroller::-webkit-scrollbar-corner,
    .scroller::-webkit-scrollbar-track {
      background-color: var(--sys-scrollbar-background);
    }

    .scroller::-webkit-scrollbar-track {
      margin: calc(1.5 * var(--sys-spacing-track));
    }

    .scroller::-webkit-scrollbar-thumb {
      background-color: var(--sys-scrollbar-color);
      border-radius: var(--sys-scrollbar-radius);
    }

    .scroller:hover::-webkit-scrollbar-thumb {
      background-color: var(--sys-scrollbar-color-hover);
    }

    .slots {
      display: contents;
      border-radius: inherit;
      overflow: hidden;
      height: max-content;
    }

    :host([type='elevated']) {
      --md-elevation-level: 1;

      --_container-color: var(--md-sys-color-surface-container, #f0f1ec);
    }
    :host([type='outlined']) {
      border: 1px solid var(--md-sys-color-outline);
      --_container-color: var(--md-sys-color-surface, #fbfdf8);
    }
    :host([type='filled']) {
      --_container-color: var(
        --md-sys-color-surface-container-highest,
        #2e312e
      );
    }
  `;

  @property({ type: String, reflect: true })
  type: 'elevated' | 'outlined' | 'filled' | 'nothing' = 'nothing';

  @property({ type: Boolean, reflect: true })
  scroller = false;

  override render(): RenderResult {
    super.render();

    return html`
      <div class="scroller">
        <div class="slots">
          <slot></slot>
        </div>
      </div>
      <md-elevation></md-elevation>
    `;
  }
}
