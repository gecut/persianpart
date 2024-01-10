import type {
  AllComponentsContent,
  DialogContent,
  DivisionContent,
  IconContent,
} from '../types/types';

export const dialog = (
  headlines: (AllComponentsContent | string)[],
  contents: (AllComponentsContent | string)[],
  actions: AllComponentsContent[] = [],
  icon?: IconContent,
  options: DialogContent['attributes'] = {},
  closeButton = true,
): DialogContent => {
  const formId = `dialog-form-${new Date().getTime().toString(16)}`;

  options.styles ??= {};
  options.styles.height = 'max-content';

  if (icon != null) {
    icon.attributes ??= {};
    icon.attributes.slot = 'icon';

    icon.attributes.styles ??= {};
    icon.attributes.styles['margin-top'] ??= '20px';
  }

  if (closeButton === true) {
    headlines = [
      {
        component: 'icon-button',
        type: 'icon-button',
        iconSVG:
          '<svg><path fill="currentColor" d="m12 13.4l-4.9 4.9q-.275.275-.7.275t-.7-.275q-.275-.275-.275-.7t.275-.7l4.9-4.9l-4.9-4.9q-.275-.275-.275-.7t.275-.7q.275-.275.7-.275t.7.275l4.9 4.9l4.9-4.9q.275-.275.7-.275t.7.275q.275.275.275.7t-.275.7L13.4 12l4.9 4.9q.275.275.275.7t-.275.7q-.275.275-.7.275t-.7-.275L12 13.4Z"/></svg>',
      },

      ...headlines,
    ];
  }

  for (const headline of headlines) {
    if (
      typeof headline !== 'string' &&
      (headline.component === 'button' || headline.component === 'icon-button')
    ) {
      headline.attributes ??= {};
      headline.attributes['form'] = formId;
    }
  }
  for (const action of actions) {
    if (action.component === 'button' || action.component === 'icon-button') {
      action.attributes ??= {};
      action.attributes['form'] = formId;
    }
  }

  const headlineContent: DivisionContent | '' =
    headlines.length > 0 ?
      {
          component: 'division',
          type: 'div',
          attributes: {
            slot: 'headline',
            styles: {
              'font-size': '22px',
            },
          },
          children: headlines,
        } :
      '';

  return {
    component: 'dialog',
    type: 'dialog',
    attributes: options,
    children: [
      icon != null ? icon : '',
      headlineContent,
      {
        component: 'division',
        type: 'form',
        attributes: {
          id: formId,
          slot: 'content',
          method: 'dialog',
          styles: {
            overflow: 'auto',
            padding: '4px',
            height: 'max-content',
          },
        },
        children: contents,
      },
      {
        component: 'division',
        type: 'div',
        attributes: {
          slot: 'actions',
          hidden: actions.length === 0,
        },
        children: actions,
      },
    ],
  };
};
