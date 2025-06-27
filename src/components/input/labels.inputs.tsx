import React from 'react';
import Text from './text';
import Number from './number';
import Slider from './slider';
import Login from './login';
import Password from './password';
import { EmailInput, PhoneInput } from './input.any';
import TooglerInput from './toogler';
import ColorPicker from './color';
import DatePickerCustom from './date';
import Select from './select';
import Autocomplete from './autocomplete';
import FileLoader, { FileLoaderCombo } from './file-loader';
import type { 
    AutoCompleteProps, FileLoaderProps, ComboLoaderProps, SelectProps, DateTimeInputProps,
    ColorPickerProps, EmailInputProps, PhoneInputProps, TooglerInputProps, PasswordInputProps,
    LoginInputProps, NumberInputProps, TextInputProps, CustomSliderProps, LabelTextProps
} from './type';
import LabelInput, { InputTupe } from '../text/label';
import '../../style/fonts.css';



function wrapWithLabel <P> (
    typeInput: InputTupe,
    label: React.ReactNode,
    position: 'left' | 'right' | 'column' | undefined,
    Component: React.ReactElement,
    props: { id?: string | number; labelSx?: any, styles?: Record<string, any> }
) {
   
    if (label && typeof label === 'string' && label.length) {
        return (
            <LabelInput
                label={label}
                position={position}
                id={props.id}
                sx={props.labelSx}
                typeInput={typeInput}
                styles={props?.styles}
            >
                { Component }
            </LabelInput>
        );
    }
    return Component;
}


export function LabelText(props: LabelTextProps & TextInputProps) {
    return wrapWithLabel('text', props.label, props.position, <Text {...props} type="text" />, props);
}

export function LabelNumber(props: LabelTextProps & NumberInputProps) {
    return wrapWithLabel('number', props.label, props.position, <Number {...props} />, props);
}

export function LabelLogin(props: LabelTextProps & LoginInputProps) {
    return wrapWithLabel('login', props.label, props.position, <Login {...props} />, props);
}

export function LabelPassword(props: LabelTextProps & PasswordInputProps) {
    return wrapWithLabel('password', props.label, props.position, <Password {...props} />, props);
}

export function LabelColor(props: LabelTextProps & ColorPickerProps) {
    return wrapWithLabel('color', props.label, props.position, <ColorPicker {...props} />, props);
}

export function LabelEmail(props: LabelTextProps & EmailInputProps) {
    return wrapWithLabel('email', props.label, props.position, <EmailInput {...props} />, props);
}

export function LabelPhone(props: LabelTextProps & PhoneInputProps) {
    return wrapWithLabel('phone', props.label, props.position, <PhoneInput {...props} />, props);
}

export function LabelDateOrTime(props: LabelTextProps & DateTimeInputProps) {
    const type = props.type === 'time' ? 'time' : 'date';
    return wrapWithLabel(type, props.label, props.position, <DatePickerCustom {...props} />, props);
}

export function LabelSelect(props: LabelTextProps & SelectProps) {
    return wrapWithLabel('select', props.label, props.position, <Select {...props} />, props);
}

export function LabelAutocomplete(props: LabelTextProps & AutoCompleteProps) {
    return wrapWithLabel('autocomplete', props.label, props.position, <Autocomplete {...props} />, props);
}

export function LabelSlider(props: LabelTextProps & CustomSliderProps) {
    return wrapWithLabel('slider', props.label, props.position, <Slider {...props} />, props);
}


export function LabelToogler(props: LabelTextProps & TooglerInputProps) {
    return wrapWithLabel('toggle', props.label, props.position, <TooglerInput {...props} />, props);
}

export function LabelFileLoader(props: LabelTextProps & FileLoaderProps) {
    return wrapWithLabel('file', props.label, props.position, <FileLoader {...props} />, props);
}

export function LabelComboFileLoader(props: LabelTextProps & ComboLoaderProps) {
    return wrapWithLabel('file-combo', props.label, props.position, <FileLoaderCombo {...props} />, props);
}