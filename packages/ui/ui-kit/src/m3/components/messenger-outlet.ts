import { scheduleSignalElement } from '@gecut/mixins';
import { setProvider } from '@gecut/signal';
import { untilNextFrame } from '@gecut/utilities/delay';
import { html, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import { renderSnackBar } from '../renderers/snack-bar';
import { SnackBarContent } from '../types/snack-bar';

import { SnackBar } from './snack-bar';

import type { RenderResult } from '@gecut/types';

declare global {
  interface HTMLElementTagNameMap {
    'messenger-outlet': MessengerOutlet;
  }
}

declare global {
  interface Signals {
    readonly messenger: SnackBarContent;
  }
  interface Providers {
    readonly messenger: Partial<SnackBarContent>;
  }
}

@customElement('messenger-outlet')
export class MessengerOutlet extends scheduleSignalElement {
  @state()
  private content?: SnackBarContent;

  @state()
  private snackbar?: SnackBar;

  override connectedCallback() {
    super.connectedCallback();

    setProvider('messenger', async (content) => {
      if (this.snackbar != null) {
        await this.snackbar?.close();
        await untilNextFrame();
      }

      return {
        component: 'snack-bar',
        type: 'ellipsis-message',

        ...content,
      };
    });

    this.addSignalListener('messenger', (content) => {
      this.content = content;
      this.snackbar = renderSnackBar(this.content);
    });
  }

  override render(): RenderResult {
    super.render();

    if (this.content == null || this.content.attributes?.message == null)
      return nothing;

    return html`${this.snackbar}`;
  }
}
