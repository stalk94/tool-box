import React from 'react';
import { useTheme, IconButton } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import { InputPaper, InputBaseCustom,  } from './atomize';
import type { NumberInputProps } from './type';




export default function NumberInput({ value, min=-1000, max=1000, step=1, onChange, ...props }: NumberInputProps) {
    const theme = useTheme();
    const [inputValue, setInputValue] = React.useState<number>(0);
    const [rawInput, setRawInput] = React.useState<string>('0');
  
    const updateValue = (val: number) => {
        const clamped = Math.max(min, Math.min(val, max));
        setInputValue(clamped);
        setRawInput(String(clamped));
        onChange?.(clamped);
    }
    const handleInputChange = (raw: string) => {
        const cleaned = raw?.replace(/[^\d-]/g, '');
        const parsed = parseInt(cleaned, 10);

        if (!isNaN(parsed)) {
            updateValue(parsed);
        }
    }
    const handleBlur = () => {
        const cleaned = rawInput?.replace(/[^\d-]/g, '');
        const parsed = parseInt(cleaned, 10);

        if (!isNaN(parsed)) {
            updateValue(parsed);
        } 
        else {
            updateValue(0);
        }
    }
    const decrease = () => updateValue(inputValue - step);
    const increase = () => updateValue(inputValue + step);

    React.useEffect(() => {
        if (typeof window === 'undefined') return;

        if (typeof value === 'number') {
            setInputValue(value);
            setRawInput(String(value));
        }
    }, [value]);
    
    const isMin = inputValue <= min;
    const isMax = inputValue >= max;
  

    return (
        <InputPaper {...props} disabled={props.disabled}>
            <IconButton onClick={decrease} disabled={isMin || props.disabled}>
                <Remove
                    sx={{
                        color: theme.palette.text.secondary,
                        opacity: isMin ? 0.2 : 0.6,
                        ...props?.styles?.icon
                    }}
                />
            </IconButton>

            <InputBaseCustom
                value={rawInput}
                type="text"
                onChange={(v)=> handleInputChange(String(v))}
                onBlur={handleBlur}
                disabled={props.disabled}
                sx={{
                    flex: 1,
                    '& input': {
                        textAlign: 'center',
                        paddingLeft: 0,
                        paddingRight: 0,
                        fontSize: '0.91rem',
                    },
                }}
                styles={props.styles}
            />

            <IconButton onClick={increase} disabled={isMax || props.disabled}>
                <Add
                    sx={{
                        color: theme.palette.text.secondary,
                        opacity: isMax ? 0.2 : 0.6,
                        ...props?.styles?.icon
                    }}
                />
            </IconButton>
        </InputPaper>
    );
}