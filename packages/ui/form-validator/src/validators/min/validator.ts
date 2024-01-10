import isNumber from '@gecut/utilities/is-number';

import type { MinRule } from './type';
import type { ValidatorFunction } from '../../type';

export type * from './type';

export const minValidator: ValidatorFunction<MinRule> = (value, ruleData) => {
  if (isNumber(value) === false || Number(value) > ruleData.minNumber) {
    return true;
  }

  return false;
};
