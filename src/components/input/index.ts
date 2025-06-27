import { TextInputProps as BaseInputProps } from './type';
import { 
    EmailInputProps as EmailInputPropsBase, 
    PhoneInputProps as PhoneInputPropsBase, 
    TooglerInputProps as TooglerInputPropsBase,
    CheckBoxInputProps as CheckBoxInputPropsBase,
    SwitchInputProps as  SwitchInputPropBase
} from './type';
import { NumberInputProps as NumberInputPropsBase } from './type';
import { CustomSliderProps } from './type';
import { LoginInputProps as loginInputPropsBase } from './type';
import { PasswordInputProps as  PasswordInputPropsBase } from './type';
import { DateTimeInputProps } from './type';
import { SelectProps } from './type';
import { LabelTextProps } from './type';  //* labels type
import { ColorPickerProps as ColorPickerPropsBase } from './type';
import { FileLoaderProps as FileLoaderPropsDefault } from './type';
import { AutoCompleteProps as  AutoCompletePropsDefault } from './type';


export type TextInputProps =  LabelTextProps & BaseInputProps;
export type NumberInputProps = LabelTextProps & NumberInputPropsBase;
/** ползунок */
export type SliderInputProps = LabelTextProps & CustomSliderProps;
/** вкл/выкл */
export type SwitchInputProps = SwitchInputPropBase;
export type loginInputProps = LabelTextProps & loginInputPropsBase;
export type PasswordInputProps = LabelTextProps & PasswordInputPropsBase;
export type EmailInputProps = LabelTextProps & EmailInputPropsBase;
export type SelectInputProps = LabelTextProps & SelectProps;
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
export { SwitchInput } from './input.any';
export { CheckBoxInput } from './checkbox';


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