import React, { useState, useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/ru';
import { Box, IconButton, Popover, useTheme } from '@mui/material';
import { DateField, TimeField, MobileDatePicker, MobileTimePicker, StaticDatePicker, StaticTimePicker, } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { CalendarMonth, AccessTime } from '@mui/icons-material';
import { InputPaper } from './atomize';


export type DateTimeInputProps = {
    value?: string;
    onChange?: (value: string) => void;
    type?: 'date' | 'time';
    variant?: 'modal' | 'popup';
    format?: string;
    placeholder?: string;
    disabled?: boolean;
}


// todo: adapterLocale вынести в основной контекст
export default function DateTimeInput({
    value,
    onChange,
    type = 'date',
    variant = 'popup',
    format,
    placeholder,
    disabled,
    ...props
}: DateTimeInputProps) {
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [parsedValue, setParsedValue] = useState<Dayjs | null>(null);

    const isTime = type === 'time';
    const icon = isTime ? <AccessTime /> : <CalendarMonth />;
    const dateFormat = format || (isTime ? 'HH:mm' : 'YYYY-MM-DD');
    const inputSlotProps = {
        textField: {
            fullWidth: true,
            variant: 'standard',
            InputProps: {
                disableUnderline: true,
                sx: { textAlign: 'center', pl:1 }
            },
            sx: {
                '& input::placeholder': { 
                    color: theme.palette.input.placeholder,
                    opacity: 1,
                    fontStyle: theme.mixins.input.fontStyle,
                    ...props?.styles?.placeholder
                 },
            }
        },
    }
    

    const emit = (newDate: Dayjs | null) => {
        if (!newDate?.isValid()) return;
        const formatted = newDate.format(dateFormat);
        setParsedValue(newDate);
        onChange?.(formatted);
    }
    const handleManualChange = (val: string) => {
        const parsed = dayjs(val, dateFormat);
        if (parsed.isValid()) emit(parsed);
    }
    const handleClick = (e: React.MouseEvent<HTMLElement>) => {
        if (disabled) return;
        variant === 'popup'
            ? setAnchorEl(e.currentTarget)
            : setModalOpen(true);
    }
    useEffect(() => {
        if (value) {
            const parsed = dayjs(value, dateFormat);
            setParsedValue(parsed.isValid() ? parsed : null);
        }
    }, [value, dateFormat]);


    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
            <InputPaper disabled={disabled} {...props}>
                <Box
                    onClick={handleClick}
                    sx={{
                        cursor: disabled ? 'not-allowed' : 'pointer',
                        opacity: disabled ? 0.4 : 1,
                    }}
                >
                    <IconButton 
                        disabled={disabled} 
                        sx={{color: theme.palette.action.active, ml:0.2, ...props?.styles?.icon}}
                    >
                        { icon }
                    </IconButton>
                </Box>

                {isTime ? (
                    <TimeField
                        value={parsedValue}
                        onChange={emit}
                        format={dateFormat}
                        disabled={disabled}
                        slotProps={inputSlotProps}
                    />
                    ) : (
                    <DateField
                        value={parsedValue}
                        onChange={emit}
                        format={dateFormat}
                        disabled={disabled}
                        slotProps={inputSlotProps}
                    />
                )}
            </InputPaper>

            {/* Модальный режим — MUI управляет диалогом */}
            {variant === 'modal' && (
                isTime ? (
                    <MobileTimePicker
                        value={parsedValue}
                        onChange={emit}
                        onClose={() => setModalOpen(false)}
                        open={modalOpen}
                        ampm={false}
                        slotProps={{
                            textField: {
                              style: { display: 'none' }
                            }
                        }}
                    />
                ) : (
                    <MobileDatePicker
                        value={parsedValue}
                        onChange={emit}
                        onClose={() => setModalOpen(false)}
                        open={modalOpen}
                        slotProps={{
                            textField: {
                                style: { display: 'none' }
                            }
                        }}
                    />
                )
            )}

            {/* Попап — вручную отрисовываем */}
            {variant === 'popup' && (
                <Popover
                    elevation={3}
                    sx={{
                        mt: 0.8,
                        borderRadius: 5,
                    }}
                    open={Boolean(anchorEl)}
                    anchorEl={anchorEl}
                    onClose={() => setAnchorEl(null)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                >
                    <Box sx={{ p: 0 }}>
                        {isTime ? (
                            <StaticTimePicker
                                value={parsedValue}
                                onChange={(val) => {
                                    emit(val);
                                    setAnchorEl(null);
                                }}
                                ampm={false}
                            />
                            ) : (
                            <StaticDatePicker
                                value={parsedValue}
                                onChange={(val) => {
                                    emit(val);
                                    setAnchorEl(null);
                                }}
                            />
                        )}
                    </Box>
                </Popover>
            )}
        </LocalizationProvider>
    );
}