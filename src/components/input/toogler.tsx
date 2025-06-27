import React from 'react';
import { IconButton, Box, Popover, ToggleButtonGroup, useTheme } from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import { MoreHoriz } from '@mui/icons-material';
import { safeOmitInputProps } from '../hooks/omit';
import type { TooglerInputProps } from './type';


export default function TooglerInput({ items, value, label, onChange, isColapsed, ...props }: TooglerInputProps) {
    const theme = useTheme();
    const [curentValue, setCurent] = React.useState<string[]>([]);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);


    const handleOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);
    const handlerChange = (newValue) => {
        if (Array.isArray(value) || props.multi) {
            setCurent(newValue);
            onChange && onChange(newValue);
        } else {
            const last = newValue[newValue.length - 1];
            setCurent([last]);
            onChange && onChange(last);
        }
    }
    React.useEffect(() => {
        if (typeof window === 'undefined') return;

        if (typeof value === 'string') {
            setCurent([value]);
        } else if (Array.isArray(value)) {
            setCurent([...value]);
        }
    }, [value]);


    const visibleItems = isColapsed
        ? items.filter((i) => curentValue.includes(i.id))
        : items;
    const hiddenItems = isColapsed
        ? items.filter((i) => !curentValue.includes(i.id))
        : [];
    const filteredProps = React.useMemo(() => {
        return safeOmitInputProps(props, ['borderStyle', 'success', 'error', 'labelSx'])
    }, [props]);


    return (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <ToggleButtonGroup
                value={curentValue}
                onChange={(e, v) => handlerChange(v)}
                aria-label={label}
                { ...filteredProps }
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    width: '100%',
                    ...props.sx,
                    border: props?.styles?.form?.borderColor && '1px solid',
                    ...props?.styles?.form,
                }}
            >
                {visibleItems.map((elem, index) => (
                    <ToggleButton
                        sx={{
                            flex: 1,
                            border: `1px solid ${theme.palette.input.border}`,
                            height: props?.style?.height ?? 36,
                            ...props?.styles?.button,
                            overflowWrap: 'normal',
                            wordBreak: 'keep-all',
                            "&.Mui-selected": {
                                opacity: props.disabled ? 0.5 : 1,
                            },
                        }}
                        key={index}
                        value={elem.id}
                        aria-label={elem.id}
                    >
                        {elem.label}
                    </ToggleButton>
                ))}
            </ToggleButtonGroup>

            {isColapsed && hiddenItems.length > 0 && (
                <>
                    <IconButton onClick={handleOpen} size="small" sx={{ height: 26 }}>
                        <MoreHoriz />
                    </IconButton>
                    <Popover
                        open={!!anchorEl}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                        PaperProps={{
                            sx: {
                                p: 0.5,
                                maxWidth: 300,
                                overflowY:'auto'
                            },
                        }}
                    >
                        <ToggleButtonGroup
                            orientation="horizontal"
                            value={curentValue}
                            onChange={(e, v) => {
                                handlerChange(v);
                                handleClose();
                            }}
                            sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 1,
                                ...props.sx,
                                border: props?.styles?.form?.borderColor && '1px solid',
                                ...props?.styles?.form,
                            }}
                        >
                            {hiddenItems.map((elem, index) => (
                                <ToggleButton
                                    key={index}
                                    value={elem.id}
                                    aria-label={elem.id}
                                    sx={{
                                        border: `1px solid ${theme.palette.input.border}`,
                                        flex: '1 0 16%',
                                        minWidth: 20,
                                        maxWidth: '100%',
                                        whiteSpace: 'nowrap',
                                        height: props?.style?.height ?? 32,
                                        ...props?.styles?.button,
                                        overflowWrap: 'normal',
                                        wordBreak: 'keep-all',
                                        "&.Mui-selected": {
                                            opacity: props.disabled ? 0.5 : 1,
                                        },
                                    }}
                                >
                                    {elem.label}
                                </ToggleButton>
                            ))}
                        </ToggleButtonGroup>
                    </Popover>
                </>
            )}
        </Box>
    );
}