import type { EmailRule } from './validators/email/type';
import type { MaxRule } from './validators/max/type';
import type { MinRule } from './validators/min/type';
import type { NumericRule } from './validators/numeric/type';
import type { PhoneRule } from './validators/phone/type';
import type { RequiredRule } from './validators/required/type';
import type { Stringifyable, ArrayValues } from '@gecut/types';

export type Rule =
  | PhoneRule
  | EmailRule
  | NumericRule
  | RequiredRule
  | MaxRule
  | MinRule;
export type Rules = Array<Rule>;

export type ValidatorFunction<T extends ArrayValues<Rules>> = (
  value: Stringifyable,
  options: T,
) => boolean;
