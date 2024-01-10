import { createLogger } from '@gecut/logger';
import { untilNextFrame } from '@gecut/utilities/delay';
import { cancelNextIdleCallback, nextIdleCallback } from '@gecut/utilities/polyfill';
import { Router } from '@vaadin/router';

import { routes } from './routes';

import type { Params, ParamValue } from '@vaadin/router';

const logger = createLogger('router');
const router = new Router();

export const attachRouter = (
  outlet: HTMLElement | null,
  onInit?: () => void,
) => {
  if (outlet != null && outlet.role === 'main') {
    logger.methodArgs?.('attachRouter', {
      outlet,
      isNode: outlet instanceof Node,
    });

    router.setOutlet(outlet);
  }

  initRouter();

  onInit?.();
};

export const initRouter = async () => {
  await untilNextFrame();

  router.setRoutes([
    // Redirect to URL without trailing slash
    {
      path: '(.*)/',
      action: (context, commands) => {
        const newPath = context.pathname.slice(0, -1);
        return commands.redirect(newPath);
      },
    },
    ...routes,
  ]);
};

export const urlForName = (name: string, params?: Params) => {
  try {
    const _return = router.urlForName(name, params);

    logger.methodFull?.('urlForName', { name, params }, _return);

    return _return;
  } catch (error) {
    logger.warning('urlForName', `${name}-not-found`, error);
  }

  return '';
};

let lastRouterGo: number | null = null;

export const routerGo = (name: string, params?: Params) => {
  const path = urlForName(name, params);

  logger.methodArgs?.('routerGo', { path });

  if (lastRouterGo != null) {
    cancelNextIdleCallback(lastRouterGo);
  }

  lastRouterGo = nextIdleCallback(() => Router.go(path));

  return path;
};

export const getVariableFromUrl = (varName: string): ParamValue => {
  return router.location.params[varName];
};

export const getLocation = () => {
  return router.location;
};
