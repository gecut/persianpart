import { scheduleSignalElement } from '@gecut/mixins';
import { setProvider } from '@gecut/signal';
import { untilMS, untilNextFrame } from '@gecut/utilities/delay';
import { nextAnimationFrame } from '@gecut/utilities/polyfill';
import { nothing } from 'lit';
import { customElement } from 'lit/decorators.js';

import { renderDialog } from '../renderers/dialog';

import type { DialogContent, DialogRendererReturn } from '../types/dialog';
import type { RenderResult } from '@gecut/types';

declare global {
  interface HTMLElementTagNameMap {
    'dialog-outlet': DialogOutlet;
  }
}

declare global {
  interface Signals {
    readonly dialog: DialogRendererReturn;
  }
  interface Providers {
    readonly dialog: Partial<DialogContent>;
  }
}

@customElement('dialog-outlet')
export class DialogOutlet extends scheduleSignalElement {
  override connectedCallback() {
    super.connectedCallback();

    setProvider('dialog', async (content) => {
      content = {
        component: 'dialog',
        type: 'dialog',

        ...content,

        attributes: {
          ...content.attributes,
        },
      };

      const dialog = document.body.appendChild(renderDialog(content));

      dialog.addEventListener('closed', async () => {
        await untilMS(512);
        await untilNextFrame();

        document.body.dispatchEvent(new Event('dialog-closed'));
        dialog.remove();
      });

      dialog.open = true;

      nextAnimationFrame(() => {
        dialog.show();
      });

      return dialog;
    });
  }

  override render(): RenderResult {
    super.render();

    return nothing;
  }
}
