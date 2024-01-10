import '@material/web/progress/circular-progress';

import { createElementByContent } from './base/base-renderer';

import type {
  CircularProgressContent,
  CircularProgressRendererReturn,
} from '../types/circular-progress';

export function renderCircularProgress(
  content: Partial<CircularProgressContent>,
): CircularProgressRendererReturn {
  content.component = 'circular-progress';
  content.type = 'circular-progress';

  return createElementByContent('md-circular-progress', content);
}
