import React from 'react';
import dayjs from 'dayjs';
import { Dialog, DialogActions, DialogContent, Box, useTheme, IconButton, Button } from '@mui/material';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { DateField, DateFieldProps, TimeField } from '@mui/x-date-pickers';
import { CalendarMonth, AccessTime } from '@mui/icons-material';
import { InputLabel, TextField } from '@mui/material';  //? разобрать
import 'dayjs/locale/ru';


type DataPickerCustomProps = {
    error?: boolean;
    success?: boolean;
    disabled?: boolean;
    borderStyle?: string;
    onChange?: (value: any) => void;
    value: any;
    variant?: 'middle' | 'fullWidth' | 'inset' | 'none';
    left?: React.ReactNode;
    isTimePicker?: boolean;
}


const Picker =({ value, open, handleClose, onChange, isTimePicker })=> {
    const [selectedDate, setSelectedDate] = React.useState(value ?? dayjs());

    const handleDateChange =(newDate: any)=> {
        setSelectedDate(newDate); // Обновляем выбранную дату
        onChange(newDate);
    }
    const handleTimeChange =(newTime: any)=> {
        setSelectedDate(newTime);
        onChange(newTime);
    }

    return(
        <Dialog open={open} onClose={handleClose}>
            <DialogContent>

                { isTimePicker ? (
                    <MobileTimePicker
                        value={selectedDate}
                        onChange={handleTimeChange}
                        open={open}
                        onClose={handleClose}
                    />
                ) : (
                    <MobileDatePicker
                        value={selectedDate}
                        onChange={handleDateChange}
                        open={open}
                        onClose={handleClose}
                    />
                )}
            
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose} color="primary">Закрыть</Button>
            </DialogActions>
        </Dialog>
    );
}


// ? доработать момент с календарем если дата введена пользователем в неполном формате
// ? локализация
export function DatePickerCustom({ value, variant, left, onChange, isTimePicker=false, ...props }: DataPickerCustomProps) {
    const [open, setOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState<any>(value);
    const theme = useTheme();
    dayjs.locale('ru');         //!? это меняет локализацию


    const chek =()=> {
        const border = props?.borderStyle ?? 'solid';

        if(props.error) return `1px ${border} ${theme.palette.error.light}`;
        else if(props.disabled) return `1px ${border} ${theme.palette.action.disabled}`;
        else if(props.success) return `1px ${border} ${theme.palette.success.light}`;
        else return `1px ${border} ${theme.palette.action.active}`;
    }
    const useFiltre =(value: string)=> {
        setInputValue(value);
        if(onChange) onChange(value);
    }

    
    return(
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Paper
            style={{ 
                opacity: props.disabled && 0.6,
                display: 'flex', 
                alignItems: 'center', 
                border: chek(),
                boxShadow: '0px 3px 4px rgba(0, 0, 0, 0.2)',
                position: 'relative'
            }}
        >
            { left && 
                <React.Fragment>
                    { left }
                    { variant !== 'none' && 
                        <Divider flexItem orientation="vertical" variant={variant??'middle'} />
                    }
                </React.Fragment>
            }
        
            { isTimePicker
                ? (
                    <TimeField
                        value={inputValue}
                        onChange={(newValue) => useFiltre(newValue)}
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                variant: 'standard',
                                InputProps: {
                                    disableUnderline: true,
                                    sx: { textAlign: 'center', input: { textAlign: 'center' } }, // Центровка ввода
                                },
                            },
                        }}
                    />
                )
                : (
                    <DateField 
                        value={inputValue}
                        onChange={(newValue)=> useFiltre(newValue)}
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                variant: 'standard',
                                InputProps: {
                                    disableUnderline: true,
                                    sx: { textAlign: 'center', input: { textAlign: 'center' } }, // Центровка ввода
                                },
                            },
                        }}
                    />
                )
            }

            <React.Fragment>
                { variant !== 'none' && 
                    <Divider sx={{mr:'5px'}} flexItem orientation="vertical" variant={variant??'fullWidth'} />
                }
                <IconButton color='inherit' onClick={() => setOpen(true)}>
                    { isTimePicker 
                        ? <AccessTime sx={{opacity:'0.6'}} /> 
                        : <CalendarMonth sx={{opacity:'0.6'}} />
                    }
                </IconButton>
            </React.Fragment>
        </Paper>

        { open &&
            <Picker 
                value={inputValue} 
                open={open} 
                onChange={useFiltre} 
                handleClose={()=> setOpen(false)}
                isTimePicker={isTimePicker}
            />
        }
        </LocalizationProvider>
    )
}

