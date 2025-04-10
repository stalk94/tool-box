import React from 'react';
import Text, { BaseInputProps } from './text';
import Number, { NumberinputProps } from './number';
import Slider, { CustomSliderProps } from './slider';
import Login, { loginInputProps } from './login';
import Password, { PasswordInputProps } from './password';
import { EmailInputProps, PhoneInputProps, TooglerInputProps } from './input.any';
import { EmailInput, PhoneInput, TooglerInput, ColorPicker } from './input.any'
import DatePickerCustom, { DataPickerCustomProps } from './date';
import Select, { BaseSelectProps } from './select';
import { Box } from '@mui/material';
import { Label } from './atomize';
import { SxProps, Theme } from '@mui/system';
import '../../style/fonts.css';


type InputTupe = 'text' | 'password' | 'number' | 'color' | 'phone' | 'email' | 'date' 
| 'time' | 'login' | 'select' | 'slider'
    
type InputCustomLabelProps = {
    label: React.ReactNode
    position?: 'left' | 'right' | 'column'
    typeInput?: InputTupe
    children: React.ReactNode
    sx?: SxProps<Theme>
    id?: string | number
}
export type LabelTextProps = {
    /** ❗ не передав `label` инпут будет без label */
    label?:  React.ReactNode
    /** не передав `position` label не отрисуется но будет лишняя обертка, по этому лучше не передать `label` */
    position?: 'left' | 'right' | 'column'
}



export function LabelInput({ label, position, typeInput, children, sx, id }: InputCustomLabelProps) {
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


export function LabelText({ label, position, ...props }: LabelTextProps & BaseInputProps) {
    if(label && typeof label === 'string' && label.length) return(
        <LabelInput
            label={label}
            position={position}
            id={props.id}
            typeInput='text'
        >
            <Text
                { ...props }
                type='text'
            />
        </LabelInput>
    );
    else return (
        <Text
            { ...props }
            type='text'
        />
    );
}
export function LabelNumber({ label, position, ...props }: LabelTextProps & NumberinputProps) {
    if(label && typeof label === 'string' && label.length) return(
        <LabelInput
            label={label}
            position={position}
            id={props.id}
            typeInput='number'
        >
            <Number
                { ...props }
            />
        </LabelInput>
    );
    else return(
        <Number
            { ...props }
        />
    );
}
export function LabelLogin({ label, position, ...props }: LabelTextProps & loginInputProps) {
    if(label && typeof label === 'string' && label.length) return(
        <LabelInput
            label={label}
            position={position}
            id={props.id}
            typeInput='login'
        >
            <Login
                { ...props }
            />
        </LabelInput>
    );
    else return (
        <Login
            { ...props }
        />
    );
}
export function LabelPassword({ label, position, ...props }: LabelTextProps & PasswordInputProps) {
    if(label && typeof label === 'string' && label.length) return(
        <LabelInput
            label={label}
            position={position}
            id={props.id}
            typeInput='password'
        >
            <Password
                { ...props }
            />
        </LabelInput>
    );
    else return (
        <Password
            { ...props }
        />
    );
}
export function LabelColor({ label, position, ...props }: LabelTextProps & BaseInputProps) {
    if(label && typeof label === 'string' && label.length) return(
        <LabelInput
            label={label}
            position={position}
            id={props.id}
            typeInput='color'
        >
            <ColorPicker
                { ...props }
            />
        </LabelInput>
    );
    else return (
        <ColorPicker
            { ...props }
        />
    );
}
export function LabelEmail({ label, position, ...props }: LabelTextProps & EmailInputProps) {
    if(label && typeof label === 'string' && label.length) return(
        <LabelInput
            label={label}
            position={position}
            id={props.id}
            typeInput='email'
        >
            <EmailInput
                { ...props }
            />
        </LabelInput>
    );
    else return(
        <EmailInput
            { ...props }
        />
    );
}
export function LabelPhone({ label, position, ...props }: LabelTextProps & PhoneInputProps) {
    if(label && typeof label === 'string' && label.length) return(
        <LabelInput
            label={label}
            position={position}
            id={props.id}
            typeInput='phone'
        >
            <PhoneInput
                { ...props }
            />
        </LabelInput>
    );
    else return(
        <PhoneInput
            { ...props }
        />
    );
}
export function LabelDateOrTime({ label, position, ...props }: LabelTextProps & DataPickerCustomProps) {
    if(label && typeof label === 'string' && label.length) return(
        <LabelInput
            label={label}
            position={position}
            id={props.id}
            typeInput={props.isTimePicker ? 'time' : 'date'}
        >
            <DatePickerCustom
                { ...props }
            />
        </LabelInput>
    );
    else return (
        <DatePickerCustom
            { ...props }
        />
    );
}
// ! не показывает выбранный вложенный элемент
export function LabelSelect({ label, position, ...props }: LabelTextProps & BaseSelectProps) {
    if(label && typeof label === 'string' && label.length) return(
        <LabelInput
            label={label}
            position={position}
            id={props.id}
            typeInput='select'
        >
            <Select
                { ...props }
            />
        </LabelInput>
    );
    else return(
        <Select
            { ...props }
        />
    );
}
export function LabelSlider({ label, position, ...props }: LabelTextProps & CustomSliderProps) {
    return(
        <LabelInput
            label={label}
            position={position}
            id={props.id}
            typeInput='slider'
        >
          
            <Slider
                valueLabelDisplay="auto" 
                sx={{
                    ml: position==='column' ? 1 : 0 
                }}

                { ...props }
            />
            
        </LabelInput>
    );
}
/** Это группа переключаемых кнопок */
export function LabelToogler({ label, position, ...props }: LabelTextProps & TooglerInputProps) {
    if(label && typeof label === 'string' && label.length) return(
        <LabelInput
            label={label}
            position={position}
            id={props.id}
            typeInput='toogle'
        >
            <TooglerInput
                label={label}
                { ...props }
            />
        </LabelInput>
    );
    else return(
        <TooglerInput
            label={label}
            { ...props }
        />
    );
}