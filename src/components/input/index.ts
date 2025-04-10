import { BaseInputProps } from './text';
import { 
    EmailInputProps as EmailInputPropsBase, 
    PhoneInputProps as PhoneInputPropsBase, 
    TooglerInputProps as TooglerInputPropsBase,
    CheckBoxInputProps as CheckBoxInputPropsBase,
    ColorPickerProps as ColorPickerPropsBase,
    SwitchInputProps as  SwitchInputPropBase
} from './input.any';
import { NumberinputProps as NumberinputPropsBase } from './number';
import { CustomSliderProps } from './slider';
import { loginInputProps as loginInputPropsBase } from './login';
import { PasswordInputProps as  PasswordInputPropsBase } from './password';
import { DataPickerCustomProps } from './date';
import { BaseSelectProps } from './select';
import { LabelTextProps } from './labels.inputs';  //* labels type



export type TextInputProps =  LabelTextProps & BaseInputProps;
export type NumberInputProps = LabelTextProps & NumberinputPropsBase;
/** ползунок */
export type SliderInputProps = LabelTextProps & CustomSliderProps;
/** вкл/выкл */
export type SwitchInputProps = SwitchInputPropBase;
export type loginInputProps = LabelTextProps & loginInputPropsBase;
export type PasswordInputProps = LabelTextProps & PasswordInputPropsBase;
export type EmailInputProps = LabelTextProps & EmailInputPropsBase;
export type SelectInputProps = LabelTextProps & BaseSelectProps;
export type PhoneInputProps = LabelTextProps & PhoneInputPropsBase;
/** группа кнопок */
export type ToogleeInputProps = LabelTextProps & TooglerInputPropsBase;
/** ✔ ☐ */
export type CheckBoxInputProps = LabelTextProps & CheckBoxInputPropsBase;
/** дата или время */
export type DataPickerInputProps = LabelTextProps & DataPickerCustomProps;
export type ColorPickerProps = LabelTextProps & ColorPickerPropsBase;


// особенные
export {
    /** вкл/выкл */
    SwitchInput,
    /** ✔ ☐ */
    CheckBoxInput
} from './input.any';

export {
    LabelText as TextInput,
    LabelNumber as NumberInput,
    LabelColor as ColorInput,
    /** ползунок */
    LabelSlider as SliderInput,
    /** дата и время */
    LabelDateOrTime as DateInput,
    LabelEmail as EmailInput,
    LabelLogin as LoginInput,
    LabelPhone as PhoneInput,
    LabelPassword as PasswordInput,
    /** группа кнопок */
    LabelToogler as ToggleInput,
    /** Выпадающий список */
    LabelSelect as SelectInput,
} from './labels.inputs';