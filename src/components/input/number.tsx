import React from 'react';
import { InputBase, useTheme, IconButton, SxProps } from '@mui/material';
import ButtonGroup from '@mui/material/ButtonGroup';
import { Add, Remove } from '@mui/icons-material';
import { InputPaper, InputBaseCustom  } from './atomize';


export type NumberinputProps = {
    value?: number
    min?: number
    max?: number
    step?: number
    onChange?: (value: number)=> void
    sx: SxProps
}


export default function NumberInput({ value, min=0, max=100, step=1, onChange, ...props }: NumberinputProps) {
    const theme = useTheme();
    const [inputValue, setInputValue] = React.useState<number>(value ?? 0);


    const handleIncrease =()=> {
        if (inputValue < max) {
            const newValue = inputValue + step;
            setInputValue(newValue);
            onChange && onChange(newValue);
        }
    }
    const handleDecrease =()=> {
        if (inputValue > min) {
            const newValue = inputValue - step;
            setInputValue(newValue);
            onChange && onChange(newValue);
        }
    }
    const handleChange = (value) => {
        const newValue = parseInt(value, 10);
        
        if (!isNaN(newValue)) {
            if(newValue < max && newValue > min) {
                setInputValue(newValue);
                onChange && onChange(newValue);
            }
        }
        else {
            setInputValue(0);
            onChange && onChange(0);
        }
    }
    const renderleft =()=> {
        return(
            <ButtonGroup
                orientation="horizontal"
                sx={{
                    p: 0,
                    display: {
                        xs: 'block',
                        md: 'none'
                    }
                }}
            >
                <IconButton
                    onClick={handleDecrease}
                    disabled={inputValue <= min}
                >
                    <Remove
                        sx={{
                            color: theme.palette.text.secondary,
                            opacity: inputValue <= min ? '0.2' : '0.6',
                        }}
                    />
                </IconButton>
            </ButtonGroup>
        );
    }
    const renderRight =()=> {
        return(
            <ButtonGroup
                orientation="horizontal"
            >
                <IconButton
                    onClick={handleDecrease}
                    disabled={inputValue <= min}
                    sx={{
                        p: 0,
                        display: {
                            xs: 'none',
                            md: 'block'
                        }
                    }}
                >
                    <Remove
                        sx={{
                            color: theme.palette.text.secondary,
                            opacity: inputValue <= min ? '0.2' : '0.6',
                            p: 0,
                            mt: 1, 
                            //fontSize: '20px'
                        }}
                    />
                </IconButton>
                <IconButton
                    onClick={handleIncrease}
                    disabled={inputValue >= max}
                >
                    <Add
                        style={{
                            color: theme.palette.text.secondary,
                            opacity: inputValue >= max ? '0.2' : '0.6',
                        }}
                    />
                </IconButton>
            </ButtonGroup>
        );
    }


    return(
        <InputPaper {...props}>

            { renderleft() }

            <InputBaseCustom
                value={inputValue}
                type="text" 
                onChange={handleChange}
                sx={{ 
                    flex: 1, 
                    '& input': {
                        justifyItems: {
                            xs: 'center',
                            md: 'left'
                        },
                        pl: {
                            xs: 0,
                            md: 3
                        }
                    },                
                }}
            />

            { renderRight() }

        </InputPaper>
    );
}