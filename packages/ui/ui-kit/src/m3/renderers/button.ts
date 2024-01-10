import '@material/web/button/elevated-button';
import '@material/web/button/filled-button';
import '@material/web/button/filled-tonal-button';
import '@material/web/button/outlined-button';
import '@material/web/button/text-button';

import { createElementByContent } from './base/base-renderer';

import type {
  ButtonContent,
  ButtonRendererReturn,
  ButtonVariantStyle,
} from '../types/button';

export function renderButton(
  content: Partial<ButtonContent>,
): ButtonRendererReturn {
  content.component = 'button';
  content.type ??= 'elevated';

  if (content.attributes?.variant != null) {
    content.attributes.styles = {
      ...content.attributes.styles,

      ...variantStyles[content.type][content.attributes?.variant],
    };
  }

  return createElementByContent(`md-${content.type}-button`, content);
}

const variantStyles: ButtonVariantStyle = {
  'filled': {
    primary: {
      '--_container-color': 'var(--md-sys-color-primary)',
      '--_focus-label-text-color': 'var(--md-sys-color-on-primary)',
      '--_hover-label-text-color': 'var(--md-sys-color-on-primary)',
      '--_hover-state-layer-color': 'var(--md-sys-color-on-primary)',
      '--_label-text-color': 'var(--md-sys-color-on-primary)',
      '--_icon-color': 'var(--md-sys-color-on-primary)',
      '--_pressed-label-text-color': 'var(--md-sys-color-on-primary)',
      '--_pressed-state-layer-color': 'var(--md-sys-color-on-primary)',
      '--_with-icon-focus-icon-color': 'var(--md-sys-color-on-primary)',
      '--_with-icon-hover-icon-color': 'var(--md-sys-color-on-primary)',
      '--_with-icon-icon-color': 'var(--md-sys-color-on-primary)',
      '--_with-icon-pressed-icon-color': 'var(--md-sys-color-on-primary)',
    },
    secondary: {
      '--_container-color': 'var(--md-sys-color-secondary)',
      '--_focus-label-text-color': 'var(--md-sys-color-on-secondary)',
      '--_hover-label-text-color': 'var(--md-sys-color-on-secondary)',
      '--_hover-state-layer-color': 'var(--md-sys-color-on-secondary)',
      '--_label-text-color': 'var(--md-sys-color-on-secondary)',
      '--_icon-color': 'var(--md-sys-color-on-secondary)',
      '--_pressed-label-text-color': 'var(--md-sys-color-on-secondary)',
      '--_pressed-state-layer-color': 'var(--md-sys-color-on-secondary)',
      '--_with-icon-focus-icon-color': 'var(--md-sys-color-on-secondary)',
      '--_with-icon-hover-icon-color': 'var(--md-sys-color-on-secondary)',
      '--_with-icon-icon-color': 'var(--md-sys-color-on-secondary)',
      '--_with-icon-pressed-icon-color': 'var(--md-sys-color-on-secondary)',
    },
    tertiary: {
      '--_container-color': 'var(--md-sys-color-tertiary)',
      '--_focus-label-text-color': 'var(--md-sys-color-on-tertiary)',
      '--_hover-label-text-color': 'var(--md-sys-color-on-tertiary)',
      '--_hover-state-layer-color': 'var(--md-sys-color-on-tertiary)',
      '--_label-text-color': 'var(--md-sys-color-on-tertiary)',
      '--_icon-color': 'var(--md-sys-color-on-tertiary)',
      '--_pressed-label-text-color': 'var(--md-sys-color-on-tertiary)',
      '--_pressed-state-layer-color': 'var(--md-sys-color-on-tertiary)',
      '--_with-icon-focus-icon-color': 'var(--md-sys-color-on-tertiary)',
      '--_with-icon-hover-icon-color': 'var(--md-sys-color-on-tertiary)',
      '--_with-icon-icon-color': 'var(--md-sys-color-on-tertiary)',
      '--_with-icon-pressed-icon-color': 'var(--md-sys-color-on-tertiary)',
    },
    error: {
      '--_container-color': 'var(--md-sys-color-error)',
      '--_focus-label-text-color': 'var(--md-sys-color-on-error)',
      '--_hover-label-text-color': 'var(--md-sys-color-on-error)',
      '--_hover-state-layer-color': 'var(--md-sys-color-on-error)',
      '--_label-text-color': 'var(--md-sys-color-on-error)',
      '--_icon-color': 'var(--md-sys-color-on-error)',
      '--_pressed-label-text-color': 'var(--md-sys-color-on-error)',
      '--_pressed-state-layer-color': 'var(--md-sys-color-on-error)',
      '--_with-icon-focus-icon-color': 'var(--md-sys-color-on-error)',
      '--_with-icon-hover-icon-color': 'var(--md-sys-color-on-error)',
      '--_with-icon-icon-color': 'var(--md-sys-color-on-error)',
      '--_with-icon-pressed-icon-color': 'var(--md-sys-color-on-error)',
    },
  },
  'elevated': {
    primary: {},
    secondary: {},
    tertiary: {},
    error: {},
  },
  'outlined': {
    primary: {},
    secondary: {},
    tertiary: {},
    error: {},
  },
  'text': {
    primary: {},
    secondary: {},
    tertiary: {},
    error: {},
  },
  'filled-tonal': {
    primary: {
      '--_container-color': 'var(--md-sys-color-primary-container)',
      '--_focus-label-text-color': 'var(--md-sys-color-on-primary-container)',
      '--_hover-label-text-color': 'var(--md-sys-color-on-primary-container)',
      '--_hover-state-layer-color': 'var(--md-sys-color-on-primary-container)',
      '--_label-text-color': 'var(--md-sys-color-on-primary-container)',
      '--_icon-color': 'var(--_pressed-state-layer-color)',
      '--_pressed-label-text-color': 'var(--md-sys-color-on-primary-container)',
      '--_pressed-state-layer-color':
        'var(--md-sys-color-on-primary-container)',
      '--_with-icon-focus-icon-color':
        'var(--md-sys-color-on-primary-container)',
      '--_with-icon-hover-icon-color':
        'var(--md-sys-color-on-primary-container)',
      '--_with-icon-icon-color': 'var(--md-sys-color-on-primary-container)',
      '--_with-icon-pressed-icon-color':
        'var(--md-sys-color-on-primary-container)',
    },
    secondary: {
      '--_container-color': 'var(--md-sys-color-secondary-container)',
      '--_focus-label-text-color': 'var(--md-sys-color-on-secondary-container)',
      '--_hover-label-text-color': 'var(--md-sys-color-on-secondary-container)',
      '--_hover-state-layer-color':
        'var(--md-sys-color-on-secondary-container)',
      '--_label-text-color': 'var(--md-sys-color-on-secondary-container)',
      '--_icon-color': 'var(--md-sys-color-on-secondary-container)',
      '--_pressed-label-text-color':
        'var(--md-sys-color-on-secondary-container)',
      '--_pressed-state-layer-color':
        'var(--md-sys-color-on-secondary-container)',
      '--_with-icon-focus-icon-color':
        'var(--md-sys-color-on-secondary-container)',
      '--_with-icon-hover-icon-color':
        'var(--md-sys-color-on-secondary-container)',
      '--_with-icon-icon-color': 'var(--md-sys-color-on-secondary-container)',
      '--_with-icon-pressed-icon-color':
        'var(--md-sys-color-on-secondary-container)',
    },
    tertiary: {
      '--_container-color': 'var(--md-sys-color-tertiary-container)',
      '--_focus-label-text-color': 'var(--md-sys-color-on-tertiary-container)',
      '--_hover-label-text-color': 'var(--md-sys-color-on-tertiary-container)',
      '--_hover-state-layer-color': 'var(--md-sys-color-on-tertiary-container)',
      '--_label-text-color': 'var(--md-sys-color-on-tertiary-container)',
      '--_icon-color': 'var(--md-sys-color-on-tertiary-container)',
      '--_pressed-label-text-color':
        'var(--md-sys-color-on-tertiary-container)',
      '--_pressed-state-layer-color':
        'var(--md-sys-color-on-tertiary-container)',
      '--_with-icon-focus-icon-color':
        'var(--md-sys-color-on-tertiary-container)',
      '--_with-icon-hover-icon-color':
        'var(--md-sys-color-on-tertiary-container)',
      '--_with-icon-icon-color': 'var(--md-sys-color-on-tertiary-container)',
      '--_with-icon-pressed-icon-color':
        'var(--md-sys-color-on-tertiary-container)',
    },
    error: {
      '--_container-color': 'var(--md-sys-color-error-container)',
      '--_focus-label-text-color': 'var(--md-sys-color-on-error-container)',
      '--_hover-label-text-color': 'var(--md-sys-color-on-error-container)',
      '--_hover-state-layer-color': 'var(--md-sys-color-on-error-container)',
      '--_label-text-color': 'var(--md-sys-color-on-error-container)',
      '--_icon-color': 'var(--md-sys-color-on-error-container)',
      '--_pressed-label-text-color': 'var(--md-sys-color-on-error-container)',
      '--_pressed-state-layer-color': 'var(--md-sys-color-on-error-container)',
      '--_with-icon-focus-icon-color': 'var(--md-sys-color-on-error-container)',
      '--_with-icon-hover-icon-color': 'var(--md-sys-color-on-error-container)',
      '--_with-icon-icon-color': 'var(--md-sys-color-on-error-container)',
      '--_with-icon-pressed-icon-color':
        'var(--md-sys-color-on-error-container)',
    },
  },
};
