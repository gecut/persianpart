import { GecutLog } from '@gecut/log';
import { Directive, PartType } from 'lit/directive.js';

import type { Part, PartInfo } from 'lit/directive.js';

export abstract class GecutDirective extends Directive {
  constructor(partInfo: PartInfo, debugName: string) {
    super(partInfo);

    this.log = new GecutLog(debugName);

    this.log.methodArgs?.(
      'constructor',
      Object.keys(PartType)[partInfo.type - 1],
    );
  }

  protected log;

  override update(_part: Part, props: unknown[]): unknown {
    this.log.methodArgs?.('update', props);

    return this.render(...props);
  }
}
