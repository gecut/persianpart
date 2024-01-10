import '@material/web/select/select-option';

import { createElementByContent } from './base/base-renderer';

import type {
  SelectOptionContent,
  SelectOptionRendererReturn,
} from '../types/select-option';

export function renderSelectOption(
  content: Partial<SelectOptionContent>,
): SelectOptionRendererReturn {
  content.component = 'select-option';
  content.type = 'select-option';

  const item = createElementByContent('md-select-option', content);

  if (content.attributes?.headline) {
    const headline = document.createElement('span');

    headline.slot = 'headline';
    headline.innerHTML = content.attributes?.headline;

    item.appendChild(headline);
  }

  if (content.attributes?.supportingText) {
    const supportingText = document.createElement('span');

    supportingText.slot = 'supportingText';
    supportingText.innerHTML = content.attributes?.supportingText;

    item.appendChild(supportingText);
  }

  if (content.attributes?.trailingSupportingText) {
    const trailingSupportingText = document.createElement('span');

    trailingSupportingText.slot = 'trailingSupportingText';
    trailingSupportingText.innerHTML =
      content.attributes?.trailingSupportingText;

    item.appendChild(trailingSupportingText);
  }

  return item;
}
