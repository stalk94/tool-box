import React, { useState } from 'react';
import { InputBase, Paper, useTheme, InputBaseProps, InputLabel , InputLabelProps } from '@mui/material';
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
    
    return(
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
            { children }
        </InputLabel>
    );
}
// базовая подложка под все инпуты
export function InputPaper({ children, ...props }) {
    const theme = useTheme();

    const getColorBorder =()=> {
        if(props.error) return theme.palette.error.light;
        else if(props.disabled) return theme.palette.action.disabled;
        else if(props.success) return theme.palette.success.light;
        else return lighten(theme.palette.action.active, 1);
    }
    const useBorderColor =()=> {
        const border = props?.borderStyle ?? 'solid';
        
        if(props.error) return `1px ${border} ${theme.palette.error.light}`;
        else if(props.disabled) return `1px ${border} ${theme.palette.action.disabled}`;
        else if(props.success) return `1px ${border} ${theme.palette.success.light}`;
        else return `1px ${border} ${theme.palette.action.active}`;
    }


    return(
        <AnimatedPaper
            sx={{
                //background: '#00000000',
                backgroundColor: alpha(theme.palette.background.input, 0.4),
                minHeight: '42px',
                minWidth: '190px',
                opacity: props.disabled && 0.5,
                border: useBorderColor(),
                display: 'flex',
                alignItems: 'center',
                boxShadow: 0,
                backdropFilter: "blur(6px)",
                transition: 'background-color 0.3s',
                '&:focus-within': { 
                    borderColor: lighten(getColorBorder(), 0.1),
                    color: theme.palette.text.primary,
                    backgroundColor: alpha('rgb(255, 255, 255)', 0.2)
                }
            }}
        >
            { children }
        </AnimatedPaper>
    );
}
// базовая форма ввода
export function InputBaseCustom({ value, onChange, type, ...props }: InputBaseProps) {
    const theme = useTheme();


    return(
        <InputBase
            placeholder={props.placeholder}
            type={type}
            value={value}
            sx={{ 
                minWidth: '105px',
                flex: 1, 
                pl: '5px',
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
                ...props.sx
            }}
            inputProps={{style: {textAlign: theme.elements.input.alight}}}
            onChange={(e)=> onChange && onChange(e.target.value)}
            { ...props }
        />
    );
}