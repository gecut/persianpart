import type { MaybePromise, RenderResult } from '@gecut/types';

declare global {
  interface GecutReceiverServices {
    readonly 'r-simple-request': string;
  }
  interface GecutSenderServices {
    readonly 's-simple-request': string;
  }
}

export type ReceiverServiceCache = 'local-storage' | false;
export type Status = 'success' | 'error' | 'pending' | 'first-pending';
export type OnStatusChangeFunction<Data> = (
  status: Status,
  data: Data | null,
) => MaybePromise<void>;

export type SubscribeFunction<Data> = (data: Data) => unknown;

export type RendererFunction<Data> = (data: Data) => RenderResult;
export type ReceiverFunction<Data> = () => MaybePromise<Data>;
export type SenderFunction<Data> = (data: Data) => MaybePromise<void>;

export type ReceiverServiceObject<Data> = {
  receiverFunction: ReceiverFunction<Data>;
  cache?: ReceiverServiceCache;
};

export type SenderServiceObject<Data> = {
  senderFunction: SenderFunction<Data>;
  dependencies: (keyof GecutReceiverServices)[] | '*';
};
