import { BaseInputProps } from './text';
import { 
    EmailInputProps as EmailInputPropsBase, 
    PhoneInputProps as PhoneInputPropsBase, 
    TooglerInputProps as TooglerInputPropsBase,
    CheckBoxInputProps as CheckBoxInputPropsBase,
    SwitchInputProps as  SwitchInputPropBase
} from './input.any';
import { NumberInputProps as NumberInputPropsBase } from './number';
import { CustomSliderProps } from './slider';
import { loginInputProps as loginInputPropsBase } from './login';
import { PasswordInputProps as  PasswordInputPropsBase } from './password';
import { DateTimeInputProps } from './date';
import { BaseSelectProps } from './select';
import { LabelTextProps } from './labels.inputs';  //* labels type
import { ColorPickerProps as ColorPickerPropsBase } from './color';
import { FileLoaderProps as FileLoaderPropsDefault } from './file-loader';
import { AutoCompleteProps as  AutoCompletePropsDefault } from './autocomplete';


export type TextInputProps =  LabelTextProps & BaseInputProps;
export type NumberInputProps = LabelTextProps & NumberInputPropsBase;
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
export type DataPickerInputProps = LabelTextProps & DateTimeInputProps;
export type ColorPickerProps = LabelTextProps & ColorPickerPropsBase;
export type FileLoaderProps = LabelTextProps & FileLoaderPropsDefault;
export type AutoCompleteProps = LabelTextProps & AutoCompletePropsDefault;


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
    LabelFileLoader as FileInput,
    LabelAutocomplete as AutoCompleteInput
} from './labels.inputs';