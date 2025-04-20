import React from 'react';
import { useTheme, IconButton, FormHelperText } from '@mui/material';
import { InputPaper, InputBaseCustom  } from './atomize';
import { InputBaseProps } from '@mui/material/InputBase';


export type loginInputProps = InputBaseProps & {
    value: string
    useVerify: (value: string)=> {
        result: boolean,
        helperText?: string 
    }
    helperText?: string
    onChange: (value: string)=> void
}



export default function LoginInput({ value, helperText, useVerify, onChange, ...props }: loginInputProps) {
    const theme = useTheme();
    const [customHelper, setCustomHelper] = React.useState<string>();
    const [isValid, setValid] = React.useState<boolean>(true);
   

    const useHookVerify = (newValue: string) => {
        let valid = true;

        if (useVerify) {
            const res = useVerify(newValue);
            valid = res.result;
            setCustomHelper(res.helperText);
        }

        return valid;
    }
    const useVerifyChange = (newValue: string) => {
        setValid(useHookVerify(newValue));
        if (onChange) onChange(newValue);
    }
    React.useEffect(() => {
        if (value) setValid(useHookVerify(value));
    }, [value]);


    return(
        <React.Fragment>
            <InputPaper {...props}>

                <IconButton
                    disabled={props.disabled}
                    style={{
                        color: theme.palette.input.placeholder,
                        ...props?.styles?.icon
                    }}
                >
                    { props.left }
                </IconButton>

                <InputBaseCustom
                    sx={{
                        flex: 1, 
                        pl: 1
                    }}
                    disabled={props.disabled}
                    placeholder={props.placeholder}
                    error={!isValid}
                    onChange={useVerifyChange}
                    styles={props?.styles}
                />
            </InputPaper>

            {!isValid && (
                <FormHelperText error={true} style={{ marginTop: '4px' }}>
                    *{customHelper || (helperText ?? 'Введите правильный логин')}
                </FormHelperText>
            )}
        </React.Fragment>
    );
}