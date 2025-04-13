import React from 'react';
import { useTheme, IconButton, FormHelperText } from '@mui/material';
import { InputPaper, InputBaseCustom  } from './atomize';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import { InputBaseProps } from '@mui/material/InputBase';


export type PasswordInputProps = InputBaseProps & {
    value: string;
    onChange: (value: string) => void;
    useVerify?: (val: string) => { result: boolean; helperText?: string };
    helperText?: string;
    disabled?: boolean;
    placeholder?: string;
}


// todo:  убрать лишние рендеры
export default function PasswordInput({ value, helperText, useVerify, ...props }: PasswordInputProps) {
    const theme = useTheme();
    const [type, setType] = React.useState<'password'|'text'>('password');
    const [customHelper, setCustomHelper] = React.useState<string>();
    const [isValid, setValid] = React.useState<boolean>(true);
    const iconStyle = {color: theme.palette.text.secondary, opacity: '0.6'};


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
            <InputPaper {...props}>
                <IconButton
                    disabled={props.disabled}
                    style={{
                        color: theme.palette.input.placeholder,
                    }}
                >
                    { props.left }
                </IconButton>
                
                <InputBaseCustom
                    sx={{
                        minWidth: '40px',
                        flex: 1, 
                        ml: 1
                    }}
                    disabled={props.disabled}
                    placeholder={props.placeholder}
                    type={type}
                    error={!isValid}
                    onChange={useVerifyChange}
                />

                {/* правая иконка смены видимости поля */}
                <IconButton
                    disabled={props.disabled}
                    onClick={() => {
                        setType((old) => old === 'password' ? 'text' : 'password')
                    }}
                    color="default"
                >
                    {type !== 'password'
                        ? <VisibilityOff style={iconStyle} />
                        : <Visibility style={iconStyle} />
                    }
                </IconButton>
            </InputPaper>

            {!isValid && (
                <FormHelperText error={true} style={{ marginTop: '4px' }}>
                    *{customHelper || (helperText ?? 'Введите правильный пароль')}
                </FormHelperText>
            )}
        </React.Fragment>
    );
}