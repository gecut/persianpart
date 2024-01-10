import type { BaseContent } from './base/base-content';
import type { MdNavigationBar } from '@material/web/labs/navigationbar/navigation-bar';

export type NavigationBarRendererReturn = MdNavigationBar;

export interface NavigationBarContent
  extends BaseContent<
    NavigationBarRendererReturn,
    {
      activeIndex?: number;
      hideInactiveLabels?: boolean;
    }
  > {
  component: 'navigation-bar';
  type: 'navigation-bar';
}
