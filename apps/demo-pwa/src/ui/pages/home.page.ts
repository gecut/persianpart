import { dialog } from '@gecut/m3-helper/dialog';
import { loggerElement } from '@gecut/mixins';
import { html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { router } from '../router';

declare global {
  interface HTMLElementTagNameMap {
    'page-home': PageHome;
  }
}

@customElement('page-home')
export class PageHome extends loggerElement {
  override render() {
    return html`
      ${dialog({
        headline: router.params['slug'] as string,
        headlineCloseButton: true,

        content: () => html`${router.params['slug']}`,
        actions: [
          {
            text: 'Close',
            value: 'close',
          },
        ],
      })}

      <md-filled-button
        @click=${() => (this.renderRoot.querySelector('md-dialog').open = true)}
      >
        Open
      </md-filled-button>
    `;
  }
}
