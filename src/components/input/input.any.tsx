import React, { useState } from 'react';
import { IconButton, Box, FormHelperText, FormControlLabel, styled, alpha, useTheme } from '@mui/material';
import { Phone, AlternateEmail } from '@mui/icons-material';
import Switch from '@mui/material/Switch';
import { InputPaper, InputBaseCustom } from './atomize';
export { default as ColorPicker } from './color';
import type { EmailInputProps, PhoneInputProps, SwitchInputProps } from './type';



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
        if (typeof window === 'undefined') return;

        setEmailValue(value);
        if(value?.length > 0) setIsValid(useHookVerify(value));
    }, [value]);

    
    return (
        <React.Fragment>
            <InputPaper 
                disabled={disabled} 
                error={!isValid}
                { ...props }
            >
                <IconButton
                    disabled={disabled}
                    style={{
                        color: theme.palette.input.placeholder,
                        minHeight: 40,
                        ...props?.styles?.icon
                    }}
                >
                    <AlternateEmail />
                </IconButton>

                <InputBaseCustom
                    value={emailValue}
                    onChange={handleChange}
                    styles={props?.styles}
                    fullWidth
                    placeholder={placeholder ?? "Введите email"}
                    disabled={disabled}
                    sx={{ 
                        ml: 1,
                    }}
                    type='text'
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
        if (typeof window === 'undefined') return;

        if(/^\+?\d+$/.test(value)) {
            setPhoneValue(value);
            setIsValid(useHookVerify(value));
        }
    }, [value]);


    return (
        <React.Fragment>
            <InputPaper 
                disabled={disabled} 
                error={!isValid}
                { ...props }
            >
                <IconButton
                    disabled={disabled}
                    style={{
                        color: theme.palette.input.placeholder,
                        ...props?.styles?.icon
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
                    sx={{ pl: 1, minHeight: 40,}}
                    styles={props?.styles}
                    type='text'
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


export function SwitchInput({ value, onChange, labelSx, style, ...props }: SwitchInputProps) {
    const theme = useTheme();
  
    const Android12Switch = styled(Switch)(({ theme }) => ({
        padding: 8,
        '& .MuiSwitch-track': {
          borderRadius: 22 / 2,
          '&::before, &::after': {
            content: '""',
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            width: 16,
            height: 16,
          },
          '&::before': {
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
                useColor('icon'),
            )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
            left: 12,
          },
          '&::after': {
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
                
            )}" d="M19,13H5V11H19V13Z" /></svg>')`,
            right: 12,
          },
          backgroundColor: (props?.styles?.form?.backgroundColor ?? '#00000014'),
          border: `1px solid ${useColor('border')}`
        },
        '& .MuiSwitch-thumb': {
            boxShadow: 'none',
            width: 16,
            height: 16,
            margin: 2,
            backgroundColor: useColor('thumb'),
            ...props?.styles?.thumb,
        }
    }));
    
    const useColor =(type: 'trackOn' | 'trackOff' | 'thumb' | 'icon' | 'border')=> {
        let color = theme.palette.switch[type];
        const styleEditor = props?.styles?.form;
        
        if(styleEditor?.borderColor && type === 'border') color = styleEditor.borderColor;
       

        if((type!=='trackOff' && type!=='trackOn' && type!=='border') && props.disabled){
            return alpha(color, 0.1);
        } 
        else return color;
    }
    
    return(
        <Box>
            <FormControlLabel
                disabled={props.disabled}
                control={
                    <Android12Switch 
                        id={props.id}
                        checked={value}   //!
                        color='default'
                        onChange={(e, v)=> {
                            onChange && onChange(v);
                            //setCur(v);
                        }}
                    />
                }
                label={props.label}
                labelPlacement="end"
                sx={{ 
                    gap: 2, 
                    margin: 0, 
                    mt: 1,
                    "& .MuiFormControlLabel-label": {
                        color: alpha(theme.palette.text.secondary, 0.6),  // label color
                        fontFamily: '"Roboto Condensed", Arial, sans-serif',
                        fontSize: 16,
                        ...labelSx
                    }
                }}
            />
        </Box>
    );
}
