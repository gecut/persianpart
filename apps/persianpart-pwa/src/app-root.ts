/* eslint-disable import/order */

import i18n from '@gecut/i18n';
import './config';
import 'element-internals-polyfill';
import '@material/web/all';

i18n.set('fa-IR');

import '@gecut/common/styles/pwa.css';
import '@gecut/common/styles/mobile-only.css';
// // import '@gecut/common/styles/theme/palettes/cadmium-green.css';
import '@gecut/common/styles/theme/palettes/prophet-violet.css';
import '@gecut/common/styles/tokens.css';
import '@gecut/form-builder';
import '@lit-labs/virtualizer';
import 'unfonts.css';

import './providers/data';
import './providers/loading';
import './providers/fullscreen-loader';
import './ui/app/app.element';
import './ui/stylesheets/styles.css';
import { registerSW } from 'virtual:pwa-register';
import { request } from '@gecut/signal';

const sw = registerSW({
  onRegisterError: () => {
    request('messenger', {
      attributes: {
        message: i18n.msg('$register-error'),
      },
    });
  },
  onOfflineReady: () => {
    request('messenger', {
      attributes: {
        message: i18n.msg('$offline-ready'),
      },
    });
  },
  onNeedRefresh: () => {
    request('messenger', {
      attributes: {
        duration: -1,
        message: i18n.msg('$need-refresh'),
      },
      children: [
        {
          component: 'button',
          type: 'text',
          attributes: {
            variant: 'primary',
            slot: 'action',
          },
          children: [i18n.msg('update')],
          events: {
            click: () => sw(true),
          },
        },
      ],
    });
  },
});

sw();
