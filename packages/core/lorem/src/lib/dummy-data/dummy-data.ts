import random from '@gecut/utilities/random';

import content from '../../content';

import type { DummyDataFunctionReturn, DummyDataType } from '../type';

export const data = <T extends keyof DummyDataType>(
  type: T,
  language: keyof (typeof content)['products'],
): DummyDataFunctionReturn<T> | null => {
  switch (type) {
    case 'products':
      return random.array(content.products[language]);
    default:
      return null;
  }
};

export const bulkData = <T extends keyof DummyDataType>(
  type: T,
  language: keyof (typeof content)['products'],
): Array<DummyDataFunctionReturn<T>> => {
  switch (type) {
    case 'products':
      return content.products[language];
    default:
      return [];
  }
};
