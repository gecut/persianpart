import type { BaseContent } from './base/base-content';
import type { MdNavigationTab } from '@material/web/labs/navigationtab/navigation-tab';

export type NavigationTabRendererReturn = MdNavigationTab;

export interface NavigationTabContent
  extends BaseContent<
    NavigationTabRendererReturn,
    {
      disabled?: boolean;
      active?: boolean;
      hideInactiveLabel?: boolean;
      label?: string;
      badgeValue?: string;
      showBadge?: boolean;
    }
  > {
  component: 'navigation-tab';
  type: 'navigation-tab';
}
