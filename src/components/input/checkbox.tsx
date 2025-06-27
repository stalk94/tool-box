import React from 'react';
import { FormHelperText, FormControlLabel, alpha, useTheme } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import type { CheckBoxInputProps, ChekBoxAgrementProps } from './type';


export function CheckBoxInput({ value, onChange, label, ...props }: CheckBoxInputProps) {
    const theme = useTheme();
    
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
                    checked={value}
                    onChange={(e, v)=> onChange && onChange(v)}
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
export const CheckBoxAgrement =({ useVerify, onChange, helperText, ...props}: ChekBoxAgrementProps)=> {
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