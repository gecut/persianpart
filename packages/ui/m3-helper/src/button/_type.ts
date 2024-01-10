import type { IconContent } from "../icon";

export interface ButtonContent {
  text: string;

  icon?: IconContent;

  form?: string;
  href?: string;
  target?: '' | '_blank' | '_parent' | '_self' | '_top';
  name?: string;
  value?: string;

  hasIcon?: boolean;
  trailingIcon?: boolean;
  disabled?: boolean;
}
