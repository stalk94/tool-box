import React from 'react';
import { Box, useTheme } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import InputBase, { InputBaseProps } from '@mui/material/InputBase';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import { colors, variants } from './buttons';


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
        if(props.error) return `1px dotted ${theme.palette.error.light}`;
        else if(props.disabled) return `1px dotted ${theme.palette.action.disabled}`;
        else if(props.success) return `1px dotted ${theme.palette.success.light}`;
        else return `1px dotted ${theme.palette.action.disabled}`;
    }
    
    return(
        <Paper
            component="form"
            sx={{ 
                opacity: props.disabled && 0.6,
                display: 'flex', 
                alignItems: 'center', 
                width: '100%',
                border: chek()
            }}
        >
            { children && position === 'start' && 
                <React.Fragment>
                    { children }
                    <Divider flexItem orientation="vertical" variant={variant} />
                </React.Fragment>
            }
            <InputBase 
                sx={{ ml: 2, mt: 0.4, flex: 1 }}
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
    Input: Base,
    Base: BaseInput
}