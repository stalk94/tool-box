import React, { useState } from 'react';
import { IconButton, Popover, Box, FormHelperText, InputBaseProps, FormControlLabel, styled, alpha, Link } from '@mui/material';
import { Phone, MoreHoriz, AlternateEmail } from '@mui/icons-material';
import ToggleButton, { ToggleButtonProps, ToggleButtonOwnProps } from '@mui/material/ToggleButton';
import ToggleButtonGroup, { ToggleButtonGroupProps } from '@mui/material/ToggleButtonGroup';
import Checkbox, { CheckboxProps } from '@mui/material/Checkbox';
import { useTheme } from '@mui/material/styles';
import Switch, { SwitchProps } from '@mui/material/Switch';
import { InputPaper, InputBaseCustom, Label } from './atomize';
import { safeOmitInputProps } from '../hooks/omit';
export { default as ColorPicker } from './color';



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
    isColapsed?: boolean
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
    label?: React.ReactNode
    onChange?: (value: boolean)=> void
}
export type SwitchInputProps = SwitchProps & { 
    value?: boolean, 
    onChange: (v:boolean)=> void 
}
export type ChekBoxAgrementProps = CheckBoxInputProps & {
    useVerify?: (value: string)=> {
        result: boolean,
        helperText?: string 
    }
    linkUrl?: React.ReactElement
    agrement?: string
    helperText?: string
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
        console.log(newValue)
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


export function TooglerInput({ items, value, label, onChange, isColapsed, ...props }: TooglerInputProps) {
    const theme = useTheme();
    const [curentValue, setCurent] = React.useState<string[]>([]);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);
    const handlerChange = (newValue) => {
        if (Array.isArray(value) || props.multi) {
            setCurent(newValue);
            onChange && onChange(newValue);
        } else {
            const last = newValue[newValue.length - 1];
            setCurent([last]);
            onChange && onChange(last);
        }
    }
    React.useEffect(() => {
        if (typeof window === 'undefined') return;

        if (typeof value === 'string') {
            setCurent([value]);
        } else if (Array.isArray(value)) {
            setCurent([...value]);
        }
    }, [value]);
    const visibleItems = isColapsed
        ? items.filter((i) => curentValue.includes(i.id))
        : items;
    const hiddenItems = isColapsed
        ? items.filter((i) => !curentValue.includes(i.id))
        : [];


    return (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <ToggleButtonGroup
                value={curentValue}
                onChange={(e, v) => handlerChange(v)}
                aria-label={label}
                {...safeOmitInputProps(props, ['borderStyle', 'success', 'error', 'labelSx'])}
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    width: '100%',
                    ...props.sx,
                    border: props?.styles?.form?.borderColor && '1px solid',
                    ...props?.styles?.form,
                }}
            >
                {visibleItems.map((elem, index) => (
                    <ToggleButton
                        sx={{
                            flex: 1,
                            border: `1px solid ${theme.palette.input.border}`,
                            height: props?.style?.height ?? 36,
                            ...props?.styles?.button,
                            overflowWrap: 'normal',
                            wordBreak: 'keep-all',
                            "&.Mui-selected": {
                                opacity: props.disabled ? 0.5 : 1,
                            },
                        }}
                        key={index}
                        value={elem.id}
                        aria-label={elem.id}
                    >
                        {elem.label}
                    </ToggleButton>
                ))}
            </ToggleButtonGroup>

            {isColapsed && hiddenItems.length > 0 && (
                <>
                    <IconButton onClick={handleOpen} size="small" sx={{ height: 26 }}>
                        <MoreHoriz />
                    </IconButton>
                    <Popover
                        open={!!anchorEl}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                        PaperProps={{
                            sx: {
                                p: 0.5,
                                maxWidth: 300,
                                overflowY:'auto'
                            },
                        }}
                    >
                        <ToggleButtonGroup
                            orientation="horizontal"
                            value={curentValue}
                            onChange={(e, v) => {
                                handlerChange(v);
                                handleClose();
                            }}
                            sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 1,
                                ...props.sx,
                                border: props?.styles?.form?.borderColor && '1px solid',
                                ...props?.styles?.form,
                            }}
                        >
                            {hiddenItems.map((elem, index) => (
                                <ToggleButton
                                    key={index}
                                    value={elem.id}
                                    aria-label={elem.id}
                                    sx={{
                                        border: `1px solid ${theme.palette.input.border}`,
                                        flex: '1 0 16%',
                                        minWidth: 20,
                                        maxWidth: '100%',
                                        whiteSpace: 'nowrap',
                                        height: props?.style?.height ?? 32,
                                        ...props?.styles?.button,
                                        overflowWrap: 'normal',
                                        wordBreak: 'keep-all',
                                        "&.Mui-selected": {
                                            opacity: props.disabled ? 0.5 : 1,
                                        },
                                    }}
                                >
                                    {elem.label}
                                </ToggleButton>
                            ))}
                        </ToggleButtonGroup>
                    </Popover>
                </>
            )}
        </Box>
    );
}
export function CheckBoxInput({ value, onChange, label, ...props }: CheckBoxInputProps) {
    const theme = useTheme();
    //const [curentValue, setCurent] = React.useState(value ?? false);
    
    const useColor =()=> {
        const colors = theme.palette.chekbox;
        const editorStyle = props?.styles?.form;

        if(props.disabled) return alpha((editorStyle?.borderColor ?? colors.border), 0.1);
        else return editorStyle?.borderColor ?? colors.border;
    }
    const useColorCheck =()=> {
        const colors = theme.palette.chekbox;
        const editorStyle = props?.styles?.form;

        if(props.disabled) return alpha(editorStyle?.colorSuccess ?? colors.success, 0.2);
        else return editorStyle?.colorSuccess ?? colors.success;
    }
    
    return(
        <FormControlLabel
            disabled={props.disabled}
            value="end"
            control={
                <Checkbox 
                    checked={value}     //!
                    onChange={(e, v)=> {
                        //setCurent(v);
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
            label={label}
            labelPlacement="end"
            sx={{ 
                gap: 2, 
                margin: 0, 
                mt: 1,
                "& .MuiFormControlLabel-label": {
                    color: alpha(theme.palette.text.secondary, 0.6),
                    fontFamily: '"Roboto Condensed", Arial, sans-serif',
                    ...props?.styles?.label
                }
            }}
        />
    );
}
export const ChekBoxAgrement =({ useVerify, onChange, helperText, ...props}: ChekBoxAgrementProps)=> {
    const [customHelper, setCustomHelper] = React.useState<string>();
    const [isValid, setIsValid] = React.useState(true);

    const useHookVerify =(newValue: string)=> {
        let valid = true;

        if(useVerify) {
            const res = useVerify(newValue);
            valid = res.result;
            setCustomHelper(res.helperText);
        }

        return valid;
    }

    return(
        <React.Fragment>
            <CheckBoxInput 
                onChange={(newValue)=> {
                    setIsValid(useHookVerify(newValue));
                    onChange && onChange(newValue);
                }}
                { ...props}
            />
            {!isValid && (
                <FormHelperText error={true} style={{ marginTop: '4px' }}>
                    *{customHelper || (helperText ?? 'надо принять пользовательское соглашение')}
                </FormHelperText>
            )}
        </React.Fragment>
    )
}

export function SwitchInput({ value, onChange, ...props }: SwitchInputProps) {
    const theme = useTheme();
    //const [curvalue, setCur] = React.useState(value);
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
    
    const useColor =(type: 'trackOn'|'trackOff'|'thumb'|'icon'|'border')=> {
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
                        ...props?.styles?.label
                    }
                }}
            />
        </Box>
    );
}
