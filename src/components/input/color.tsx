import React, { useState } from 'react';
import { Popover, IconButton, useTheme, Dialog, Box } from '@mui/material';
import { InputPaper, InputBaseCustom } from './atomize';
import { RgbaColorPicker, RgbaColor } from 'react-colorful';
import { FileCopy } from '@mui/icons-material';
import { useDebounced } from '../hooks/debounce';
import type { ColorPickerProps, ColorWindowProps } from './type';


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
const ColorWindow =({ color, onChange, sx }: ColorWindowProps)=> (
    <Box
        sx={{
            p: 1.5,
            //background: '#343434f9',
            //border: '1px solid #79787840',
            '& .react-colorful': {
                width: '45vw',
                height: '45vh',
                ...sx
            },
        }}
        onMouseDown={(e) => e.preventDefault()}
        onFocus={(e) => e.preventDefault()}
        tabIndex={-1}
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
    const [color, setColor] = useState<RgbaColor>(parseRgba(value ?? ''));
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
        //setAnchorEl(null);
    }


    React.useEffect(() => {
        if (typeof window === 'undefined') return;
        
        if (value) {
            setColor(parseRgba(value));
        }
    }, [value]);


    return (
        <>
            <Box className='Select'
                onClick={handleOpen}
                //onMouseEnter={handleOpen}
                sx={{
                    width: 30,
                    height: 30,
                    borderRadius: 1,
                    background: toRgbaString(color),
                    cursor: 'pointer',
                    border: `1px solid ${theme.palette.input.border}`,
                    opacity: props.disabled && 0.5,
                    m: 1,
                    position: variant === 'custom' && 'relative'
                }}
                style={{ ...props.style, padding: 0 }}
            />

            {variant === 'custom' && modalOpen && (
                <div
                    style={{
                        borderRadius: 5,
                        padding: 0,
                        position: 'fixed',
                        background: '#333',
                        border: '1px solid #555',
                        zIndex: 999999,
                    }}
                >
                    <ColorWindow 
                        sx={{
                            width: '20vw',
                            height: '25vh',
                        }}
                        color={color} 
                        onChange={handlePickerChange} 
                    />
                </div>
            )}

            {variant === 'popup' && (
                <Popover
                    elevation={3}
                    sx={{
                        mt: 1,
                        borderRadius: 5,
                        padding: 0
                    }}
                    open={Boolean(anchorEl)}
                    anchorEl={anchorEl}
                    onClose={() => setAnchorEl(null)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                >
                    <ColorWindow 
                        sx={{
                            width: '20vw',
                            height: '25vh',
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
    const isMounted = React.useRef(false);
    const [inputValue, setInputValue] = useState(String(value));
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [color, setColor] = useState<RgbaColor>(parseRgba(String(value)));


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

    React.useEffect(() => {
        if (value && isMounted.current) {
            setInputValue(String(value));
            setColor(parseRgba(String(value)));
        }
        else if(!isMounted.current) {
            isMounted.current = true;
        }
    }, [value]);
  

    return (
        <InputPaper {...props}>
            <Box
                onClick={(e) => {
                    variant === 'popup'
                        ? !props.disabled && setAnchorEl(e.currentTarget)
                        : !props.disabled && setModalOpen(true);
                }}
                sx={{
                    width: '10%',
                    height: '70%',
                    borderRadius: 1,
                    background: inputValue,
                    cursor: 'pointer',
                    marginLeft: 1,
                    marginRight: 2,
                }}
            />

            <InputBaseCustom
                {...props}
                type='text'
                value={inputValue}
                onChange={handleManualChange}
                placeholder={props.placeholder}
                styles={props?.styles}
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