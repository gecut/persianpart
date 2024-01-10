import '@material/web/iconbutton/filled-icon-button';
import '@material/web/iconbutton/filled-tonal-icon-button';
import '@material/web/iconbutton/icon-button';
import '@material/web/iconbutton/outlined-icon-button';

import { createElementByContent } from './base/base-renderer';

import type {
  IconButtonContent,
  IconButtonRendererReturn,
} from '../types/icon-button';

export function renderIconButton(
  content: Partial<IconButtonContent>,
): IconButtonRendererReturn {
  content.component = 'icon-button';
  content.type ??= 'icon-button';

  const iconButton = createElementByContent(
    content.type !== 'icon-button'
      ? `md-${content.type}-icon-button`
      : 'md-icon-button',
    content,
  );

  if (content.iconSVG != null) {
    iconButton.innerHTML = content.iconSVG;
  }

  return iconButton;
}
