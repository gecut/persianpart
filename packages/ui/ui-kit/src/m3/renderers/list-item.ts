import { nextAnimationFrame } from '@gecut/utilities/polyfill';
import '@material/web/list/list-item';

import { createElementByContent } from './base/base-renderer';

import type { ListItemContent, ItemRendererReturn } from '../types/list-item';

export function renderListItem(
  content: Partial<ListItemContent>,
): ItemRendererReturn {
  content.component = 'list-item';
  content.type ??= 'list-item';

  content.transformers = [
    ...[content.transformers ?? []].flat(),

    (target) => {
      nextAnimationFrame(() => {
        target?.renderRoot
          ?.querySelector('span.label-text')
          ?.setAttribute('style', 'overflow:hidden');
      });

      return target;
    },
  ];

  const item = createElementByContent('md-list-item', content);

  if (content.attributes?.headline) {
    const headline = document.createElement('span');

    headline.slot = 'headline';
    headline.innerHTML = content.attributes?.headline;

    item.appendChild(headline);
  }

  if (content.attributes?.supportingText) {
    const supportingText = document.createElement('span');

    supportingText.slot = 'supporting-text';
    supportingText.innerHTML = content.attributes?.supportingText;

    item.appendChild(supportingText);
  }

  if (content.attributes?.trailingSupportingText) {
    const trailingSupportingText = document.createElement('span');

    trailingSupportingText.slot = 'trailing-supporting-text';
    trailingSupportingText.innerHTML =
      content.attributes?.trailingSupportingText;

    item.appendChild(trailingSupportingText);
  }

  return item;
}
