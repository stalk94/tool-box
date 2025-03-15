import React from 'react';
import { useTheme, IconButton, FormHelperText } from '@mui/material';
import Divider from '@mui/material/Divider';
import InputBase, { InputBaseProps } from '@mui/material/InputBase';
import { VisibilityOff, Visibility, Done, Close, Add, Remove } from '@mui/icons-material';
import ButtonGroup from '@mui/material/ButtonGroup';
import { DatePickerCustom } from './input.date';
import { EmailInput, PhoneInput, ColorPicker, InputPaper, InputBaseCustom } from './input.any';


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
export type VerifyHook = {
    useVerify: (value: string)=> {
        result: boolean,
        helperText?: string 
    }
}
export type PasswordInputProps = {
    onVerify: (value: string)=> void
    helperText?: string
} & VerifyHook & BaseInputProps
export type NumberinputProps = {
    value?: number
    min?: number
    max?: number
    step?: number
    onChange?: (value: number)=> void
} & BaseInputProps


/**
 * Базовое поле ввода. На данный момент работает:
 * - number, text
 * * левый и правый сторона можно реализовать верефикатор индикатор а так же тул панель
 */
function BaseInput({ value, left, right, onChange, placeholder, variant, label, ...props }: BaseInputProps) {
    const theme = useTheme();
    const [inputValue, setInputValue] = React.useState<number | string>();

 
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
        setInputValue(value);
    }, [value]);

   
    return(
        <InputPaper {...props} >
            { left &&
                <IconButton
                    disabled={props.disabled}
                    style={{
                        color: theme.palette.action.active,
                    }}
                >
                    { left }
                </IconButton>
            }

            <InputBaseCustom
                value={inputValue}
                placeholder={placeholder}
                onChange={useFiltre}
                pl={left ? '5px' : '20px'}
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
function NumberInput({ value, min=0, max=100, step=1, onChange, ...props }: NumberinputProps) {
    const theme = useTheme();
    const [inputValue, setInputValue] = React.useState<number>(value ?? 0);


    const handleIncrease =()=> {
        if (typeof inputValue === 'number' && inputValue < max) {
            const newValue = inputValue + step;
            setInputValue(newValue);
            onChange && onChange(newValue);
        }
    }
    const handleDecrease =()=> {
        if (typeof inputValue === 'number' && inputValue > min) {
            const newValue = inputValue - step;
            setInputValue(newValue);
            onChange && onChange(newValue);
        }
    }


    return(
        <React.Fragment>
            <BaseInput {...props}
                value={inputValue}
                type="number" 
                onChange={(value)=> {
                    setInputValue(value);
                    onChange && onChange(value);
                }}
                right={
                    <ButtonGroup orientation="horizontal" sx={{ml: '5px'}}>
                        <IconButton
                            onClick={handleIncrease}
                            disabled={inputValue >= max}
                        >
                            <Add 
                                style={{
                                    color: theme.palette.text.secondary, 
                                    opacity: inputValue >= max ? '0.2' : '0.6',
                                    fontSize: '20px'
                                }} 
                            />
                        </IconButton>
                        <IconButton
                            onClick={handleDecrease}
                            disabled={inputValue <= min}
                        >
                            <Remove 
                                style={{
                                    color: theme.palette.text.secondary, 
                                    opacity: inputValue <= min ? '0.2' : '0.6',
                                    fontSize: '20px'
                                }} 
                            />
                        </IconButton>
                    </ButtonGroup>
                }
            />
        </React.Fragment>
    );
}
function PasswordInput({ value, onChange, placeholder, ...props }: PasswordInputProps) {
    const theme = useTheme();
    const [type, setType] = React.useState<'password'|'text'>('password');
    const iconStyle = {color: theme.palette.text.secondary, opacity: '0.6'};


    return(
        <BaseInput
            onChange={onChange}
            placeholder={placeholder}
            value={value}
            type={type}
            right={
                <IconButton 
                    onClick={()=> {
                        setType((old)=> old === 'password' ? 'text' : 'password')
                    }} 
                    color="default" 
                    sx={{ pl: '12px' }}
                >
                    { type !== 'password' 
                        ? <VisibilityOff style={iconStyle} /> 
                        : <Visibility style={iconStyle} />
                    }
                </IconButton>
            }
            {...props}
        />
    );
}


function VerifyPaswordInput({ value, useVerify, helperText, ...props }: PasswordInputProps) {
    const theme = useTheme();
    const [customHelper, setCustomHelper] = React.useState<string>();
    const [isValid, setValid] = React.useState<boolean>(true);

    //* вариация с иконкой верификатором
    const left =()=> {
        return(
            <IconButton
                color="default"
                sx={{ p: '10px' }}
            >
                { (verify !== null && verify)
                    ? <Done style={{ color: theme.palette.success.dark }} />
                    : <Close style={{ color: theme.palette.error.dark }} />
                }
            </IconButton>
        );
    }
    const useHookVerify =(newValue: string)=> {
        let valid = true;

        if(useVerify) {
            const res = useVerify(newValue);
            valid = res.result;
            setCustomHelper(res.helperText);
        }

        return valid;
    }
    const useVerifyChange =(newValue: string)=> {
        setValid(useHookVerify(newValue));
        if(props.onChange) props.onChange(newValue);
    }
    React.useEffect(()=> {
        if(value) setValid(useHookVerify(value));
    }, [value]);
    

    return(
        <React.Fragment>
            <PasswordInput 
                {...props}
                error={!isValid}
                onChange={useVerifyChange}
            />

            { !isValid && (
                <FormHelperText error={true} style={{ marginTop: '4px' }}>
                    *{customHelper || (helperText ?? 'Введите правильный пароль')}
                </FormHelperText>
            )}
        </React.Fragment>
    );
}
function LoginInput({ value, useVerify, helperText, ...props }: PasswordInputProps) {
    const theme = useTheme();
    const [customHelper, setCustomHelper] = React.useState<string>();
    const [isValid, setValid] = React.useState<boolean>(true);

    //* вариация с иконкой верификатором
    const left =()=> {
        return(
            <IconButton
                color="default"
                sx={{ p: '10px' }}
            >
                { (verify !== null && verify)
                    ? <Done style={{ color: theme.palette.success.dark }} />
                    : <Close style={{ color: theme.palette.error.dark }} />
                }
            </IconButton>
        );
    }
    const useHookVerify =(newValue: string)=> {
        let valid = true;

        if(useVerify) {
            const res = useVerify(newValue);
            valid = res.result;
            setCustomHelper(res.helperText);
        }

        return valid;
    }
    const useVerifyChange =(newValue: string)=> {
        setValid(useHookVerify(newValue));
        if(props.onChange) props.onChange(newValue);
    }
    React.useEffect(()=> {
        if(value) setValid(useHookVerify(value));
    }, [value]);
    

    return(
        <React.Fragment>
            <BaseInput
                {...props}
                error={!isValid}
                onChange={useVerifyChange}
            />

            { !isValid && (
                <FormHelperText error={true} style={{ marginTop: '4px' }}>
                    *{customHelper || (helperText ?? 'Введите правильный логин')}
                </FormHelperText>
            )}
        </React.Fragment>
    );
}



export default {
    Input: BaseInput,
    NumberInput,
    ColorPicker,
    PasswordInput: VerifyPaswordInput,
    LoginInput,
    DatePickerCustom,
    EmailInput,
    PhoneInput
}