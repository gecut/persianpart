import signIn from '#persianpart/content/forms/sign-in';
import requiredNotAuthed from '#persianpart/decorators/require-not-authed';
import gecutLogo from '#persianpart/ui/assets/gecut-logo.webp?inline';
import type { PageBaseMeta } from '#persianpart/ui/helpers/page-base';
import { PageBase } from '#persianpart/ui/helpers/page-base';

import i18n from '@gecut/i18n';
import { M3 } from '@gecut/ui-kit';
import { html, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';

import style from './sign-in.page.css?inline';

import type { RenderResult } from '@gecut/types';

declare global {
  interface HTMLElementTagNameMap {
    'page-sign-in': PageSignIn;
  }
}

@customElement('page-sign-in')
@requiredNotAuthed
export class PageSignIn extends PageBase {
  static override styles = [...PageBase.styles, unsafeCSS(style)];

  static form = M3.Renderers.renderFormBuilder(signIn());

  override render(): RenderResult {
    super.render();

    return html`
      ${PageSignIn.form}

      <div class="gecut-logo">
        <img src=${gecutLogo} alt="Gecut Logo" />
      </div>
    `;
  }

  meta(): Partial<PageBaseMeta> {
    super.meta();

    return {
      fab: [],
      fullscreen: true,
      headline: i18n.msg('sign-in'),
    };
  }
}
