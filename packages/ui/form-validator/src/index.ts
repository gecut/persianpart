import { emailValidator } from './validators/email/validator';
import { maxValidator } from './validators/max/validator';
import { minValidator } from './validators/min/validator';
import { numericValidator } from './validators/numeric/validator';
import { phoneValidator } from './validators/phone/validator';
import { requiredValidator } from './validators/required/validator';

import type { Rules } from './type';
import type { Stringifyable } from '@gecut/types';

export * from './validators/email/validator';
export * from './validators/phone/validator';
export * from './validators/numeric/validator';
export * from './validators/required/validator';
export type * from './type';

export const validator = (value: Stringifyable, rules: Rules) => {
  return rules.map((ruleData) => {
    let validate = false;

    switch (ruleData.rule) {
      case 'phone':
        validate = phoneValidator(value, ruleData);
        break;
      case 'numeric':
        validate = numericValidator(value, ruleData);
        break;
      case 'required':
        validate = requiredValidator(value, ruleData);
        break;
      case 'email':
        validate = emailValidator(value, ruleData);
        break;
      case 'max':
        validate = maxValidator(value, ruleData);
        break;
      case 'min':
        validate = minValidator(value, ruleData);
        break;
    }

    return { validate, errorMessage: ruleData.errorMessage };
  });
};
