import React, { useState } from 'react';
import { Paper, InputBase, InputLabel, IconButton, Divider, FormHelperText } from '@mui/material';
import { Email, Phone, FileCopy } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';


type EmailInputProps = {
    value: string;
    onChange: (value: string) => void;
    error?: boolean;
    helperText?: string;
    disabled?: boolean;
}
type PhoneInputProps = {
    value: string;
    onChange: (value: string) => void;
    error?: boolean;
    helperText?: string;
    disabled?: boolean;
}


export function EmailInput({ value, onChange, error, helperText, disabled }: EmailInputProps) {
    const theme = useTheme();
    const [emailValue, setEmailValue] = useState(value);
    const [isValid, setIsValid] = useState(true);

    // Проверка валидности email
    const validateEmail = (email: string) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setEmailValue(newValue);
        setIsValid(validateEmail(newValue)); // Проверяем на валидность
        onChange(newValue); // Передаем значение родителю
    }
    const chek = () => {
        const border = 'solid';
        if (error) return `1px ${border} ${theme.palette.error.light}`;
        else if (disabled) return `1px ${border} ${theme.palette.action.disabled}`;
        else return `1px ${border} ${theme.palette.action.active}`;
    }


    return (
        <div style={{ position: 'relative' }}>
            <Paper
                style={{
                    opacity: disabled ? 0.6 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    border: chek(),
                    boxShadow: '0px 3px 4px rgba(0, 0, 0, 0.2)',
                    position: 'relative',
                }}
            >
                <IconButton
                    disabled={disabled}
                    style={{
                        marginLeft: '5px',
                        color: theme.palette.action.active,
                    }}
                >
                    <Email />
                </IconButton>

                <InputBase
                    id="email-input"
                    value={emailValue}
                    onChange={handleChange}
                    fullWidth
                    placeholder="Введите email"
                    disabled={disabled}
                    disableUnderline={true}
                    style={{ paddingLeft: '10px' }}
                />
            </Paper>

            {/* Подсказка или сообщение об ошибке */}
            {!isValid && error && (
                <FormHelperText error={true} style={{ marginTop: '4px' }}>
                    {helperText || 'Введите правильный email адрес'}
                </FormHelperText>
            )}
        </div>
    );
}

export function PhoneInput({ value, onChange, error, helperText, disabled }: PhoneInputProps) {
    const theme = useTheme();
    const [phoneValue, setPhoneValue] = useState(value);
    const [isValid, setIsValid] = useState(true);

    // Проверка валидности номера телефона
    const validatePhone = (phone: string) => {
        const phoneRegex = /^\+?[1-9]\d{1,14}$/; // Международный формат
        return phoneRegex.test(phone);
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setPhoneValue(newValue);
        setIsValid(validatePhone(newValue)); // Проверяем на валидность
        onChange(newValue); // Передаем значение родителю
    }

    const chek = () => {
        const border = 'solid';
        if (error) return `1px ${border} ${theme.palette.error.light}`;
        else if (disabled) return `1px ${border} ${theme.palette.action.disabled}`;
        else return `1px ${border} ${theme.palette.action.active}`;
    }


    return (
        <div style={{ position: 'relative' }}>
            <Paper
                style={{
                    opacity: disabled ? 0.6 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    border: chek(),
                    boxShadow: '0px 3px 4px rgba(0, 0, 0, 0.2)',
                    position: 'relative',
                }}
            >
                <IconButton
                    disabled={disabled}
                    style={{
                        marginLeft: '5px',
                        color: theme.palette.action.active,
                    }}
                >
                    <Phone />
                </IconButton>

                <InputBase
                    id="phone-input"
                    value={phoneValue}
                    onChange={handleChange}
                    fullWidth
                    placeholder="+79991234567"
                    disabled={disabled}
                    disableUnderline={true}
                    style={{ paddingLeft: '10px' }}
                />
            </Paper>

            {/* Подсказка или сообщение об ошибке */}
            {!isValid && error && (
                <FormHelperText error={true} style={{ marginTop: '4px' }}>
                    {helperText || 'Введите корректный номер телефона'}
                </FormHelperText>
            )}
        </div>
    );
}

export function ColorPicker({ value, variant, left, onChange, ...props }) {
    const [inputValue, setInputValue] = React.useState<string>(value);
    const theme = useTheme();

    const chek =()=> {
        const border = props?.borderStyle ?? 'solid';

        if(props.error) return `1px ${border} ${theme.palette.error.light}`;
        else if(props.disabled) return `1px ${border} ${theme.palette.action.disabled}`;
        else if(props.success) return `1px ${border} ${theme.palette.success.light}`;
        else return `1px ${border} ${theme.palette.action.active}`;
    }
    const useCopy =()=> {
        navigator.clipboard.writeText(inputValue);
    }
    const useFiltre =(value: string)=> {
        setInputValue(value);
        if(onChange) onChange(value);
    }


    return(
        <Paper
            style={{ 
                opacity: props.disabled && 0.6,
                display: 'flex', 
                alignItems: 'center', 
                border: chek(),
                boxShadow: '0px 3px 4px rgba(0, 0, 0, 0.2)'
            }}
        >
            { left && 
                <React.Fragment>
                    <IconButton onClick={useCopy}>
                        <FileCopy />
                    </IconButton>
                    <Divider flexItem orientation="vertical" variant={variant??'middle'} />
                </React.Fragment>
            }
            <InputBase 
                placeholder={props.placeholder}
                type='text'
                value={inputValue}
                sx={{ flex: 1, pl: '1.5rem' }}
                //inputProps={{style: {textAlign: 'center'}}}
                onChange={(e)=> useFiltre(e.target.value)}
            />
            <React.Fragment>
                {/**<Divider sx={{mr:'5px'}} flexItem orientation="vertical" variant={variant??'fullWidth'} />*/}
                <input
                    type="color"
                    value={inputValue}
                    onChange={(e)=> useFiltre(e.target.value)}
                    style={{
                        width: '15%',
                        height: '40px',
                        border: 'none',
                        cursor: 'pointer',
                        background: 'transparent',
                        borderRadius: '5px',
                        marginRight: '3px'
                    }}
                />
            </React.Fragment>
        </Paper>
    )
}