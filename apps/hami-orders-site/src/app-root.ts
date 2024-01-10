/* eslint-disable import/order */

import i18n from '@gecut/i18n';
import { initRouter } from './ui/router';
import 'element-internals-polyfill';

i18n.set('fa-IR');
initRouter();

import '@gecut/common/styles/pwa.css';
import 'unfonts.css';

import './providers/index';
import './ui/app/app.element';
import './ui/stylesheets/styles.scss';
import './ui/stylesheets/element.scss';

