import React, { useState } from 'react';
import { Popover, IconButton, useTheme, Dialog, InputBaseProps, Box } from '@mui/material';
import { InputPaper, InputBaseCustom, Label } from './atomize';
import { RgbaColorPicker, RgbaColor } from 'react-colorful';
import { FileCopy } from '@mui/icons-material';
import { useDebounced } from '../hooks/debounce';


export type ColorPickerProps = InputBaseProps & {
    value?: string
    onChange?: (value: string)=> void
    /** включить ли кнопку копирования данных ввода */
    showCopy?: boolean,
    variant?: 'popup' | 'modal'
}
const parseRgba = (rgba: string): RgbaColor => {
    const match = rgba.match(/rgba?\((\d+), (\d+), (\d+),? ([0-9.]+)?\)/);
    if (!match) return { r: 255, g: 0, b: 0, a: 1 };
    return {
        r: +match[1],
        g: +match[2],
        b: +match[3],
        a: parseFloat(match[4]) || 1,
    };
}
const toRgbaString = ({ r, g, b, a }: RgbaColor) => {
    return `rgba(${r}, ${g}, ${b}, ${a})`;
}
const ColorWindow =({ color, onChange, sx })=> (
    <Box
        sx={{
            p: 3,
            borderRadius: 5,
            '& .react-colorful': {
                width: '45vw',
                height: '45vh',
                ...sx
            },
        }}
    >
        <RgbaColorPicker
            className="react-colorful"
            color={color}
            onChange={onChange}
        />
        <style>
            {`
                .react-colorful__saturation {
                    border-radius: 8px;
                }
                .react-colorful__hue {
                    margin-left: 10px;
                    margin-right: 10px;
                    border-radius: 6px;
                    margin-top: 20px;
                }
                .react-colorful__alpha {
                    margin-left: 10px;
                    margin-right: 10px;
                    border-radius: 6px;
                    margin-top: 20px;
                }
                .react-colorful__pointer {
                    cursor: pointer;
                    width: 22px;
                    height: 22px;
                    border: 2px solid rgb(199, 199, 199);
                    box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
                }
            `}
        </style>
    </Box>
);


export function ColorPickerCompact({ value='rgba(255, 0, 0, 1)', onChange, showCopy, variant='popup', ...props }: ColorPickerProps) {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [color, setColor] = useState<RgbaColor>(parseRgba(value));
    const [modalOpen, setModalOpen] = useState(false);
    const theme = useTheme();


    const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
        if(!props.disabled) {
            if(variant === 'popup') setAnchorEl(e.currentTarget);
            else setModalOpen(true);
        }
    }
    const debouncedEmit = useDebounced((val: string) => {
        onChange?.(val);
    }, 100, [onChange]);
    const handlePickerChange = (val: RgbaColor) => {
        const str = toRgbaString(val);
        setColor(val);
        debouncedEmit(str);
    }


    React.useEffect(() => {
        if (value) {
            setColor(parseRgba(value));
        }
    }, [value]);


    return (
        <>
            <Box
                onClick={handleOpen}
                sx={{
                    width: 30,
                    height: 30,
                    borderRadius: 1,
                    background: toRgbaString(color),
                    cursor: 'pointer',
                    border: `1px solid ${theme.palette.input.border}`,
                    opacity: props.disabled && 0.5,
                    m: 1
                }}
            />
            {variant === 'popup' && (
                <Popover
                    elevation={3}
                    sx={{
                        mt: 1,
                        borderRadius: 5,
                    }}
                    open={Boolean(anchorEl)}
                    anchorEl={anchorEl}
                    onClose={() => setAnchorEl(null)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                >
                    <ColorWindow 
                        sx={{
                            width: '25vw',
                            height: '27vh',
                        }}
                        color={color} 
                        onChange={handlePickerChange} 
                    />
                </Popover>
            )}

            {variant === 'modal' && (
                <Dialog 
                    slotProps={{
                        paper: {
                            sx: {
                                background: 'transparent',
                            },
                        },
                    }}
                    open={modalOpen} 
                    onClose={() => setModalOpen(false)}
                >
                    <ColorWindow 
                        color={color} 
                        onChange={handlePickerChange} 
                    />
                </Dialog>
            )}
        </>
    );
}

export default function ColorPicker({value='rgba(255, 0, 0, 1)', onChange, showCopy, variant='popup', ...props }: ColorPickerProps) {
    const theme = useTheme();
    const [inputValue, setInputValue] = useState(value);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [color, setColor] = useState<RgbaColor>(parseRgba(value));


    const debouncedEmit = useDebounced((val: string) => {
        onChange?.(val);
    }, 100, [onChange]);
    const handlePickerChange = (val: RgbaColor) => {
        const str = toRgbaString(val);
        setInputValue(str);
        setColor(val);
        debouncedEmit(str);
    }
    const handleManualChange = (val: string) => {
        setInputValue(val);
        onChange?.(val);
    }
    const handleCopy = () => {
        navigator.clipboard.writeText(inputValue);
    }

    const trigger = (
        <Box
            onClick={(e) => {
                variant === 'popup'
                    ? !props.disabled && setAnchorEl(e.currentTarget)
                    : !props.disabled && setModalOpen(true);
            }}
            sx={{
                width: 30,
                height: 30,
                borderRadius: 1,
                background: inputValue,
                cursor: 'pointer',
                border: `1px solid ${theme.palette.divider}`,
                marginLeft: 1,
                marginRight: 1,
            }}
        />
    );

    React.useEffect(() => {
        if (value) {
            setInputValue(value);
            setColor(parseRgba(value));
        }
    }, [value]);
  

    return (
        <InputPaper {...props}>
            { trigger }

            <InputBaseCustom
                {...props}
                type='text'
                value={inputValue}
                onChange={handleManualChange}
                placeholder={props.placeholder}
            />

            {showCopy && (
                <IconButton onClick={handleCopy} disabled={props.disabled}>
                    <FileCopy style={{ color: theme.palette.text.secondary, opacity: 0.6 }} />
                </IconButton>
            )}

            {variant === 'popup' && (
                <Popover
                    elevation={3}
                    sx={{
                        mt: 1,
                        borderRadius: 5,
                    }}
                    open={Boolean(anchorEl)}
                    anchorEl={anchorEl}
                    onClose={() => setAnchorEl(null)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                >
                    <ColorWindow 
                        sx={{
                            width: '25vw',
                            height: '27vh',
                        }}
                        color={color} 
                        onChange={handlePickerChange} 
                    />
                </Popover>
            )}

            {variant === 'modal' && (
                <Dialog 
                    slotProps={{
                        paper: {
                            sx: {
                                background: 'transparent',
                            },
                        },
                    }}
                    open={modalOpen} 
                    onClose={() => setModalOpen(false)}
                >
                    <ColorWindow 
                        color={color} 
                        onChange={handlePickerChange} 
                    />
                </Dialog>
            )}
        </InputPaper>
    );
}