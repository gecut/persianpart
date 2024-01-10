import { GecutNavigationBar } from '@gecut/components/navigation-bar/navigation-bar';
import { scheduleSignalElement } from '@gecut/mixins';
import { css, html } from 'lit';
import { guard } from 'lit/directives/guard.js';

import type { GecutNavigationTabContent } from '@gecut/components/navigation-tab/navigation-tab';
import type { RenderResult } from '@gecut/types';
import type { PropertyValues } from 'lit';

export abstract class GecutApp extends scheduleSignalElement {
  static override styles = [
    css`
      [hidden] {
        display: none;
      }
    `,
    css`
      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%;
        overflow: hidden;
        position: relative;
      }

      main {
        display: flex;
        flex-direction: column;
        flex: 1;
        overflow: hidden;
        position: relative;
      }
    `,
    css`
      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      main[role='main'] {
        display: block;
        overflow-y: auto;
        padding: 16px;
        padding-bottom: 0;
        height: 100%;
      }

      main[role='main']::-webkit-scrollbar {
        width: var(--sys-scrollbar-size, 4px);
        height: var(--sys-scrollbar-size, 4px);
      }
      main[role='main']::-webkit-scrollbar-corner,
      main[role='main']::-webkit-scrollbar-track {
        background-color: var(--sys-scrollbar-background);
      }
      main[role='main']::-webkit-scrollbar-track {
        margin: calc(1.5 * var(--sys-spacing-track));
      }
      main[role='main']::-webkit-scrollbar-thumb {
        background-color: var(--sys-scrollbar-color);
        border-radius: var(--sys-scrollbar-radius);
      }
      main[role='main']:hover::-webkit-scrollbar-thumb {
        background-color: var(--sys-scrollbar-color-hover);
      }

      g-navigation-bar + main[role='main'] {
        /* 80 + 16 */
        margin-bottom: 96px;
      }

      g-navigation-bar[island] + main[role='main'] {
        /* 80 + 16 + 16 */
        margin-bottom: 112px;
      }

      @media only screen and (min-width: 600px) {
        g-navigation-bar[auto-island] + main[role='main'] {
          /* 80 + 16 + 16 */
          margin-bottom: 112px;
        }
      }
    `,
  ];

  override render(): RenderResult {
    super.render();

    return html``;
  }

  static renderNavigationBottom(
    tabs: GecutNavigationTabContent[],
    island = false,
    autoIsland = false,
  ) {
    return guard([island, autoIsland, ...tabs], () =>
      GecutNavigationBar.render(
        location.pathname + location.hash,
        tabs,
        island,
        autoIsland,
      ),
    );
  }

  protected override firstUpdated(
    changedProperties: PropertyValues<this>,
  ): void {
    super.firstUpdated(changedProperties);

    window.addEventListener('vaadin-router-location-changed', () =>
      this.requestUpdate(),
    );
  }
}
