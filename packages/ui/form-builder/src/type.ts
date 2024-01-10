import type { Rules } from '@gecut/form-validator';
import type { MaybePromise, SingleOrArray } from '@gecut/types';
import type { M3 } from '@gecut/ui-kit';

export type FormTextFieldContent = M3.Types.TextFieldContent & {
  validator?: Rules;
};
export type FormButtonContent = Omit<M3.Types.ButtonContent, 'disabled'> & {
  disabled?: boolean | 'auto' | ((form: Form, slide: FormSlide) => boolean);
  action?: 'next_slide' | 'previous_slide' | 'form_submit';
};
export type FormSelectContent = M3.Types.SelectContent & {
  name?: string;
};
export type FormCheckboxContent = M3.Types.CheckboxContent & {
  label?: string;
};

export type FormComponent =
  | (FormTextFieldContent | FormButtonContent | FormSelectContent)
  | (
      | M3.Types.CheckboxContent
      | M3.Types.CircularProgressContent
      | M3.Types.DialogContent
      | M3.Types.DividerContent
      | M3.Types.DivisionContent
      | M3.Types.FABContent
      | M3.Types.IconButtonContent
      | M3.Types.IconContent
      | M3.Types.ListContent
      | M3.Types.ListItemContent
      | M3.Types.RadioContent
      | M3.Types.SnackBarContent
      | M3.Types.SurfaceCardContent
      | M3.Types.TypoGraphyContent
      | M3.Types.TopAppBarContent
      | M3.Types.IMGContent
    );
export type FormRow = SingleOrArray<FormComponent>;
export type FormSlide = Array<FormRow>;
export type Form = {
  slides: Record<string, FormSlide>;
  onSubmit?: (event: FormOnSubmit) => MaybePromise<void>;
  onChange?: (event: FormOnChange) => MaybePromise<void>;
};

export type FormOnSubmit = {
  ev: Event;
  component: FormComponent;
  form: Form;
  values: FormValues | undefined;
  validate: boolean;
  formBuilderElement: HTMLElement | DocumentFragment;
};
export type FormOnChange = {
  ev: Event;
  component: FormComponent;
  form: Form;
  values: FormValues | undefined;
  validate: boolean;
  formBuilderElement: HTMLElement | DocumentFragment;
};

export type FormValues = Record<string, Record<string, string>>;
