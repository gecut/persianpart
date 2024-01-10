import i18n from '@gecut/i18n';

import { requiredBrowser } from './browser-or-node';

import type { M3 } from '@gecut/ui-kit';

export function phoneNumberHelper<T extends M3.Types.TextFieldRendererReturn>(
  target: T,
): T {
  requiredBrowser();

  target.addEventListener('input', () => {
    target.supportingText = i18n.phone(target.value);
  });

  return target;
}

export function passwordHelper<T extends M3.Types.TextFieldRendererReturn>(
  target: T,
): T {
  requiredBrowser();

  target.addEventListener('focus', () => {
    ((target: M3.Types.TextFieldRendererReturn) => {
      target.type = 'text';
    })(target);
  });
  target.addEventListener('blur', () => {
    ((target: M3.Types.TextFieldRendererReturn) => {
      target.type = 'password';
    })(target);
  });

  return target;
}

export function productQuantityHelper(
  price: number,
  unitPrice: string,
): M3.Types.Transformer<M3.Types.TextFieldRendererReturn> {
  requiredBrowser();

  return <T extends M3.Types.TextFieldRendererReturn>(target: T): T => {
    showFinancialText(target, price, unitPrice);

    target.addEventListener('input', () => {
      showFinancialText(target, price, unitPrice);
    });

    return target;
  };
}
function showFinancialText(
  target: M3.Types.TextFieldRendererReturn,
  price: number,
  unitPrice: string,
) {
  const valueNumber = target.value.trim() === '' ? 0 : Number(target.value);

  target.supportingText = i18n.int(price * valueNumber) + ' ' + unitPrice;
}

export function numberHelper<T extends M3.Types.TextFieldRendererReturn>(
  target: T,
): T {
  requiredBrowser();

  target.addEventListener('input', () => {
    target.supportingText = i18n.int(target.valueAsNumber);
  });

  return target;
}

export default {
  phoneNumberHelper,
  passwordHelper,
  productQuantityHelper,
  numberHelper,
};
