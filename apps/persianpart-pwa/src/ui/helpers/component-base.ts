import elementStyle from '#persianpart/ui/stylesheets/element.css?inline';

import { signalElement } from '@gecut/mixins';
import { unsafeCSS } from 'lit';

export abstract class ComponentBase extends signalElement {
  static signals = {};
  static override styles = [unsafeCSS(elementStyle)];
}
