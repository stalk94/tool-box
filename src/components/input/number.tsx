import React from 'react';
import { InputBase, useTheme, IconButton, SxProps } from '@mui/material';
import { InputBaseProps } from '@mui/material/InputBase';
import { Add, Remove } from '@mui/icons-material';
import { InputPaper, InputBaseCustom,  } from './atomize';


export type NumberInputProps = {
    value?: number
    min?: number
    max?: number
    step?: number
    onChange?: (value: number)=> void
} & InputBaseProps



export default function NumberInput({ value, min=-10, max=100, step=1, onChange, ...props }: NumberInputProps) {
    const theme = useTheme();
    const [inputValue, setInputValue] = React.useState<number>(0);
  
    const updateValue = (val: number) => {
        const clamped = Math.max(min, Math.min(val, max));
        setInputValue(clamped);
        onChange?.(clamped);
    }
    const handleInputChange = (raw: string) => {
        if (raw.trim() === '') {
            setInputValue(0); // можно отобразить пустое поле
            return;
        }

        // Только цифры, поддержка минуса
        const cleaned = raw.replace(/[^\d-]/g, '');
        const parsed = parseInt(cleaned, 10);

        if (!isNaN(parsed)) {
            updateValue(parsed);
        }
    }
    const decrease = () => updateValue(inputValue - step);
    const increase = () => updateValue(inputValue + step);

    React.useEffect(() => {
        if(value !==undefined ) setInputValue(value);
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
                value={inputValue}
                type="text"
                onChange={handleInputChange}
                disabled={props.disabled}
                sx={{
                    flex: 1,
                    '& input': {
                        textAlign: 'center',
                        paddingLeft: 0,
                        paddingRight: 0,
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