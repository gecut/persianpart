import i18n from '@gecut/i18n';
import { MaterialSymbols } from '@gecut/icons/material-symbols';

import type { M3 } from '@gecut/ui-kit';

type Tabs = Partial<
  Record<
    'profile' | 'users' | 'home' | 'orders' | 'support' | 'settings',
    boolean
  >
>;

export function bottomNavigation(
  tabs: Tabs = {
    orders: false,
    users: false,
    settings: false,
  },
): M3.Types.NavigationTabContent[] {
  return [
    {
      component: 'navigation-tab',
      type: 'navigation-tab',
      attributes: {
        label: i18n.msg('settings'),
        href: 'settings',
        id: 'tab-settings',
        hidden: !(tabs.settings ?? true),
      },
      children: [
        {
          component: 'icon',
          type: 'svg',
          SVG: MaterialSymbols.FilledRounded.Settings,
          attributes: {
            slot: 'activeIcon',
          },
        },
        {
          component: 'icon',
          type: 'svg',
          SVG: MaterialSymbols.OutlineRounded.Settings,
          attributes: {
            slot: 'inactiveIcon',
          },
        },
      ],
    },
    {
      component: 'navigation-tab',
      type: 'navigation-tab',
      attributes: {
        label: i18n.msg('support'),
        href: 'support',
        id: 'tab-support',
        hidden: !(tabs.support ?? true),
      },
      children: [
        {
          component: 'icon',
          type: 'svg',
          SVG: MaterialSymbols.Filled.Call,
          attributes: {
            slot: 'activeIcon',
          },
        },
        {
          component: 'icon',
          type: 'svg',
          SVG: MaterialSymbols.Outline.Call,
          attributes: {
            slot: 'inactiveIcon',
          },
        },
      ],
    },
    {
      component: 'navigation-tab',
      type: 'navigation-tab',
      attributes: {
        label: i18n.msg('orders'),
        href: 'orders-categories',
        id: 'tab-orders',
        hidden: !(tabs.orders ?? true),
      },
      children: [
        {
          component: 'icon',
          type: 'svg',
          SVG: MaterialSymbols.FilledRounded.Grading,
          attributes: {
            slot: 'activeIcon',
          },
        },
        {
          component: 'icon',
          type: 'svg',
          SVG: MaterialSymbols.FilledRounded.Grading,
          attributes: {
            slot: 'inactiveIcon',
          },
        },
      ],
    },
    {
      component: 'navigation-tab',
      type: 'navigation-tab',
      attributes: {
        label: i18n.msg('home'),
        href: 'home',
        id: 'tab-home',
        hidden: !(tabs.home ?? true),
      },
      children: [
        {
          component: 'icon',
          type: 'svg',
          SVG: MaterialSymbols.FilledRounded.Home,
          attributes: {
            slot: 'activeIcon',
          },
        },
        {
          component: 'icon',
          type: 'svg',
          SVG: MaterialSymbols.OutlineRounded.Home,
          attributes: {
            slot: 'inactiveIcon',
          },
        },
      ],
    },
    {
      component: 'navigation-tab',
      type: 'navigation-tab',
      attributes: {
        label: i18n.msg('users'),
        href: 'user-list',
        id: 'tab-users',
        hidden: !(tabs.users ?? true),
      },
      children: [
        {
          component: 'icon',
          type: 'svg',
          SVG: MaterialSymbols.FilledRounded.Group,
          attributes: {
            slot: 'activeIcon',
          },
        },
        {
          component: 'icon',
          type: 'svg',
          SVG: MaterialSymbols.OutlineRounded.Group,
          attributes: {
            slot: 'inactiveIcon',
          },
        },
      ],
    },
    {
      component: 'navigation-tab',
      type: 'navigation-tab',
      attributes: {
        label: i18n.msg('profile'),
        href: 'user-profile',
        id: 'tab-profile',
        hidden: !(tabs.profile ?? true),
      },
      children: [
        {
          component: 'icon',
          type: 'svg',
          SVG: MaterialSymbols.FilledRounded.Person,
          attributes: {
            slot: 'activeIcon',
          },
        },
        {
          component: 'icon',
          type: 'svg',
          SVG: MaterialSymbols.OutlineRounded.Person,
          attributes: {
            slot: 'inactiveIcon',
          },
        },
      ],
    },
  ];
}
