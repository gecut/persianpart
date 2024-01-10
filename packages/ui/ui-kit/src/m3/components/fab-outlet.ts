import { scheduleSignalElement } from '@gecut/mixins';
import { setProvider } from '@gecut/signal';
import { animate, flyRight, fadeOut } from '@lit-labs/motion';
import { css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { cache } from 'lit/directives/cache.js';
import { guard } from 'lit/directives/guard.js';

import { renderFAB } from '../renderers/fab';

import type { FABContent } from '../types/fab';
import type { RenderResult } from '@gecut/types';
import type { Options } from '@lit-labs/motion';
import type { MdFab } from '@material/web/fab/fab';

declare global {
  interface HTMLElementTagNameMap {
    'fab-outlet': FloatingActionButtonsOutlet;
  }
}

declare global {
  interface Signals {
    readonly fab: FABContent[];
  }
  interface Providers {
    readonly fab: Array<Partial<FABContent>>;
  }
}

@customElement('fab-outlet')
export class FloatingActionButtonsOutlet extends scheduleSignalElement {
  static override styles = [
    css`
      :host {
        display: flex;
        flex-direction: column;
        position: absolute;
        gap: calc(2 * var(--sys-spacing-track, 8px));
        bottom: calc(2 * var(--sys-spacing-track, 8px));
        inset-inline-start: calc(2 * var(--sys-spacing-track, 8px));
        z-index: var(--sys-zindex-above);
      }
    `,
  ];

  static animationConfig: Options = {
    in: flyRight,
    out: fadeOut,
    stabilizeOut: true,
  };

  @property({ type: Boolean, reflect: true })
  animation = true;

  @state()
  private contents: FABContent[] = [];

  @state()
  private fabs: MdFab[] = [];

  override connectedCallback() {
    super.connectedCallback();

    setProvider('fab', async (contents) => {
      return contents.map(
        (content): FABContent => ({
          component: 'fab',
          type: 'fab',

          ...content,
        }),
      );
    });

    this.addSignalListener('fab', (contents) => {
      this.contents = contents;

      this.fabs = this.contents.map((content) => {
        const fab = renderFAB(content);

        fab.id = `fab-${Date.now().toString(16)}`;

        return fab;
      });
    });
  }

  override render(): RenderResult {
    super.render();

    if (this.contents.length == 0) return nothing;

    const fabsTemplate = this.fabs.map((fab) =>
      cache(
        html`<div
          class="fab-container"
          ${animate({
            ...FloatingActionButtonsOutlet.animationConfig,
            inId: fab.id,
            disabled: !this.animation,
          })}
        >
          ${fab}
        </div>`,
      ),
    );

    return html`${guard(this.fabs, () => fabsTemplate)}`;
  }
}
