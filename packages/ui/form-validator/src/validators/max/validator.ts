import isNumber from '@gecut/utilities/is-number';

import type { MaxRule } from './type';
import type { ValidatorFunction } from '../../type';

export type * from './type';

export const maxValidator: ValidatorFunction<MaxRule> = (value, ruleData) => {
  if (isNumber(value) === false || ruleData.maxNumber > Number(value)) {
    return true;
  }

  return false;
};
