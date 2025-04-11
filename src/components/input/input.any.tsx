import React, { useState } from 'react';
import { IconButton, Divider, FormHelperText, Dialog, InputBaseProps, Box, FormControlLabel, styled, alpha } from '@mui/material';
import { Phone, FileCopy, AlternateEmail } from '@mui/icons-material';
import ToggleButton, { ToggleButtonProps, ToggleButtonOwnProps } from '@mui/material/ToggleButton';
import ToggleButtonGroup, { ToggleButtonGroupProps } from '@mui/material/ToggleButtonGroup';
import Checkbox, { CheckboxProps } from '@mui/material/Checkbox';
import { ChromePicker } from 'react-color';
import { useTheme } from '@mui/material/styles';
import Switch, { SwitchProps } from '@mui/material/Switch';
import { InputPaper, InputBaseCustom, Label } from './atomize';




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
export type TooglerInputProps = ToggleButtonGroupProps & {
    value?: string | string[]
    /** множественный выбор */
    multi: boolean
    label: string
    items: (ToggleButtonOwnProps & {
        label: string  | React.ReactNode
        id: string 
    })[]
    onChange?: (value: string | string[])=> void
}
export type CheckBoxInputProps = CheckboxProps & {
    value?: boolean
    onChange?: (value: boolean)=> void
}
export type ColorPickerProps = InputBaseProps & {
    value?: boolean
    onChange?: (value: string)=> void
    /** включить ли кнопку копирования данных ввода */
    toolVisible?: boolean 
}
export type SwitchInputProps = SwitchProps & { 
    value?: boolean, 
    onChange: (v:boolean)=> void 
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
            <InputPaper 
                disabled={disabled} 
                error={!isValid}
                { ...props }
            >
                <IconButton
                    disabled={disabled}
                    style={{
                        color: theme.palette.input.placeholder,
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
                    sx={{ pl: 1 }}
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
// todo: чучуть доработать (modal)
export function ColorPicker({ value, onChange, ...props }:  ColorPickerProps) {
    const [open, setopen] = React.useState<boolean>(false);
    const [inputValue, setInputValue] = React.useState<string>('rgba(255, 0, 0, 1)');
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
    React.useEffect(()=> {
        if(value) setInputValue(value);
    }, [value]);


    return(
        <InputPaper {...props} >
             <React.Fragment>
                <div style={{
                        marginTop: '2px',
                        width: '30px',
                        height: '30px',
                        border: 'none',
                        cursor: 'pointer',
                        background: inputValue,
                        borderRadius: '5px',
                        marginLeft: '7px',
                        marginRight: '11px'
                    }}
                    onClick={()=> setopen(true)}
                />
                {/* модалка с выбором цвета */}
                <Dialog 
                    open={open} 
                    onClose={()=> {
                        setopen(false);
                        props.onClose && props.onClose()
                    }} 
                >
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
                { ...props }
                placeholder={props.placeholder}
                type='text'
                value={inputValue}
                onChange={useChange}
            />

            { props.toolVisible &&
                <React.Fragment>
                    <IconButton onClick={useCopy} disabled={props.disabled}>
                        <FileCopy style={{
                                color: theme.palette.text.secondary, 
                                opacity: '0.6'
                            }} 
                        />
                    </IconButton>
                </React.Fragment>
            }
        </InputPaper>
    )
}
export function SwitchInput({ value, onChange, ...props }: SwitchInputProps) {
    const theme = useTheme();
    const [curvalue, setCur] = React.useState(value);
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
          backgroundColor: curvalue ? useColor('trackOn') : useColor('trackOff'),
          border: `1px solid ${useColor('border')}`
        },
        '& .MuiSwitch-thumb': {
            boxShadow: 'none',
            width: 16,
            height: 16,
            margin: 2,
            backgroundColor: useColor('thumb')
        }
    }));
    
    const useColor =(type: 'trackOn'|'trackOff'|'thumb'|'icon'|'border')=> {
        const color = theme.palette.switch[type];

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
                        checked={curvalue}
                        color='default'
                        onChange={(e, v)=> {
                            onChange && onChange(v);
                            setCur(v);
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
                        fontSize: 16
                    }
                }}
            />
        </Box>
    );
}
//! доработать темизацию (groop button)
export function TooglerInput({ items, value, label, onChange, ...props }: TooglerInputProps) {
    const theme = useTheme();
    const [curentValue, setCurent] = React.useState<string[]>([]);


    const filtre =()=> {
        delete props.borderStyle;
        delete props.success;
        delete props.error;
        delete props.labelSx;
        return props;
    }
    const useColorBackground =()=> {
        const colors = theme.palette.input;

        if(props.disabled) return 
    }
    const useColorText =()=> {

    }
    const handlerChange =(newValue)=> {
        if(Array.isArray(value) || props.multi) {
            setCurent(newValue);
            onChange && onChange(newValue);
        }
        else {
            const last = newValue[newValue.length - 1];
            setCurent([last]);
            onChange && onChange(last);
        }
    }
    React.useEffect(()=> {
        if(typeof value === 'string') setCurent([value]);
        else if(Array.isArray(value)) {
            setCurent([...value]);
        }
    }, [value]);
    

    return(
        <ToggleButtonGroup
            value={curentValue}
            onChange={(e, v)=> handlerChange(v)}
            aria-label={label}
            { ...filtre() }
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                width: '100%',
                ...props.sx
            }}
        >
            { items.map((elem, index)=> 
                 <ToggleButton
                    //{ ...elem }
                    sx={{ 
                        flex: 1,
                        border: `1px solid ${theme.palette.input.border}`,
                        "&.Mui-selected": {
                            //backgroundColor: "red", // Цвет фона выделенной кнопки
                            //color: "white", // Цвет текста выделенной кнопки
                            //"&:hover": { backgroundColor: "darkred",},
                            opacity: props.disabled ? 0.5 : 1
                        },
                    }}
                    key={index} 
                    value={elem.id} 
                    aria-label={elem.id}
                >
                    { elem.label }
                 </ToggleButton>
            ) }
        </ToggleButtonGroup>
    );
}
export function CheckBoxInput({ value, onChange, ...props }: CheckBoxInputProps) {
    const theme = useTheme();
    const [curentValue, setCurent] = React.useState(value ?? false);
    
    const useColor =()=> {
        const colors = theme.palette.chekbox;

        if(props.disabled) return alpha(colors.border, 0.1);
        else return colors.border;
    }
    const useColorCheck =()=> {
        const colors = theme.palette.chekbox;

        if(props.disabled) return alpha(colors.success, 0.2);
        else return colors.success;
    }

    return(
        <FormControlLabel
            disabled={props.disabled}
            value="end"
            control={
                <Checkbox 
                    checked={curentValue}
                    onChange={(e, v)=> {
                        setCurent(v);
                        onChange && onChange(v);
                    }}
                    inputProps={{ 'aria-label': props.name ?? 'checkbox' }}
                    sx={{
                        "& .MuiSvgIcon-root": {
                            color: useColor(), // Цвет обводки (обычное состояние)
                        },
                        "&.Mui-checked .MuiSvgIcon-root": {
                            color: useColorCheck(), // Цвет обводки при выборе
                        },
                        ...props.sx
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
                    color: alpha(theme.palette.text.secondary, 0.6),
                    fontFamily: '"Roboto Condensed", Arial, sans-serif',
                }
            }}
        />
    );
}

