import type { SurfaceCardContent } from '../types/surface-card';

export const iconMessageCard = (
  message: string,
  iconSVG: string,
  iconColor = 'var(--md-sys-color-primary)',
  type: SurfaceCardContent['type'] = 'filled',
): SurfaceCardContent => ({
  component: 'surface-card',
  type,
  attributes: {
    styles: {
      padding: 'calc(2 * var(--sys-spacing-track))',
      'text-align': 'center',
      color: 'var(--md-sys-color-on-surface-variant)',
    },
  },
  children: [
    {
      component: 'icon',
      type: 'svg',
      SVG: iconSVG,
      attributes: {
        styles: {
          width: 'calc(5 * var(--sys-spacing-track))',
          height: 'calc(5 * var(--sys-spacing-track))',
          margin: ' 0 auto calc(2*var(--sys-spacing-track))',
          color: iconColor,
        },
      },
    },
    message,
  ],
});
