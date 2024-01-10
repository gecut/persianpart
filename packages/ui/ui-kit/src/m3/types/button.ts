import type { BaseContent } from './base/base-content';
import type { MdElevatedButton } from '@material/web/button/elevated-button';
import type { MdFilledButton } from '@material/web/button/filled-button';
import type { MdFilledTonalButton } from '@material/web/button/filled-tonal-button';
import type { MdOutlinedButton } from '@material/web/button/outlined-button';
import type { MdTextButton } from '@material/web/button/text-button';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'error';
export type ButtonVariantStyle = Record<
  ButtonContent['type'],
  Record<ButtonVariant, Record<string, string>>
>;

export type ButtonRendererReturn =
  | MdElevatedButton
  | MdFilledButton
  | MdOutlinedButton
  | MdTextButton
  | MdFilledTonalButton;

export interface ButtonContent
  extends BaseContent<
    ButtonRendererReturn,
    {
      variant?: ButtonVariant;
      /**
       * Whether or not the button is disabled.
       */
      disabled?: boolean;
      /**
       * The URL that the link button points to.
       */
      href?: string;
      /**
       * Where to display the linked `href` URL for a link button. Common options
       * include `_blank` to open in a new tab.
       */
      target?: string;
      /**
       * Whether to render the icon at the inline end of the label rather than the
       * inline start.
       *
       * _Note:_ Link buttons cannot have trailing icons.
       */
      trailingIcon?: boolean;
      /**
       * Whether to display the icon or not.
       */
      hasIcon?: boolean;
      /**
       * Whether `preventDefault()` should be called on the underlying button.
       * Useful for preventing certain native functionalities like preventing form
       * submissions.
       */
      preventClickDefault?: boolean;
    }
  > {
  component: 'button';
  type: 'elevated' | 'filled' | 'outlined' | 'text' | 'filled-tonal';
}
