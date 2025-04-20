import React from 'react';
import { InputBase, Paper, useTheme, InputBaseProps, InputLabel, InputLabelProps as InputLabelP, Box } from '@mui/material';
import { alpha, lighten, darken, styled, fontStyle, SxProps } from '@mui/system';



export type PropsInputBaseCustom = InputBaseProps & {
    onChange: (value: string)=> void
    styles?: {
        placeholder?: React.CSSProperties,
    }
}
export type PropsInputForm = {
    children: any
    elevation?: number
    disabled?: boolean
    error?: boolean
    success?: boolean
    sx?: SxProps
    styles?: {
        form?: {
            borderStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset' | 'none'
            borderColor?: string | 'none'
            background?: string | 'none'
        }
    }
}
export type InputLabelProps = InputLabelP & {
    styles?: {
        label?: React.CSSProperties
    }
}


const AnimatedBox = styled(Box)`
    &:hover {
        cursor: pointer;
        background-color: ${alpha('rgb(221, 235, 238)', 0.1)}; // Используем alpha для задания прозрачности
    }
`;



// базовый лейбл
export function Label({ id, children, styles, sx }: InputLabelProps) {
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
                ...sx,
                ...styles?.label
            }}
        >
            { children }
        </InputLabel>
    );
}
// базовая подложка под все инпуты (! тшательно доработать, я почти у цели)
export function InputPaper({ children, elevation, styles, ...props }: PropsInputForm) {
    const theme = useTheme();

    // цвет бордера в зависимости от состояния (error, sucess, disabled)
    const useBorderColor = () => {
        const border = (styles?.form?.borderStyle ?? props?.borderStyle) ?? 'solid';
        const colors = theme.palette.input;
        const editorBorderColor = styles?.form?.borderColor;

        if (props.error) return `1px ${border} ${colors.error}`;
        else if (props.success) return `1px ${border} ${colors.success}`;
        else return `1px ${border} ${editorBorderColor ?? colors.border}`;
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
        const styleBcg = styles?.form?.background;

        if (props.error) return alpha(colors.error, 0.05);
        else if (props.success) return alpha(colors.success, 0.05);
        else if(styleBcg && styleBcg !== 'none') return styleBcg;
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
                minHeight: '42px',
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
export function InputBaseCustom({ value, onChange, type, styles, ...props }: PropsInputBaseCustom) {
    const theme = useTheme();
    const [v, setV] = React.useState(value);
    
    const placeholderStyle = {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontWeight: 400,
        fontSize: '0.9rem',         // ≈ 14px
        //fontStyle: 'italic',
        lineHeight: 1.43,
        letterSpacing: '0.01071em',
        ...styles?.placeholder
    }
    
    const filtreProps =()=> {
        delete props.borderStyle;
        delete props.success;
        delete props.toolVisible;
        delete props.labelSx;
        delete props.divider;
        delete props.childrenSlate;
        delete props.placeholderFont;
        
        return props;
    }
    const useChange = (newValue) => {
        onChange && onChange(newValue);
    };
    React.useEffect(()=> {
        setV(value);
    }, [value]);
   
    
    return (
        <InputBase
            { ...filtreProps() }
            placeholder={props.placeholder}
            type={type}
            value={v}
            disabled={props.disabled}
            sx={{
                width: '100%',
                minWidth: '60px',
                minHeight: '40px',
                background: 'transparent',
                padding: 0,
                flex: 1,
                '& input': {
                    position: 'relative',
                    zIndex: 2,
                    background: 'transparent',
                    minHeight: 28,
                    padding: 0,
                    //border: '1px solid red',
                },
                '& input::placeholder, & textarea::placeholder': placeholderStyle,
                "input::-webkit-outer-spin-button, input::-webkit-inner-spin-button": {
                    display: "none",
                },
                "input[type=number]": {
                    MozAppearance: "textfield", // Убирает стрелки в Firefox
                },
                ...props.sx
            }}
            inputProps={{ style: { textAlign: theme.mixins.input.alight, resize: 'both', } }}
            onChange={(e) => useChange(e.target.value)}
        />
    );
}