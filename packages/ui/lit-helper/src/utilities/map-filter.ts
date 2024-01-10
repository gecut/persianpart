import type { MaybePromise, RenderResult } from '@gecut/types';

export async function* mapFilter<T>(
  _this: unknown,
  items: Array<T> | undefined | null,
  filter: (item: T) => MaybePromise<boolean>,
  f: (value: T) => RenderResult,
  loading?: RenderResult,
): AsyncGenerator<RenderResult, RenderResult | void, RenderResult> {
  if (items == null) {
    return loading;
  }

  for (const value of items) {
    if (await Promise.resolve(filter(value)) === true) {
      yield f.call(_this, value);
    }
  }
}
