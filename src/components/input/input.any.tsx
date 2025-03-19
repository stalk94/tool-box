import React, { useState } from 'react';
import { IconButton, Divider, FormHelperText, Dialog, InputBaseProps } from '@mui/material';
import { Phone, FileCopy, AlternateEmail } from '@mui/icons-material';
import { ChromePicker } from 'react-color';
import { useTheme } from '@mui/material/styles';
import { InputPaper, InputBaseCustom } from './atomize';

 
export type EmailInputProps = InputBaseProps & {
    value: string;
    onChange: (value: string) => void;
    error?: boolean;
    helperText?: string;
    disabled?: boolean;
    placeholder?: string;
    useVerify?: (value: string)=> {
        result: boolean,
        helperText?: string 
    }
}
export type PhoneInputProps = InputBaseProps & {
    value: string;
    onChange: (value: string) => void;
    error?: boolean;
    helperText?: string;
    disabled?: boolean;
    placeholder?: string;
    useVerify?: (value: string)=> {
        result: boolean,
        helperText?: string 
    }
}




export function EmailInput({ value, useVerify, onChange, helperText, disabled, placeholder, ...props }: EmailInputProps) {
    const theme = useTheme();
    const [customHelper, setCustomHelper] = React.useState<string>();
    const [emailValue, setEmailValue] = useState(value);
    const [isValid, setIsValid] = useState(true);

    const useHookVerify =(newValue: string)=> {
        let valid = true;

        if(useVerify) {
            const res = useVerify(newValue);
            valid = res.result;
            setCustomHelper(res.helperText);
        }

        return valid;
    }
    const handleChange =(newValue: string)=> {
        setIsValid(useHookVerify(newValue));
        setEmailValue(newValue);
        onChange(newValue); // Передаем значение родителю
    }
    React.useEffect(()=> {
        setEmailValue(value);
        if(value?.length > 0) setIsValid(useHookVerify(value));
    }, [value]);

    
    return (
        <React.Fragment>
            <InputPaper disabled={disabled} error={!isValid}>
                <IconButton
                    disabled={disabled}
                    style={{
                        color: theme.palette.action.active,
                    }}
                >
                    <AlternateEmail />
                </IconButton>

                <InputBaseCustom
                    value={emailValue}
                    onChange={handleChange}
                    fullWidth
                    placeholder={placeholder ?? "Введите email"}
                    disabled={disabled}
                    sx={{ 
                        pl: '10px',
                        '& input::placeholder': {
                            color: theme.palette.placeholder.main,
                            opacity: 1,
                            fontStyle: theme.elements.input.fontStyle
                        }
                    }}
                    {...props}
                />
            </InputPaper>

            {/* Подсказка или сообщение об ошибке */}
            {!isValid && (
                <FormHelperText error={true} style={{ marginTop: '4px' }}>
                    *{customHelper || (helperText ?? 'Введите правильный email адрес')}
                </FormHelperText>
            )}
        </React.Fragment>
    );
}
export function PhoneInput({ value, onChange, useVerify, helperText, disabled, placeholder, ...props }: PhoneInputProps) {
    const theme = useTheme();
    const [customHelper, setCustomHelper] = React.useState<string>();
    const [phoneValue, setPhoneValue] = useState('');
    const [isValid, setIsValid] = useState(true);

    const useHookVerify =(newValue: string)=> {
        let valid = true;

        if(useVerify) {
            const res = useVerify(newValue);
            valid = res.result;
            setCustomHelper(res.helperText);
        }

        return valid;
    }
    const handleChange =(newValue)=> {
        if(/^\+?\d*$/.test(newValue)) {
            setIsValid(useHookVerify(newValue));
            setPhoneValue(newValue);
            onChange(newValue);
        }
    }
    React.useEffect(()=> {
        if(/^\+?\d+$/.test(value)) {
            setPhoneValue(value);
            setIsValid(useHookVerify(value));
        }
    }, [value]);


    return (
        <React.Fragment>
           <InputPaper disabled={disabled} error={!isValid}>
                <IconButton
                    disabled={disabled}
                    style={{
                        color: theme.palette.action.active,
                    }}
                >
                    <Phone />
                </IconButton>

                <InputBaseCustom
                    value={phoneValue}
                    onChange={handleChange}
                    fullWidth
                    placeholder={placeholder ?? "+79991234567"}
                    disabled={disabled}
                    sx={{
                        pl: '10px',
                        '& input::placeholder': {
                            color: theme.palette.placeholder.main,
                            opacity: 1,
                            fontStyle: theme.elements.input.fontStyle
                        }
                    }}
                    { ...props }
                />
            </InputPaper>

            {/* Подсказка или сообщение об ошибке */}
            {!isValid && (
                <FormHelperText error={true} style={{ marginTop: '4px' }}>
                    *{customHelper || (helperText ?? 'Введите корректный номер телефона')}
                </FormHelperText>
            )}
        </React.Fragment>
    );
}
export function ColorPicker({ value, variant, left, onChange, ...props }) {
    const [open, setopen] = React.useState<boolean>(false);
    const [inputValue, setInputValue] = React.useState<string>(value ?? 'rgba(255, 0, 0, 1)');
    const theme = useTheme();

    const useCopy =()=> {
        navigator.clipboard.writeText(inputValue);
    }
    const useTransform =(val)=> {
        return `rgba(${val.rgb.r}, ${val.rgb.g}, ${val.rgb.b}, ${val.rgb.a})`;
    }
    const useFiltre =(newValue)=> {
        const strRgb = useTransform(newValue);

        setInputValue(strRgb);
        if(onChange) onChange(strRgb);
    }
    const useChange =(newValue)=> {
        setInputValue(newValue);
        if(onChange) onChange(newValue);
    }


    return(
        <InputPaper {...props} >
             <React.Fragment>
                {/**<Divider sx={{mr:'5px'}} flexItem orientation="vertical" variant={variant??'fullWidth'} />*/}
                <div style={{
                        marginTop: '2px',
                        width: '30px',
                        height: '30px',
                        border: 'none',
                        cursor: 'pointer',
                        background: inputValue,
                        borderRadius: '5px',
                        marginLeft: '7px'
                    }}
                    onClick={()=> setopen(true)}
                />
                <Dialog open={open} onClose={()=> setopen(false)} >
                    <ChromePicker
                        color={inputValue}
                        onChange={(value)=> {
                            useFiltre(value);
                        }}
                        disableAlpha={false}
                    />
                </Dialog>
            </React.Fragment>

            <InputBaseCustom 
                placeholder={props.placeholder}
                type='text'
                value={inputValue}
                onChange={useChange}
                { ...props }
            />

            <React.Fragment>
                { variant || theme.elements.input.variant &&
                    <Divider sx={{mr:'5px'}} flexItem orientation="vertical" variant={variant ?? theme.elements.input.variant} />
                }
                <IconButton onClick={useCopy} >
                    <FileCopy style={{
                            color: theme.palette.text.secondary, 
                            opacity: '0.6'
                        }} 
                    />
                </IconButton>
            </React.Fragment>
        </InputPaper>
    )
}
