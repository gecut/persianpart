import { loggerElement } from '@gecut/mixins';
import { untilMS, untilNextFrame } from '@gecut/utilities/delay';
import { nextAnimationFrame } from '@gecut/utilities/polyfill';
import '@material/web/elevation/elevation';
import { html, nothing, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';

import { renderIconButton } from '../renderers/icon-button';

import type { IconButtonRendererReturn } from '../types/icon-button';
import type { RenderResult } from '@gecut/types';
import type { PropertyValues } from 'lit';

declare global {
  interface HTMLElementTagNameMap {
    'snack-bar': SnackBar;
  }
  interface HTMLElementEventMap {
    closed: CustomEvent<unknown>;
  }
}

@customElement('snack-bar')
export class SnackBar extends loggerElement {
  static override styles = [
    css`
      * {
        box-sizing: border-box;
      }

      :host {
        --_gap: min(calc(1.5 * var(--sys-spacing-side-padding)), 24px);

        display: flex;
        flex-direction: row;
        align-items: center;
        position: absolute;

        right: var(--_gap);
        left: var(--_gap);

        background-color: var(--md-sys-color-inverse-surface);
        color: var(--md-sys-color-inverse-on-surface);

        max-width: var(--sys-breakpoint-handset, 600px);
        min-height: calc(6 * var(--sys-spacing-track, 8px));
        height: min-content;
        padding-inline-start: calc(2 * var(--sys-spacing-track, 8px));
        border-radius: var(--sys-radius-xsmall, 4px);

        font-family: var(--md-sys-typescale-body-medium-font-family-name);
        font-style: var(--md-sys-typescale-body-medium-font-family-style);
        font-weight: var(--md-sys-typescale-body-medium-font-weight, 400);
        font-size: var(--md-sys-typescale-body-medium-font-size, 14px);
        letter-spacing: var(--md-sys-typescale-body-medium-tracking, 0.25px);
        line-height: var(--md-sys-typescale-body-medium-height, 20px);
        text-transform: var(--md-sys-typescale-body-medium-text-transform);
        text-decoration: var(--md-sys-typescale-body-medium-text-decoration);

        z-index: var(--sys-zindex-snackbar, 700);

        /* close state */
        opacity: 0;
        transform: translateX(100%) scale(1.1);
        pointer-events: none;
        transition-property: opacity, transform;
        transition-duration: var(--sys-motion-duration-medium, 400ms);
        will-change: opacity, transform;
      }

      :host([opened]) {
        opacity: 1;
        transform: translateX(0px) scale(1);
        pointer-events: auto;
        transition-duration: var(--sys-motion-duration-large, 512ms);
        transition-timing-function: cubic-bezier(0.18, 0.89, 0.32, 1.1);
      }

      :host([closing]) {
        opacity: 0;
        transform: translateY(-150%) scale(0.9);
        transition-timing-function: cubic-bezier(0.46, 0.03, 0.52, 0.96);
      }

      :host([type='wrap-message']) {
        align-items: baseline;
        padding: calc(1.5 * var(--sys-spacing-track, 8px));
        padding-bottom: calc(0.5 * var(--sys-spacing-track, 8px));
        flex-direction: column;
      }

      md-elevation {
        --_level: 3;
      }

      .message {
        flex-grow: 1;
      }
      :host([type='wrap-message']) .message {
        padding-bottom: calc(1.5 * var(--sys-spacing-track, 8px));
      }
      :host([type='ellipsis-message']) .message {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }

      ::slotted([slot='action']) {
        --_focus-label-text-color: var(--md-sys-color-inverse-on-surface);
        --_hover-label-text-color: var(--md-sys-color-inverse-on-surface);
        --_hover-state-layer-color: var(--md-sys-color-inverse-on-surface);
        --_label-text-color: var(--md-sys-color-inverse-on-surface);
        --_pressed-label-text-color: var(--md-sys-color-inverse-on-surface);
        --_pressed-state-layer-color: var(--md-sys-color-inverse-on-surface);
        --_focus-icon-color: var(--md-sys-color-inverse-on-surface);
        --_hover-icon-color: var(--md-sys-color-inverse-on-surface);
        --_icon-color: var(--md-sys-color-inverse-on-surface);
        --_pressed-icon-color: var(--md-sys-color-inverse-on-surface);

        opacity: 80%;
        margin-inline-end: calc(0.5 * var(--sys-spacing-track, 8px));
      }

      md-icon-button {
        --_icon-color: var(--md-sys-color-inverse-on-surface);

        margin-inline-end: calc(0.5 * var(--sys-spacing-track, 8px));
      }
    `,
  ];
  static closeIcon = `<svg height="1em" viewBox="0 96 960 960" width="1em"><path d="M480.761 630.109 275.913 834.957q-12.478 12.478-27.935 12.478-15.456 0-26.935-12.478-12.478-11.479-12.478-26.935 0-15.457 12.478-26.935l205.609-205.848L220.283 369.63q-11.479-11.478-11.479-27.054 0-15.576 11.479-27.054 11.239-11.479 26.815-11.479t28.054 11.479L480 520.609l205.087-205.326q11.478-11.479 26.935-11.479 15.456 0 27.935 11.479 11.478 12.478 11.478 28.315 0 15.837-11.478 27.315L534.87 575.761l204.847 205.848q11.718 11.717 11.718 27.174 0 15.456-11.718 26.934-11.478 11.718-27.054 11.718-15.576 0-26.054-11.718L480.761 630.109Z" fill="currentColor"/></svg>`;

  @property({ type: String, reflect: true })
  type: 'ellipsis-message' | 'wrap-message' = 'ellipsis-message';

  @property({ type: String, reflect: true })
  align: 'top' | 'bottom' = 'bottom';

  @property({ type: String, reflect: true })
  message?: string;

  @property({ type: Number, reflect: true })
  duration = 5_000;

  @property({ type: Number, reflect: true, attribute: 'start-from' })
  startFrom?: number;

  @property({ type: Boolean, reflect: true })
  closeButton = false;

  @property({ type: Boolean, reflect: true })
  opened = false;

  @property({ type: Boolean, reflect: true })
  closing = false;

  override render(): RenderResult {
    super.render();

    if (this.message == null) return nothing;

    this.style[this.align] =
      this.startFrom == null ? 'var(--_gap)' : this.startFrom + 'px';

    return html`
      <div class="message">${this.message}</div>
      ${when(this.closeButton === true, () => this.renderCloseButton())}
      <slot name="action"></slot>

      <md-elevation></md-elevation>
    `;
  }

  async close(): Promise<void> {
    this.closing = true;
    this.opened = false;

    this.requestUpdate();

    await untilMS(400);

    this.dispatchEvent(new CustomEvent('closed'));

    await untilNextFrame();

    this.remove();
  }

  protected override firstUpdated(
    changedProperties: PropertyValues<this>,
  ): void {
    super.firstUpdated(changedProperties);

    nextAnimationFrame(() => {
      this.opened = true;
    });

    if (this.duration > 0) {
      setTimeout(() => {
        this.close();
      }, this.duration);
    }
  }

  private renderCloseButton(): IconButtonRendererReturn {
    return renderIconButton({
      component: 'icon-button',
      type: 'icon-button',
      iconSVG: SnackBar.closeIcon,
      transformers: (target) => {
        target.addEventListener('click', () => this.close());

        return target;
      },
    });
  }
}
