import type { SettingJsonEntity } from '#persianpart/entities/setting';

import i18n from '@gecut/i18n';
import { MaterialSymbols } from '@gecut/icons/material-symbols';
import { M3 } from '@gecut/ui-kit';

export default (setting: Partial<SettingJsonEntity>) => {
  return M3.Renderers.renderSurfaceCard({
    type: 'elevated',
    attributes: {
      scroller: true,
      styles: {
        padding: 'calc(2 * var(--sys-spacing-track))',
      },
    },
    children: [
      {
        component: 'typography',
        type: 'h2',
        children: [i18n.msg('products-update-history')],
      },
      ...setting.productsHistory
        .map((dateTime) => String(dateTime))
        .filter(
          (dateTime, index, dateTimeList) =>
            dateTimeList.indexOf(dateTime) === index,
        )
        .map(
          (dateTime): M3.Types.ListItemContent => ({
            component: 'list-item',
            type: 'list-item',
            attributes: {
              headline: i18n.date(dateTime),
              supportingText: i18n.time(dateTime),
            },
            children: [
              {
                component: 'icon',
                type: 'svg',
                SVG: MaterialSymbols.OutlineRounded.CalendarMonth,
                attributes: {
                  slot: 'start',
                },
              },
            ],
          }),
        ),
    ],
  });
};
