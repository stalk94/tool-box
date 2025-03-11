import React from 'react';
import { Box, useTheme } from '@mui/material';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import InputBase, { InputBaseProps } from '@mui/material/InputBase';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import TextField, { TextFieldProps } from '@mui/material/TextField';


type CustomInputProps = {
    onChange?: (value: string)=> void
    start?: React.ReactNode
    end?: React.ReactNode
} & TextFieldProps
type MyInputProps = {
    position?: 'end' | 'start'
    placeholder?: string
    children?: React.ReactNode
    variant: "fullWidth" | "inset" | "middle"
    onChange?: (value: string)=> void
    success: boolean
    borderStyle?: 'dashed' | 'solid' | 'dotted'
} & InputBaseProps



function Base({ value, start, end, onChange, ...props }: CustomInputProps) {
    const theme = useTheme();
    const renderStartOrEnd =()=> {
        const base = {};

        if(start) base.startAdornment = (
            <InputAdornment position="start">
                { start }
            </InputAdornment>
        );
        if(end) base.endAdornment = (
            <InputAdornment position="end">
                { end }
            </InputAdornment>
        );

        return base;
    }

    return(
        <FormControl fullWidth sx={{ m: 0.5 }}>
            <TextField
                slotProps={{
                    input: renderStartOrEnd(),
                }}
                value={value}
                onChange={(event: React.ChangeEvent<HTMLInputElement>)=> {
                    if(onChange) onChange(event.target.value);
                }}
                {...props}
            />
            
        </FormControl>
    );
}
function BaseInput({ position, onChange, placeholder, variant, children, ...props }: MyInputProps) {
    const theme = useTheme();
    
    const chek =()=> {
        const border = props?.borderStyle ?? 'solid';

        if(props.error) return `1px ${border} ${theme.palette.error.light}`;
        else if(props.disabled) return `1px ${border} ${theme.palette.action.disabled}`;
        else if(props.success) return `1px ${border} ${theme.palette.success.light}`;
        else return `1px ${border} ${theme.palette.action.active}`;
    }
    
    
    return(
        <Paper
            //component="form"
            style={{ 
                opacity: props.disabled && 0.6,
                display: 'flex', 
                alignItems: 'center', 
                border: chek(),
                boxShadow: '0px 3px 4px rgba(0, 0, 0, 0.2)'
            }}
        >
            { children && position === 'start' && 
                <React.Fragment>
                    { children }
                    <Divider flexItem orientation="vertical" variant={variant} />
                </React.Fragment>
            }
            <InputBase 
                sx={{ ml: 4, flex: 1, fontSize:'16px' }}
                placeholder={placeholder}
                onChange={(event)=> {
                    if(onChange) onChange(event.target.value);
                }}
                {...props}
            />
         
            { position !== 'start' && children &&
                <React.Fragment>
                    <Divider flexItem orientation="vertical" variant={variant} />
                    { children }
                </React.Fragment>
            }
        </Paper>
    );
}



export default {
    Base: Base,
    Input: BaseInput
}