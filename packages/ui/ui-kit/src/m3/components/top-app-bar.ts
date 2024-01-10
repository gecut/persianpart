import { scheduleSignalElement } from '@gecut/mixins';
import { animate, flyAbove, flyBelow } from '@lit-labs/motion';
import '@material/web/elevation/elevation';
import { html, nothing, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { guard } from 'lit/directives/guard.js';

import type { RenderResult } from '@gecut/types';
import type { Options } from '@lit-labs/motion';
import type { PropertyDeclaration } from 'lit';

declare global {
  interface HTMLElementTagNameMap {
    'top-app-bar': TopAppBar;
  }
}

@customElement('top-app-bar')
export class TopAppBar extends scheduleSignalElement {
  static override styles = [
    css`
      :host {
        display: block;
        flex-grow: 0;
        flex-shrink: 0;
        padding: var(--sys-spacing-track);
        border-radius: 0;
        user-select: none;
        background-color: var(--md-sys-color-surface);
        position: relative;
        transition-property: background-color;
        transition-duration: var(--sys-motion-duration-small);
        transition-timing-function: var(--sys-motion-easing-in-out);
        will-change: background-color;
      }

      md-elevation {
        --_level: 0;
      }

      :host([mode='on-scroll']) {
        background-color: var(--md-sys-color-surface-container);
      }
      :host([mode='on-scroll']) md-elevation {
        --_level: 2;
      }

      .row {
        display: flex;
      }

      .title {
        flex-grow: 1;
      }

      :host([type='small']) .title,
      :host([type='center']) .title {
        padding: 0 var(--sys-spacing-track);
        font-family: var(--md-sys-typescale-title-medium-font-family-name);
        font-weight: var(--md-sys-typescale-title-medium-font-weight);
        font-size: var(--md-sys-typescale-title-medium-font-size);
        letter-spacing: var(--md-sys-typescale-title-medium-letter-spacing);
        /* line-height: var(--md-sys-typescale-title-large-line-height); */
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        overflow: clip;
        opacity: 0.7;
      }

      :host([type='small']) .title {
        justify-content: start;
      }

      /* md-standard-icon-button {
        margin: calc(var(--sys-spacing-track) / 2);
      } */

      .leading,
      .trailing,
      .title {
        display: flex;
        align-items: center;
        justify-content: center;

        height: calc(6 * var(--sys-spacing-track));
      }

      .headline {
        /* medium | large */
        display: none;
      }

      :host([type='medium']) {
        padding-bottom: calc(3 * var(--sys-spacing-track));
      }
      :host([type='large']) {
        padding-bottom: calc(3.5 * var(--sys-spacing-track));
      }

      :host([type='medium']) .headline,
      :host([type='large']) .headline {
        display: block;
        padding: 0 calc(1.5 * var(--sys-spacing-track));
      }

      :host([type='medium']) .headline {
        font-family: var(--md-sys-typescale-headline-small-font-family-name);
        font-weight: var(--md-sys-typescale-headline-small-font-weight);
        font-size: var(--md-sys-typescale-headline-small-font-size);
        letter-spacing: var(--md-sys-typescale-headline-small-letter-spacing);
        line-height: var(--md-sys-typescale-headline-small-line-height);
      }

      :host([type='large']) .headline {
        margin-top: calc(4 * var(--sys-spacing-track));
        font-family: var(--md-sys-typescale-headline-medium-font-family-name);
        font-weight: var(--md-sys-typescale-headline-medium-font-weight);
        font-size: var(--md-sys-typescale-headline-medium-font-size);
        letter-spacing: var(--md-sys-typescale-headline-medium-letter-spacing);
        line-height: var(--md-sys-typescale-headline-medium-line-height);
      }
    `,
  ];

  static animationConfig: Options = {
    keyframeOptions: {
      duration: 1_000,
      fill: 'auto',
    },

    in: flyBelow,
    out: flyAbove,
  };

  @property({ type: Boolean, reflect: true })
  animation = true;

  @property({ type: String })
  headline = '';

  @property({ type: String, reflect: true, state: false })
  mode: 'flat' | 'on-scroll' = 'flat';

  @property({ type: String, reflect: true })
  type: 'center' | 'small' | 'medium' | 'large' = 'small';

  @state()
  private headlineList: string[] = [];

  override render(): RenderResult {
    super.render();

    const headlineTemplate =
      this.type === 'medium' || this.type === 'large' ? this.headline : nothing;

    return html`
      <div class="row">
        <div class="leading">
          <slot name="leading"></slot>
        </div>

        <div class="title" .title=${this.headline}>${this.renderTitle()}</div>

        <div class="trailing">
          <slot name="trailing"></slot>
        </div>
      </div>

      ${guard(
        [this.type, this.headline],
        () => html`<div class="headline">${headlineTemplate}</div>`,
      )}

      <md-elevation></md-elevation>
    `;
  }

  override requestUpdate(
    name?: PropertyKey | undefined,
    oldValue?: unknown,
    options?: PropertyDeclaration<unknown, unknown> | undefined,
  ): void {
    super.requestUpdate(name, oldValue, options);

    if (
      name === 'headline' &&
      this.headline != null &&
      this.headlineList?.length != null
    ) {
      this.headlineList.push(this.headline);

      this.requestUpdate('headlineList');
    }
  }

  private renderTitle(): RenderResult {
    if (this.type === 'medium' || this.type === 'large') return nothing;

    return this.headlineList
      .slice(
        Math.max(this.headlineList.length - 1, 0),
        this.headlineList.length,
      )
      .map(
        (headline, index, headlineList) => html`
          <span
            ?hidden=${!(index === headlineList.length - 1)}
            .id=${headline}
            .innerHTML=${headline}
            ${animate(<Options>{
              ...TopAppBar.animationConfig,
              guard: () => [headline],
              id: headline,
              disabled: !this.animation,
            })}
          ></span>
        `,
      );
  }
}
