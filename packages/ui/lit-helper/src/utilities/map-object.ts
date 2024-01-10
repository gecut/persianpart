import type { RenderResult } from '@gecut/types';

export function* mapObject<T>(
  _this: unknown,
  items: Record<string, T> | undefined | null,
  f: (value: T, key: string) => RenderResult,
  loading?: RenderResult,
): Generator<RenderResult, RenderResult | void, RenderResult> {
  if (items == null) {
    return loading;
  }

  for (const key in items) {
    if (!Object.prototype.hasOwnProperty.call(items, key)) continue;

    yield f.call(_this, items[key], key);
  }
}
