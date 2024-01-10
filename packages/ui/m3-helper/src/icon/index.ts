import { html, noChange } from 'lit';
import { directive, type PartInfo } from 'lit/directive.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';

import { GecutDirective } from '../directives/_base';

export interface IconContent {
  svg: string;

  slot?: string;
}

export class GecutIconDirective extends GecutDirective {
  constructor(partInfo: PartInfo) {
    super(partInfo, '<gecut-icon>');
  }

  protected svg: string = '';

  render(content: IconContent): unknown {
    this.log.method?.('render');

    if (this.svg === content.svg) return noChange;

    this.svg = content.svg;

    return html`
      <md-icon slot=${ifDefined(content.slot)}>
        ${unsafeSVG(this.svg)}
      </md-icon>
    `;
  }
}

export const icon = directive(GecutIconDirective);
