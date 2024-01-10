import { MaterialSymbols } from '@gecut/icons/material-symbols';
import { map } from '@gecut/lit-helper/utilities/map';
import { uid } from '@gecut/utilities/uid';
import { html, noChange } from 'lit';
import { directive, type PartInfo } from 'lit/directive.js';
import { when } from 'lit/directives/when.js';

import { button } from '../button';
import { GecutDirective } from '../directives/_base';
import { icon, type IconContent } from '../icon';

import type { ButtonContent } from '../button/_type';
import type { RenderResult } from '@gecut/types';

export interface DialogContent {
  icon?: IconContent;
  headline: string;
  headlineCloseButton?: boolean;

  open?: boolean;

  content: (formId: string) => RenderResult;
  actions: ((formId: string) => RenderResult) | Array<ButtonContent>;
}

export class GecutDialogDirective extends GecutDirective {
  constructor(partInfo: PartInfo) {
    super(partInfo, '<gecut-dialog>');
  }

  protected formId = 'form-' + uid();

  render(content?: DialogContent): unknown {
    this.log.method?.('render');

    if (content === undefined) return noChange;

    return html`
      <md-dialog class="dialog" ?open=${content.open}>
        ${when(content.icon != null, () => icon(content.icon as IconContent))}

        <span slot="headline">
          ${when(
            content.headlineCloseButton === true,
            () => html`
              <md-icon-button
                form=${this.formId}
                value="close"
                aria-label="Close dialog"
              >
                ${icon({ svg: MaterialSymbols.FilledRounded.Close })}
              </md-icon-button>
            `,
          )}

          <span class="headline">${content.headline}</span>
        </span>

        <form .id=${this.formId} slot="content" method="dialog">
          ${content.content(this.formId)}
        </form>

        <div slot="actions">
          ${Array.isArray(content.actions)
            ? map(
                this,
                content.actions as ButtonContent[],
                (buttonContent) =>
                  html`${button.text({ form: this.formId, ...buttonContent })}`,
              )
            : content.actions(this.formId)}
        </div>
      </md-dialog>
    `;
  }
}

export const dialog = directive(GecutDialogDirective);
