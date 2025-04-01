import React from 'react';
import { useTheme, IconButton, FormHelperText } from '@mui/material';
import Divider from '@mui/material/Divider';
import { InputBaseProps } from '@mui/material/InputBase';
import { DatePickerCustom } from './date';
import { EmailInput, PhoneInput, ColorPicker } from './input.any';
import { InputPaper, InputBaseCustom  } from './atomize';
import InputNumber from './number';
import PasswordInput from './password';
import LoginInput from './login';


export type BaseInputProps = {
    min?: number
    max?: number
    step?: number
    left?: any 
    right?: any 
    placeholder?: string
    label?: string
    children?: React.ReactNode
    variant: "fullWidth" | "inset" | "middle"
    onChange?: (value: string | number)=> void
    success?: boolean
    borderStyle?: 'dashed' | 'solid' | 'dotted'
} & InputBaseProps


/**
 * Базовое поле ввода. На данный момент работает:
 * - number, text
 * * левый и правый сторона можно реализовать верефикатор индикатор а так же тул панель
 */
function BaseInput({ value, left, right, onChange, placeholder, variant, label, ...props }: BaseInputProps) {
    const theme = useTheme();
    const [inputValue, setInputValue] = React.useState<number | string>(value);

    
    const useFiltre =(value: string|number)=> {
        if(props.type === 'text' || props.type === 'number' || props.type === 'password') {
            if(props.type === 'number' && !isNaN(+value)) {
                setInputValue(+value);
                onChange && onChange(+value);
            }
            else if(props.type !== 'number' ) {
                setInputValue(value);
                onChange && onChange(value);
            }
        }
    }
    const filteredProps =()=> {
        const clone = structuredClone(props);
        if(clone.type !== 'password') delete clone.type;
        return clone;
    }
    React.useEffect(()=> {
        if(value) setInputValue(value);
    }, [value]);

   
    return(
        <InputPaper {...props} >

            { left }

            <InputBaseCustom
                value={inputValue}
                placeholder={placeholder}
                onChange={useFiltre}
                {...filteredProps()}
            />

            {right &&
                <React.Fragment>
                    {variant || theme.elements.input.variant &&
                        <Divider flexItem orientation="vertical" variant={variant ?? theme.elements.input.variant} />
                    }
                    { right }
                </React.Fragment>
            }

        </InputPaper>
    );
}




export default {
    Input: BaseInput,
    NumberInput: InputNumber,
    ColorPicker,
    PasswordInput,
    LoginInput,
    DatePickerCustom,
    EmailInput,
    PhoneInput
}