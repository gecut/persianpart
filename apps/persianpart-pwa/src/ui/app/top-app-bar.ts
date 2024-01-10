import gecutLogo from '#persianpart/ui/assets/persianpart.png?inline';
import { router } from '#persianpart/ui/router';

import { M3 } from '@gecut/ui-kit';
import { sanitizer } from '@gecut/utilities/sanitizer';
import { css, html } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import { cache } from 'lit/directives/cache.js';
import { guard } from 'lit/directives/guard.js';
import { when } from 'lit/directives/when.js';

import { ComponentBase } from '../helpers/component-base';
import icons from '../icons';

import type { RenderResult } from '@gecut/types';
import type { PropertyValues } from 'lit';

declare global {
  interface HTMLElementTagNameMap {
    'persianpart-top-app-bar': PPTopAppBar;
  }
}

@customElement('persianpart-top-app-bar')
export class PPTopAppBar extends ComponentBase {
  static override styles = [
    ...ComponentBase.styles,
    css`
      :host {
        z-index: 1;
      }

      .navigation-tab {
        flex: 1 1 auto;
        text-decoration: none;
      }

      md-navigation-tab {
        height: 100%;
      }

      *[hidden] {
        display: none;
      }
    `,
  ];

  static signInIconButton = M3.Renderers.renderIconButton({
    type: 'icon-button',
    attributes: { ariaLabel: 'Profile', slot: 'leading' },
    iconSVG: icons.outline.accountCircle,
    events: {
      click: () => {
        router.go('sign-in');
      },
    },
  });

  static profileIconButton = M3.Renderers.renderIconButton({
    type: 'icon-button',
    attributes: { ariaLabel: 'Profile', slot: 'leading' },
    iconSVG: icons.outline.accountCircle,
    events: {
      click: () => {
        router.go('user-profile');
      },
    },
  });

  static loading = M3.Renderers.renderCircularProgress({
    attributes: {
      indeterminate: true,
      styles: { '--_size': '40px' },
      slot: 'trailing',
    },
  });

  static gecutLogo = M3.Renderers.renderDivision({
    attributes: {
      styles: {
        'display': 'flex',
        'align-content': 'center',
        'justify-content': 'center',
        'width': '40px',
        'height': '40px',
      },
      slot: 'trailing',
    },
    children: [
      {
        component: 'img',
        type: 'img',
        attributes: {
          src: gecutLogo,
          alt: 'gecut-logo',
          styles: {
            height: '24px',
            margin: 'auto',
          },
        },
      },
    ],
  });

  @state()
  private loading = false;

  @state()
  private scrolling = false;

  @state()
  private headline = '';

  @state()
  private isAuthed = false;

  @query('top-app-bar')
  private topAppBarElement!: M3.Components.TopAppBar;

  override connectedCallback() {
    super.connectedCallback();

    this.addSignalListener('headline', (headline) => {
      if (this.headline !== headline) {
        this.headline = headline;
      }
    });
    this.addSignalListener('fullscreen', (fullscreen) => {
      if (this.hidden !== fullscreen) {
        this.hidden = fullscreen;
      }
    });
    this.addSignalListener('loading', (loadNumbers) => {
      const loading = loadNumbers > 0;

      if (this.loading !== loading) {
        this.loading = loading;
      }
    });
    this.addSignalListener('data.user', (user) => {
      this.isAuthed = user._id != null;
    });
  }

  override render(): RenderResult {
    const mode = this.scrolling === true ? 'on-scroll' : 'flat';

    return html`
      ${cache(html`
        <top-app-bar
          type="center"
          .headline=${sanitizer.str(this.headline)}
          .mode=${mode}
        >
          ${guard([this.isAuthed], () =>
            when(
              this.isAuthed == true,
              () => html`${PPTopAppBar.profileIconButton}`,
              () => html`${PPTopAppBar.signInIconButton}`,
            ),
          )}
          ${guard([this.loading], () =>
            when(
              this.loading == true,
              () => html`${PPTopAppBar.loading}`,
              () => html`${PPTopAppBar.gecutLogo}`,
            ),
          )}
        </top-app-bar>
      `)}
    `;
  }

  protected shouldUpdate(_changedProperties: PropertyValues<unknown>): boolean {
    if (_changedProperties.has('headline')) {
      this.topAppBarElement.headline = String(this.headline);

      return false;
    }
    if (_changedProperties.has('mode')) {
      this.topAppBarElement.mode =
        String(_changedProperties.get('mode')) === 'on-scroll' ?
          'on-scroll' :
          'flat';

      return false;
    }

    return super.shouldUpdate(_changedProperties);
  }
}
