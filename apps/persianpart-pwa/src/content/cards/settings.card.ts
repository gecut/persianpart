import { api } from '#persianpart/client';
import type { SettingJsonEntity } from '#persianpart/entities/setting';
import { settingStatusList } from '#persianpart/entities/setting';

import i18n from '@gecut/i18n';
import { request } from '@gecut/signal';
import { M3 } from '@gecut/ui-kit';

export default (setting: Partial<SettingJsonEntity>) => {
  return M3.Renderers.renderSurfaceCard({
    type: 'elevated',
    attributes: {
      styles: {
        display: 'none',
        padding: 'calc(2 * var(--sys-spacing-track))',
        overflow: 'visible',
      },
    },
    children: [
      {
        component: 'typography',
        type: 'h2',
        children: [i18n.msg('application-status')],
      },
      {
        component: 'select',
        type: 'outlined',
        children: settingStatusList.map(
          (status): M3.Types.SelectOptionContent => ({
            component: 'select-option',
            type: 'select-option',
            attributes: {
              value: status,
              headline: i18n.msg(`setting-${status}`),
              multiLineSupportingText: true,
            },
          }),
        ),
        attributes: {
          label: i18n.msg('status'),
          value: setting.status,
        },
        transformers: (target) => {
          target.addEventListener('change', () => {
            target.disabled = true;

            api.setting.set
              .mutate({
                status: target.value,
              })
              .then(() =>
                request('messenger', {
                  attributes: {
                    closeButton: true,
                    message: i18n.msg('settings-successfully-edited'),
                  },
                }),
              )
              .then(() => request('data.settings', {}, 'provideOnly'))
              .finally(() => {
                target.disabled = false;
              });
          });

          return target;
        },
      },
    ],
  });
};
