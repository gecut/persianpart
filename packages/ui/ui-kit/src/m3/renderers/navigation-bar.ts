import '@material/web/labs/navigationbar/navigation-bar';

import { createElementByContent } from './base/base-renderer';

import type {
  NavigationBarContent,
  NavigationBarRendererReturn,
} from '../types/navigation-bar';

export function renderNavigationBar(
  content: Partial<NavigationBarContent>,
): NavigationBarRendererReturn {
  content.component = 'navigation-bar';
  content.type = 'navigation-bar';

  return createElementByContent('md-navigation-bar', content);
}
