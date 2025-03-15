import React from 'react';
import In, { BaseInputProps, NumberinputProps, PasswordInputProps } from './input';
import { EmailInputProps, PhoneInputProps } from './input.any'
import Select, { BaseSelectProps } from '../select';
import { InputLabel, useTheme, Box , InputLabelProps } from '@mui/material';
import { SxProps, Theme } from '@mui/system';
import '../../style/fonts.css';


type InputCustomLabelProps = {
    label: string
    position?: 'left' | 'right' | 'column'
    typeInput?: 'text' | 'password' | 'number' | 'color' | 'phone' | 'email' | 'date' | 'time'
    children: React.ReactNode
    sx?: SxProps<Theme>
}
type LabelTextProps = {
    label: string
    position?: 'left' | 'right' | 'column'
}



function Label({ id, children, sx }: InputLabelProps) {
    const theme = useTheme();
    
    return(
        <InputLabel 
            htmlFor={id}
            sx={{
                ml: 1,
                mt: 'auto',
                mb: 'auto',
                opacity: 0.9,
                color: theme.palette.text.secondary,
                fontFamily: '"Roboto Condensed", Arial, sans-serif',
                ...sx
            }}
        >
            { children }
        </InputLabel>
    );
}
function LabelInput({ label, position, typeInput, children, sx }: InputCustomLabelProps) {
    const id = `input-${typeInput}-${Date.now()}`;


    return(
        <Box sx={{mt: 1.5}}
            display="flex" 
            flexDirection={(position==='left' || position==='right') ? 'row' : 'column'} 
        >
            { position === 'left' && 
                <Label 
                    id={id}
                    children={label} 
                    sx={{
                        flex: 1,
                        mr: 2,
                        fontSize: 18,
                        ...sx
                    }}
                />
            }
            { position === 'column' && 
                <Label 
                    id={id}
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
            <Box sx={{ flex: 3 }}>
                { React.cloneElement(children, {id: id}) }
            </Box>

            { position === 'right' && 
                <Label 
                    id={id} 
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
    return(
        <LabelInput
            label={label}
            position={position}
            typeInput='text'
        >
            <In.Input
                type='text'
                { ...props }
            />
        </LabelInput>
    );
}
export function LabelLogin({ label, position, ...props }: LabelTextProps & BaseInputProps) {
    return(
        <LabelInput
            label={label}
            position={position}
            typeInput='text'
        >
            <In.LoginInput
                type='text'
                { ...props }
            />
        </LabelInput>
    );
}
export function LabelPassword({ label, position, ...props }: LabelTextProps & PasswordInputProps) {
    return(
        <LabelInput
            label={label}
            position={position}
            typeInput='password'
        >
            <In.PasswordInput
                { ...props }
            />
        </LabelInput>
    );
}
export function LabelColor({ label, position, ...props }: LabelTextProps & BaseInputProps) {
    return(
        <LabelInput
            label={label}
            position={position}
            typeInput='color'
        >
            <In.ColorPicker
                { ...props }
            />
        </LabelInput>
    );
}
export function LabelEmail({ label, position, ...props }: LabelTextProps & EmailInputProps) {
    return(
        <LabelInput
            label={label}
            position={position}
            typeInput='email'
        >
            <In.EmailInput
                { ...props }
            />
        </LabelInput>
    );
}
export function LabelPhone({ label, position, ...props }: LabelTextProps & PhoneInputProps) {
    return(
        <LabelInput
            label={label}
            position={position}
            typeInput='phone'
        >
            <In.PhoneInput
                { ...props }
            />
        </LabelInput>
    );
}
export function LabelSelect({ label, position, ...props }: LabelTextProps & BaseSelectProps) {
    return(
        <LabelInput
            label={label}
            position={position}
            typeInput='select'
        >
            <Select
                { ...props }
            />
        </LabelInput>
    );
}