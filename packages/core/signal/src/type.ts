import type { MaybePromise } from '@gecut/types';

declare global {
  interface Signals {
    readonly 'signal-test-1': Record<string, string>;
  }
  interface Providers {
    readonly 'signal-test-1': string;
  }
}

export type SignalListener<T extends keyof Signals> = (
  data: Signals[T],
) => void;
export type SignalProvider<T extends keyof Providers & keyof Signals> = (
  args: Providers[T],
) => MaybePromise<Signals[T]>;
export type SignalNonNullable<T extends keyof Signals | keyof Providers> = NonNullable<
  SignalsObject[T]
>;
export type SignalsObject = {
  [T in keyof Signals | keyof Providers]?: {
    value: Signals[T] | undefined;
    provider: T extends keyof Providers ? SignalProvider<T> : undefined;
    listeners: SignalListener<T>[];
  };
};
