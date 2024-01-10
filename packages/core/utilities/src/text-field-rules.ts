import i18n from '@gecut/i18n';

import type { Rule, Rules } from '@gecut/form-validator';

type _Rule = Rule['rule'] | `max${number}` | `min${number}`;

function rule<R extends _Rule>(rule: R): Rule {
  if (rule === 'phone') {
    return {
      rule: 'phone',
      country: 'IR',
      errorMessage: i18n.msg('invalid-phone-number'),
    };
  } else if (rule === 'email') {
    return {
      rule: 'email',
      errorMessage: i18n.msg('email-is-invalid'),
    };
  } else if (rule === 'numeric') {
    return {
      rule: 'numeric',
      errorMessage: i18n.msg('no-number'),
    };
  } else if (rule.indexOf('max') === 0) {
    return {
      rule: 'max',
      maxNumber: Number(rule.replace('max', '')),
      errorMessage: i18n.msg('more-than-the-limit'),
    };
  } else if (rule.indexOf('min') === 0) {
    return {
      rule: 'min',
      minNumber: Number(rule.replace('min', '')),
      errorMessage: i18n.msg('less-than-the-limit'),
    };
  } else {
    return {
      rule: 'required',
      errorMessage: i18n.msg('required'),
    };
  }
}

export default function textFieldRules(...rules: Array<_Rule>): Rules {
  return rules.map(rule);
}
