import '@material/web/labs/navigationtab/navigation-tab';

import { createElementByContent } from './base/base-renderer';

import type {
  NavigationTabContent,
  NavigationTabRendererReturn,
} from '../types/navigation-tab';

export function renderNavigationTab(
  content: Partial<NavigationTabContent>,
): NavigationTabRendererReturn {
  content.component = 'navigation-tab';
  content.type = 'navigation-tab';

  return createElementByContent('md-navigation-tab', content);
}
