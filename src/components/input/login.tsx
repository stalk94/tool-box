import React from 'react';
import { useTheme, IconButton, FormHelperText } from '@mui/material';
import { InputPaper, InputBaseCustom  } from './atomize';


export type VerifyHook = {
    useVerify: (value: string)=> {
        result: boolean,
        helperText?: string 
    }
}
export type loginInputProps = {
    value: string
    onVerify?: (value: string)=> void
    helperText?: string
    onChange: (value: string)=> void
} & VerifyHook



export default function LoginInput({ value, helperText, useVerify, ...props }: loginInputProps) {
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
        if (props.onChange) props.onChange(newValue);
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
                        color: theme.palette.action.active,
                    }}
                >
                    { props.left }
                </IconButton>

                <InputBaseCustom
                    sx={{
                        flex: 1, 
                        pl: 1
                    }}
                    placeholder={props.placeholder}
                    error={!isValid}
                    onChange={useVerifyChange}
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