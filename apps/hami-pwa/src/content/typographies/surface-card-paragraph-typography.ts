import type { M3 } from '@gecut/ui-kit';

export function paragraphTypography(
  options?: Partial<M3.Types.TypoGraphyContent>,
): M3.Types.TypoGraphyContent {
  return {
    component: 'typography',
    type: 'p',

    ...options,

    attributes: {
      classes: ['surface-card__paragraph'],

      ...options?.attributes,
    },
  };
}

export function paragraphTypographies(
  children: string[],
  options?: Partial<M3.Types.TypoGraphyContent>,
): M3.Types.TypoGraphyContent[] {
  return children.map((child) =>
    paragraphTypography({ children: [child], ...options }),
  );
}
