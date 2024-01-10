import '../components/surface-card';

import { createElementByContent } from './base/base-renderer';

import type {
  SurfaceCardContent,
  SurfaceCardRendererReturn,
} from '../types/surface-card';

export function renderSurfaceCard(
  content: Partial<SurfaceCardContent>,
): SurfaceCardRendererReturn {
  content.component = 'surface-card';
  content.type ??= 'elevated';

  content.attributes ??= {};
  content.attributes['type'] ??= content.type;

  return createElementByContent('surface-card', content);
}
