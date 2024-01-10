import { loggerElement } from '@gecut/mixins';
import { css, html } from 'lit';

import type { RenderResult } from '@gecut/types';

export abstract class GecutComponent extends loggerElement {
  static override styles = [
    css`
      * {
        box-sizing: border-box;

        -webkit-tap-highlight-color: transparent;

        font-family: var(--sys-font-family);
      }
    `,
  ];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  static render(..._args: any[]): RenderResult {
    return html``;
  }
}
