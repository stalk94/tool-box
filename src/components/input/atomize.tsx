import React from 'react';
import { InputBase, Paper, useTheme, InputBaseProps, InputLabel, InputLabelProps } from '@mui/material';
import { alpha, lighten, darken, styled } from '@mui/system';


const AnimatedPaper = styled(Paper)`
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

    //? работает ли это так как надо
    const useColorBorderFocus = () => {
        if (props.error) return theme.palette.error.light;
        else if (props.disabled) return theme.palette.action.disabled;
        else if (props.success) return theme.palette.success.light;
        else return lighten(theme.palette.action.active, 1);
    }
    // цвет бордера в зависимости от состояния (error, sucess, disabled)
    const useBorderColor = () => {
        const border = props?.borderStyle ?? 'solid';

        if (props.error) return `1px ${border} ${theme.palette.error.light}`;
        else if (props.disabled) return `1px ${border} ${theme.palette.action.disabled}`;
        else if (props.success) return `1px ${border} ${theme.palette.success.light}`;
        else return `1px ${border} ${theme.palette.action.active}`;
    }
    //! цвет фона в зависимости от состояния (error, sucess, disabled)
    const useBackgroundColor =()=> {

    }
    
    
    return (
        <AnimatedPaper
            sx={{
                //background: '#00000000',
                backgroundColor: alpha(theme.palette.background.input, 0.4),
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
                    borderColor: lighten(useColorBorderFocus(), 0.1),
                    color: theme.palette.text.primary,
                    backgroundColor: alpha('rgb(255, 255, 255)', 0.2)
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
    

    return (
        <InputBase
            {...props}
            placeholder={props.placeholder}
            type={type}
            value={value}
            sx={{
                minWidth: '60px',
                minHeight: '42px',
                flex: 1,
                '& input::placeholder': {
                    color: theme.palette.placeholder.main,
                    opacity: 1,
                    fontStyle: theme.elements.input.fontStyle
                },
                '& textarea::placeholder': {
                    color: theme.palette.placeholder.main,
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