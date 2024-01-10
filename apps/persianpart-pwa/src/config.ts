import type { OrderJsonEntity } from '#persianpart/entities/order';
import type { ProductJsonEntity } from '#persianpart/entities/product';
import type { SettingJsonEntity } from '#persianpart/entities/setting';
import type { UserJsonEntity } from '#persianpart/entities/user';

import i18n from '@gecut/i18n';

import fa from './content/translation/fa-IR.json';

import type { LocaleFileType } from '@gecut/i18n';

i18n.register(fa as LocaleFileType);

declare global {
  interface Signals {
    readonly headline: string;
    readonly fullscreen: boolean;
    readonly loading: number;
    readonly fullscreenLoader: number;
    readonly order: Partial<OrderJsonEntity>;
    readonly 'can-submit-order': boolean;

    readonly 'data.settings': Partial<SettingJsonEntity>;
    readonly 'data.user': Partial<UserJsonEntity>;
    readonly 'data.user.orders': OrderJsonEntity[];
    readonly 'data.users': UserJsonEntity[];
    readonly 'data.products': ProductJsonEntity[];
    readonly 'data.orders': OrderJsonEntity[];
  }
  interface Providers {
    readonly loading: 'start' | 'end';
    readonly fullscreenLoader: 'start' | 'end';

    readonly headline: never;
    readonly fullscreen: never;
    readonly 'can-submit-order': never;
    readonly order: never;

    readonly 'data.settings': Record<string, never>;
    readonly 'data.user': Record<string, never>;
    readonly 'data.user.orders': Record<string, never>;
    readonly 'data.users': Record<string, never>;
    readonly 'data.products': Record<string, never>;
    readonly 'data.orders': Record<string, never>;
  }
}

const config = {
  version: '0.0.1',
  limitProductQuantity: 10,
};

export default config;
