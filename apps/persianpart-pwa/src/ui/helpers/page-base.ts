import pageStyle from '#persianpart/ui/stylesheets/page.css?inline';

import { createSignalProvider, dispatch, request } from '@gecut/signal';
import isEqual from '@gecut/utilities/is-equal';
import { unsafeCSS } from 'lit';

import { ComponentBase } from './component-base';

import type { SignalProvider } from '@gecut/signal';

type PageBaseDataFunction<Key extends keyof Providers> = (
  args: Providers[Key],
  strategy?: 'staleWhileRevalidate' | 'cacheFirst' | 'provideOnly',
) => Promise<Awaited<ReturnType<SignalProvider<Key>>>>;

type PageBaseData = {
  products: PageBaseDataFunction<'data.products'>;
  user: PageBaseDataFunction<'data.user'>;
  orders: PageBaseDataFunction<'data.orders'>;
  users: PageBaseDataFunction<'data.users'>;
};

export type PageBaseMeta = {
  fab: Providers['fab'];
  fullscreen: Signals['fullscreen'];
  headline: Signals['headline'];
};

export abstract class PageBase extends ComponentBase {
  static signals = {
    ...ComponentBase.signals,

    fab: createSignalProvider('fab'),
    headline: createSignalProvider('headline'),
    fullscreen: createSignalProvider('fullscreen'),
  };

  static override styles = [...ComponentBase.styles, unsafeCSS(pageStyle)];

  static data: PageBaseData = {
    products: async (args, strategy = 'cacheFirst') => {
      return await request('data.products', args, strategy);
    },
    user: async (args, strategy = 'cacheFirst') => {
      return await request('data.user', args, strategy);
    },
    users: async (args, strategy = 'cacheFirst') => {
      return await request('data.users', args, strategy);
    },
    orders: async (args, strategy = 'cacheFirst') => {
      return await request('data.orders', args, strategy);
    },
  };

  override connectedCallback(): void {
    super.connectedCallback();

    this._meta();
  }

  meta(): Partial<PageBaseMeta> {
    this.log.method?.('meta');

    return {
      fab: [],
      fullscreen: false,
      headline: '',
    };
  }

  private _meta(): void {
    const metaOptions = this.meta();

    this.log.methodArgs?.('_meta', metaOptions);

    request('fab', metaOptions.fab ?? []);

    if (!isEqual(PageBase.signals.fullscreen.value, metaOptions.fullscreen)) {
      dispatch('fullscreen', metaOptions.fullscreen ?? false);
    }
    if (!isEqual(PageBase.signals.headline.value, metaOptions.headline)) {
      dispatch('headline', metaOptions.headline ?? '');
    }
  }
}
