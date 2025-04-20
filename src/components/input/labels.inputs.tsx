import React from 'react';
import Text, { BaseInputProps } from './text';
import Number, { NumberInputProps } from './number';
import Slider, { CustomSliderProps } from './slider';
import Login, { loginInputProps } from './login';
import Password, { PasswordInputProps } from './password';
import { EmailInputProps, PhoneInputProps, TooglerInputProps } from './input.any';
import { EmailInput, PhoneInput, TooglerInput } from './input.any'
import ColorPicker, { ColorPickerProps } from './color';
import DatePickerCustom, { DateTimeInputProps } from './date';
import Select, { BaseSelectProps } from './select';
import Autocomplete, { AutoCompleteProps } from './autocomplete';
import { Box } from '@mui/material';
import { Label } from './atomize';
import { SxProps, Theme } from '@mui/system';
import FileLoader, { FileLoaderProps } from './file-loader';
import '../../style/fonts.css';


type InputTupe = 'text' 
    | 'password' 
    | 'number' 
    | 'color' 
    | 'phone' 
    | 'email' 
    | 'date' 
    | 'time' 
    | 'login' 
    | 'select' 
    | 'slider'
    | 'autocomplete'
    | 'file';
    
type InputCustomLabelProps = {
    label: React.ReactNode
    position?: 'left' | 'right' | 'column'
    typeInput?: InputTupe
    children: React.ReactNode
    styles?: any
    sx?: SxProps<Theme>
    id?: string | number
}
export type LabelTextProps = {
    /** ❗ не передав `label` инпут будет без label */
    label?:  React.ReactNode
    /** не передав `position` label не отрисуется но будет лишняя обертка, по этому лучше не передать `label` */
    position?: 'left' | 'right' | 'column'
    labelSx?: SxProps
}


function wrapWithLabel<P>(
    typeInput: InputTupe,
    label: React.ReactNode,
    position: 'left' | 'right' | 'column' | undefined,
    Component: React.ReactElement,
    props: { id?: string | number; labelSx?: any, styles:Record<string, any> }
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
export function LabelInput({ label, position, typeInput, children, sx, id, styles }: InputCustomLabelProps) {
    const idRef = React.useRef(`input-${typeInput}-${id ?? Date.now()}`).current;       // можно отслеживать
    
    return(
        <Box sx={{mt: 1.5}}
            display="flex" 
            flexDirection={(position==='left' || position==='right') ? 'row' : 'column'} 
        >
            { position === 'left' && 
                <Label 
                    id={idRef}
                    children={label} 
                    sx={{
                        flex: 0.7,
                        mr: 0,
                        fontSize: 18,
                        ...sx
                    }}
                />
            }
            { position === 'column' && 
                <Label 
                    id={idRef}
                    children={label} 
                    styles={styles}
                    sx={{
                        flex: 1,
                        ml: 0.5,
                        fontSize: 18,
                        mb: 0.5,
                        ...sx
                    }}
                />
            }
            <Box sx={{ flex: 2 }}>
                { React.cloneElement(children, {id: idRef}) }
            </Box>

            { position === 'right' && 
                <Label 
                    id={idRef} 
                    children={label}
                    sx={{
                        flex: 1,
                        ml: 2,
                        fontSize: 20,
                        ...sx
                    }}
                />
            }
        </Box>
    );
}


export function LabelText(props: LabelTextProps & BaseInputProps) {
    return wrapWithLabel('text', props.label, props.position, <Text {...props} type="text" />, props);
}

export function LabelNumber(props: LabelTextProps & NumberInputProps) {
    return wrapWithLabel('number', props.label, props.position, <Number {...props} />, props);
}

export function LabelLogin(props: LabelTextProps & loginInputProps) {
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

export function LabelSelect(props: LabelTextProps & BaseSelectProps) {
    return wrapWithLabel('select', props.label, props.position, <Select {...props} />, props);
}

export function LabelAutocomplete(props: LabelTextProps & AutoCompleteProps) {
    return wrapWithLabel('autocomplete', props.label, props.position, <Autocomplete {...props} />, props);
}

export function LabelSlider(props: LabelTextProps & CustomSliderProps) {
    return wrapWithLabel('slider', props.label, props.position, <Slider {...props} />, props);
}

export function LabelToogler(props: LabelTextProps & TooglerInputProps) {
    return wrapWithLabel('toogle', props.label, props.position, <TooglerInput {...props} />, props);
}

export function LabelFileLoader(props: LabelTextProps & FileLoaderProps) {
    return wrapWithLabel('file', props.label, props.position, <FileLoader {...props} />, props);
}