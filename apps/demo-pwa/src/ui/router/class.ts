import { createLogger } from '@gecut/logger';
import {
  cancelNextIdleCallback,
  nextIdleCallback,
} from '@gecut/utilities/polyfill';
import { Router } from '@vaadin/router';

import type { Params, Route } from '@vaadin/router';

export class VaadinRouterHelper {
  constructor(routes: Array<Route>) {
    this.engine.setRoutes([
      // Redirect to URL without trailing slash
      {
        path: '(.*)/',
        action(context, commands) {
          const newPath = context.pathname.slice(0, -1);
          return commands.redirect(newPath);
        },
      },
      ...routes,
    ]);
  }

  engine = new Router();
  lastRouterGo: number | null = null;

  private logger = createLogger('router');

  link(name: string, params?: Params) {
    try {
      const _return = this.engine.urlForName(name, params);

      this.logger.methodFull?.('link', { name, params }, _return);

      return _return;
    } catch (error) {
      this.logger.warning('link', `${name}-not-found`, error);
    }

    return '';
  }

  go(name: string, params?: Params) {
    const path = this.link(name, params);

    this.logger.methodArgs?.('go', { path });

    if (this.lastRouterGo != null) {
      cancelNextIdleCallback(this.lastRouterGo);
    }

    this.lastRouterGo = nextIdleCallback(() => Router.go(path));

    return path;
  }

  set outlet(_outlet: HTMLElement | null) {
    if (_outlet != null && _outlet.role === 'main') {
      this.logger.methodArgs?.('outlet', {
        _outlet,
        isNode: _outlet instanceof Node,
      });

      this.engine.setOutlet(_outlet);
    }
  }

  get params() {
    return this.engine.location.params;
  }

  get location() {
    return this.engine.location;
  }
}
