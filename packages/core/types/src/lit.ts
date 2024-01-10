import type { SingleOrArray } from './type-helper';
import type { TemplateResult, noChange, nothing } from 'lit';

export type RenderResult = SingleOrArray<TemplateResult> | typeof nothing | typeof noChange;
