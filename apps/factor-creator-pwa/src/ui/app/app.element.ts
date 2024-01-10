import { loggerElement } from '@gecut/mixins';
import clipboard from '@gecut/utilities/clipboard';
import ionicStyles from '@ionic/core/css/ionic.bundle.css?inline';
import { html, unsafeCSS } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';

import factorMaker from '../../utilities/factor-maker';

import styles from './app.element.scss?inline';

import type { RenderResult } from '@gecut/types';
import type {
  DatetimeChangeEventDetail,
  InputCustomEvent,
} from '@ionic/core';

declare global {
  interface HTMLElementTagNameMap {
    'app-root': AppRoot;
  }
}

@customElement('app-root')
export class AppRoot extends loggerElement {
  static override styles = [unsafeCSS(styles), unsafeCSS(ionicStyles)];

  @query('#factor-text')
  private textArea:HTMLIonTextareaElement;

  @state()
  private payment = 0;

  @state()
  private date = new Date();

  @state()
  private description = '';


  override render(): RenderResult {
    super.render();
    return html`
      <ion-card>
        <ion-card-header>
          <ion-card-title class="card-title">ساخت فاکتور</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-datetime
            locale="fa-IR"
            presentation="date"
            size="cover"
            @ionChange=${(event: CustomEvent<DatetimeChangeEventDetail>) =>
              (this.date = new Date(String(event.detail.value)))}
          ></ion-datetime>

          <ion-list>
            <ion-item>
              <ion-input
                label="پرداختی"
                placeholder="280,000"
                @ionInput=${(event: InputCustomEvent) =>
                  (this.payment = Number(event.detail.value))}
              ></ion-input>
            </ion-item>
            <ion-item>
              <ion-input
                id="for"
                label="بابت"
                placeholder="پذیرایی"
                @ionInput=${(event: InputCustomEvent) =>
                  (this.description = event.detail.value)}
              ></ion-input>
            </ion-item>
            <ion-item>
              <ion-textarea
              id="factor-text"
              readonly
                auto-grow
                .value=${factorMaker(this.date, this.payment, this.description)}
              >
                <ion-buttons class="icon-button" slot="primary">
                  <ion-button @click=${() => clipboard.write(this.textArea.value)}>
                    <ion-icon
                      slot="icon-only"
                      class="copy-icon"
                      name="copy-outline"
                    ></ion-icon>
                  </ion-button>
                </ion-buttons>
              </ion-textarea>
            </ion-item>
          </ion-list>
        </ion-card-content>
      </ion-card>
    `;
  }
}
