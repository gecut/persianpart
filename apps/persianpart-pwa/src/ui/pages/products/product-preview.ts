/* eslint-disable lit/no-template-bind */
import { MaterialSymbols } from '@gecut/icons/material-symbols';
import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';

declare global {
  interface HTMLElementTagNameMap {
    'product-preview': ProductPreview;
  }
}

@customElement('product-preview')
export class ProductPreview extends LitElement {
  static override styles = [
    css`
      :host {
        position: fixed;
        background: #0008;
        inset: 0;
        z-index: 100;
        backdrop-filter: blur(4px);
      }

      .box {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }

      md-icon-button {
        position: absolute;
        top: 16px;
        inset-inline-start: 16px;
      }
    `,
  ];

  @property()
  src = '';

  static renderPreview(src: string) {
    const elem = document.createElement('product-preview');

    elem.src = src;

    if ('startViewTransition' in document) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (document as any).startViewTransition(() =>
        document.body.appendChild(elem),
      );
    } else {
      document.body.appendChild(elem);
    }
  }

  protected render(): unknown {
    return html`
      <div class="box">
        <md-icon-button @click=${this.remove.bind(this)}>
          ${unsafeSVG(MaterialSymbols.FilledRounded.Close)}
        </md-icon-button>

        <img .src=${this.src} />
      </div>
    `;
  }
}
