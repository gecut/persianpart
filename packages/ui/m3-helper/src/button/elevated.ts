import '@material/web/button/elevated-button';
import { html } from 'lit';
import { directive, type PartInfo } from 'lit/directive.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { when } from 'lit/directives/when.js';

import { GecutDirective } from '../directives/_base';
import { icon } from '../icon';

import type { ButtonContent } from './_type';
import type { IconContent } from '../icon';
import type { RenderResult } from '@gecut/types';

export class GecutElevatedButtonDirective extends GecutDirective {
  constructor(partInfo: PartInfo) {
    super(partInfo, '<gecut-elevated-button>');
  }

  render(content: ButtonContent): RenderResult {
    this.log.method?.('render');

    return html`<md-elevated-button
      form=${ifDefined(content.form)}
      href=${ifDefined(content.href)}
      target=${ifDefined(content.target)}
      name=${ifDefined(content.name)}
      value=${ifDefined(content.value)}
      ?hasIcon=${content.hasIcon}
      ?trailingIcon=${content.trailingIcon}
      ?disabled=${content.disabled}
    >
      ${when(content.icon != null, () => icon(content.icon as IconContent))}
      ${content.text}
    </md-elevated-button>`;
  }
}

export const elevatedButton = directive(GecutElevatedButtonDirective);
