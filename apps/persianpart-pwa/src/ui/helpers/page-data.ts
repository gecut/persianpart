import messageCards from '#persianpart/content/cards/message.cards';
import { PageBase } from '#persianpart/ui/helpers/page-base';

import { M3 } from '@gecut/ui-kit';
import { html } from 'lit';
import { property, state } from 'lit/decorators.js';

import type { RenderResult } from '@gecut/types';
import type { PropertyValues } from 'lit';

export abstract class PageData<DataType> extends PageBase {
  static fetchingCard = M3.Renderers.renderSurfaceCard(messageCards.fetching);
  static fetchErroredCard = M3.Renderers.renderSurfaceCard(
    messageCards.fetchErrored,
  );

  @property({ type: String, reflect: true })
  fetchStatus: 'fetched' | 'errored' | 'fetching' = 'fetched';

  @state()
  protected data?: DataType;

  override render(): RenderResult {
    super.render();

    switch (this.fetchStatus) {
      case 'fetched':
        return this.renderFetchedTemplate();
      case 'errored':
        return this.renderFetchErroredTemplate();
      case 'fetching':
        return this.renderFetchingTemplate();
    }
  }

  protected firstUpdated(
    changedProperties: PropertyValues<this> | Map<PropertyKey, unknown>,
  ): void {
    super.firstUpdated(changedProperties);

    this._setData();
  }

  protected renderFetchedTemplate(): RenderResult {
    this.log.method?.('renderFetchedTemplate');

    return html``;
  }
  protected renderFetchingTemplate(): RenderResult {
    this.log.method?.('renderFetchingTemplate');

    return html`${PageData.fetchingCard}`;
  }
  protected renderFetchErroredTemplate(): RenderResult {
    this.log.method?.('renderFetchErroredTemplate');

    return html`${PageData.fetchErroredCard}`;
  }

  protected async fetchData(): Promise<DataType> {
    this.log.method?.('fetchData');

    return null as DataType;
  }

  protected async _fetchData(): Promise<DataType> {
    this.log.method?.('_fetchData');

    return await this.fetchData()
      .then((response) => {
        this.fetchStatus = 'fetched';

        return response;
      })
      .catch((error) => {
        this.fetchStatus = 'errored';

        return error;
      });
  }

  protected async _setData(): Promise<DataType> {
    this.log.method?.('_setData');

    this.fetchStatus = 'fetching';
    this.data = await this._fetchData();

    return this.data;
  }
}
