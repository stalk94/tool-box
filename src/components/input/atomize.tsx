import React from 'react';
import { InputBase, Paper, useTheme, InputBaseProps, InputLabel, InputLabelProps } from '@mui/material';
import { alpha, lighten, darken, styled } from '@mui/system';


const AnimatedPaper = styled(Paper)`
    &:hover {
        cursor: pointer;
        background-color: ${alpha('rgb(221, 235, 238)', 0.1)}; // Используем alpha для задания прозрачности
    }
`;


// ! не стилизован
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
                fontFamily: '"Roboto Condensed", Arial, sans-serif',
                ...sx
            }}
        >
            {children}
        </InputLabel>
    );
}
// базовая подложка под все инпуты (! тшательно доработать, я почти у цели)
export function InputPaper({ children, ...props }) {
    const theme = useTheme();

    // цвет бордера в зависимости от состояния (error, sucess, disabled)
    const useBorderColor = () => {
        const border = props?.borderStyle ?? 'solid';
        const colors = theme.palette.input;

        if (props.error) return `1px ${border} ${colors.error}`;
        else if (props.success) return `1px ${border} ${colors.success}`;
        else return `1px ${border} ${colors.mainBorder}`;
    }
    // цвет бордера при фокусе в зависимости от состояния (error, sucess, disabled)
    const useColorBorderFocus = () => {
        const colors = theme.palette.input;

        if (props.error) return lighten(colors.error, 0.2);
        else if (props.success) return lighten(colors.success, 0.2);
        else return lighten(colors.mainBorder, 0.3);
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
        else return alpha(colors.mainBorder, 0.15);
    }
    

    return (
        <AnimatedPaper
            sx={{
                //background: '#00000000',
                background: useBackgroundColor(),
                minHeight: '40px',
                minWidth: '160px',
                ...props.sx,
                opacity: props.disabled && 0.4,
                border: useBorderColor(),
                display: 'flex',
                alignItems: 'center',
                boxShadow: 0,
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
        </AnimatedPaper>
    );
}


/** Базовый инпут */
export function InputBaseCustom({ value, onChange, type, ...props }: InputBaseProps) {
    const theme = useTheme();
    const filtre =()=> {
        delete props.borderStyle;
        delete props.success;
        return props;
    }

    return (
        <InputBase
            {...filtre()}
            placeholder={props.placeholder}
            type={type}
            value={value}
            disabled={props.disabled}
            sx={{
                minWidth: '60px',
                minHeight: '42px',
                flex: 1,
                '& input::placeholder': {
                    color: theme.palette.input.placeholder,
                    opacity: 1,
                    fontStyle: theme.elements.input.fontStyle
                },
                '& textarea::placeholder': {
                    color: theme.palette.input.placeholder,
                    opacity: 1,
                    fontStyle: theme.elements.input.fontStyle
                },
                "input::-webkit-outer-spin-button, input::-webkit-inner-spin-button": {
                    display: "none",
                },
                "input[type=number]": {
                    MozAppearance: "textfield", // Убирает стрелки в Firefox
                },
                ...props.sx
            }}
            inputProps={{ style: { textAlign: theme.elements.input.alight } }}
            onChange={(e) => onChange && onChange(e.target.value)}
        />
    );
}