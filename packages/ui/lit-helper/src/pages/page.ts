import { scheduleSignalElement } from '@gecut/mixins';
import { css, html } from 'lit';

import type { RenderResult } from '@gecut/types';

export type GecutPWAPageMeta = {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  robots?: {
    index?: boolean;
    follow?: boolean;
  };
};

export abstract class GecutPWAPage extends scheduleSignalElement {
  static override styles = [
    css`
      [hidden] {
        display: none;
      }
      * {
        box-sizing: border-box;
        -webkit-tap-highlight-color: #0000;
      }
    `,
    css`
      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
        gap: var(--_gap, 8px);
      }
    `,
  ];

  override render(): RenderResult {
    super.render();

    return html``;
  }

  protected meta(): GecutPWAPageMeta {
    this.log.method?.('meta');

    return {};
  }
}
