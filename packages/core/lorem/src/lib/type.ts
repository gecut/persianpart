import type { ArrayValues } from '@gecut/types';

export type Languages = ['en', 'fa'];
export type SizeType = ['paragraph', 'sentence', 'word'];

export type LoremIpsumOptions = {
  lang: Languages[number];
  sizeType: SizeType[number];
  size: number;
};

export type LoremIpsumParameters = Partial<LoremIpsumOptions>;

export type DummyProduct = {
  title: string;
  description: string;
  brand: string;
  category: string;
};

export type DummyDataType = {
  products: Readonly<DummyProduct>;
};

export type DummyDataFunctionReturn<T extends keyof DummyDataType> =
  DummyDataType[T];

export type Content = {
  loremIpsum: Record<ArrayValues<Languages>, string>;
  products: Record<ArrayValues<Languages>, Array<Readonly<DummyProduct>>>;
};
