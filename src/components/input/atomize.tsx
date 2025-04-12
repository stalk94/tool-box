import React from 'react';
import { InputBase, Paper, useTheme, InputBaseProps, InputLabel, InputLabelProps, Box } from '@mui/material';
import { alpha, lighten, darken, styled } from '@mui/system';
import { debounce } from 'lodash';

type PropsInputBaseCustom = InputBaseProps & {
    onChange: (value: string)=> void
}


const AnimatedBox = styled(Box)`
    &:hover {
        cursor: pointer;
        background-color: ${alpha('rgb(221, 235, 238)', 0.1)}; // Используем alpha для задания прозрачности
    }
`;



// базовый лейбл
export function Label({ id, children, sx }: InputLabelProps) {
    const theme = useTheme();

    return (
        <InputLabel
            htmlFor={id}
            sx={{
                ml: 1,
                mt: 'auto',
                mb: 'auto',
                opacity: 0.9,
                color: theme.palette.text.secondary,
                fontFamily: '"Roboto Condensed", Arial, sans-serif',    //! жестко закреплен стиль шрифта
                ...sx
            }}
        >
            { children }
        </InputLabel>
    );
}
// базовая подложка под все инпуты (! тшательно доработать, я почти у цели)
export function InputPaper({ children, elevation, ...props }) {
    const theme = useTheme();

    // цвет бордера в зависимости от состояния (error, sucess, disabled)
    const useBorderColor = () => {
        const border = props?.borderStyle ?? 'solid';
        const colors = theme.palette.input;

        if (props.error) return `1px ${border} ${colors.error}`;
        else if (props.success) return `1px ${border} ${colors.success}`;
        else return `1px ${border} ${colors.border}`;
    }
    // цвет бордера при фокусе в зависимости от состояния (error, sucess, disabled)
    const useColorBorderFocus = () => {
        const colors = theme.palette.input;

        if (props.error) return lighten(colors.error, 0.2);
        else if (props.success) return lighten(colors.success, 0.2);
        else return lighten(colors.border, 0.3);
    }
    // цвет фона в зависимости от состояния (error, sucess, disabled)
    const useBackgroundColor = () => {
        const colors = theme.palette.input;

        if (props.error) return alpha(colors.error, 0.05);
        else if (props.success) return alpha(colors.success, 0.05);
        else return colors.main;
    }
    // цвет фона при фокусе  в зависимости от состояния (error, sucess, disabled)
    // ? можно сделать отключение выделения через глобал темы
    const useBackgroundColorFocus = () => {
        const colors = theme.palette.input;

        if (props.error) return alpha(colors.error, 0.2);
        else if (props.success) return alpha(colors.success, 0.2);
        else return alpha(colors.border, 0.15);
    }
    // эксперементальная
    const useElevation =()=> {
        const sx = {
            boxShadow: 0
        }

        if(elevation) {
            if(Math.sign(elevation) === -1) {
                const cur = Math.abs(elevation) * 0.07;
                const curb = Math.abs(elevation) * 0.02;
                sx.boxShadow = `inset 0px 0px 15px rgba(0, 0, 0, ${cur})`
                // + `, 0px 0px 7px rgba(255, 255, 255, ${curb})`
            }
            else {
                const cur = elevation * 0.05;
                const curb = elevation * 0.02;
                sx.boxShadow = `0px 0px 15px rgba(0, 0, 0, ${cur})`
                // + `, inset 0px 0px 15px rgba(255, 255, 255, ${curb})`
            }
        }

        return sx;
    }
    

    return (
        <AnimatedBox
            sx={{
                //backgroundColor: '#00000000',
                background: useBackgroundColor(),
                minHeight: '40px',
                minWidth: '160px',
                borderRadius: 1,
                ...props.sx,
                opacity: props.disabled && 0.4,
                border: useBorderColor(),
                display: 'flex',
                alignItems: 'center',
                boxShadow: useElevation(),
                backdropFilter: "blur(6px)",
                transition: 'background-color 0.3s',
                '&:focus-within': {
                    borderColor: useColorBorderFocus(),
                    color: theme.palette.text.primary,
                    backgroundColor: useBackgroundColorFocus()
                }
            }}
        >
            { children }
        </AnimatedBox>
    );
}


/** Базовый инпут */
export function InputBaseCustom({ value, onChange, type, ...props }: PropsInputBaseCustom) {
    const theme = useTheme();

    
    const filtreProps =()=> {
        delete props.borderStyle;
        delete props.success;
        delete props.toolVisible;
        delete props.labelSx
        return props;
    }
    const handleChange = debounce((newValue) => {
        onChange && onChange(newValue);
    }, 500); 
    
    
    return (
        <InputBase
            { ...filtreProps() }
            placeholder={props.placeholder}
            type={type}
            //value={value}
            defaultValue={value}
            disabled={props.disabled}
            sx={{
                minWidth: '60px',
                minHeight: '42px',
                flex: 1,
                '& input::placeholder': {
                    color: theme.palette.input.placeholder,
                    opacity: 1,
                    fontStyle: theme.mixins.input.fontStyle,
                },
                '& textarea::placeholder': {
                    color: theme.palette.input.placeholder,
                    opacity: 1,
                    fontStyle: theme.mixins.input.fontStyle,
                },
                "input::-webkit-outer-spin-button, input::-webkit-inner-spin-button": {
                    display: "none",
                },
                "input[type=number]": {
                    MozAppearance: "textfield", // Убирает стрелки в Firefox
                },
                ...props.sx
            }}
            inputProps={{ style: { textAlign: theme.mixins.input.alight, resize: 'both', } }}
            onChange={(e) => handleChange(e.target.value)}
        />
    );
}