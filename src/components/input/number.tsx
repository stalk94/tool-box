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
    const isMounted = React.useRef(false);
    const [inputValue, setInputValue] = React.useState<number>(0);
    const [rawInput, setRawInput] = React.useState<string>('0');
  
    const updateValue = (val: number) => {
        const clamped = Math.max(min, Math.min(val, max));
        setInputValue(clamped);
        setRawInput(String(clamped));
        onChange?.(clamped);
    }
    const handleInputChange = (raw: string) => {
        setRawInput(raw);

        const cleaned = raw.replace(/[^\d-]/g, '');
        const parsed = parseInt(cleaned, 10);

        if (!isNaN(parsed)) {
            updateValue(parsed);
        }
    }
    const handleInputChangeOld = (raw: string) => {
        setRawInput(raw);

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
    const handleBlur = () => {
        const cleaned = rawInput.replace(/[^\d-]/g, '');
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
        if (typeof value === 'number' && value !== inputValue && isMounted.current) {
            setInputValue(value);
            setRawInput(value);
        } 
        else if (!isMounted.current) {
            isMounted.current = true;
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
                onChange={handleInputChange}
                onBlur={handleBlur}
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