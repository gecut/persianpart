import { joinObjectValuesDeep } from '@gecut/utilities/join';
import objectPartial from '@gecut/utilities/object-partial';

import type {
  ObjectBooleanize,
  RenderResult,
  UnknownRecord,
} from '@gecut/types';

export async function* mapSearch<T extends UnknownRecord>(
  _this: unknown,
  items: Array<T> | undefined | null,
  query: string,
  searchParams: ObjectBooleanize<T>,
  f: (value: T) => RenderResult,
  notFound?: () => RenderResult,
  loading?: RenderResult,
): AsyncGenerator<RenderResult, RenderResult | void, RenderResult> {
  if (items == null) {
    return loading;
  }

  let findValues = 0;

  for (const value of items) {
    const search = (
      await Promise.resolve(
        joinObjectValuesDeep(' ', objectPartial({ ...value }, searchParams)),
      )
    ).toLowerCase();

    if (
      query
        .toLowerCase()
        .split(' ')
        .map((queryWord) => search.includes(queryWord))
        .reduce((p, c) => p && c, true)
    ) {
      findValues++;
      yield f.call(_this, value);
    }
  }

  if (findValues === 0 && notFound != null) {
    yield notFound();
  }
}
