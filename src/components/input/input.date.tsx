import React from 'react';
import dayjs from 'dayjs';
import { Dialog, DialogActions, DialogContent, useTheme, IconButton, Button } from '@mui/material';
import Divider from '@mui/material/Divider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { DateField, DateFieldProps, TimeField } from '@mui/x-date-pickers';
import { CalendarMonth, AccessTime } from '@mui/icons-material';
import { InputPaper } from './input.any';
import 'dayjs/locale/ru';


export type DataPickerCustomProps = {
    error?: boolean;
    success?: boolean;
    disabled?: boolean;
    borderStyle?: string;
    onChange?: (value: any) => void;
    value: any;
    variant?: 'middle' | 'fullWidth' | 'inset';
    left?: React.ReactNode;
    isTimePicker?: boolean;
}


const Picker =({ value, open, handleClose, onChange, isTimePicker })=> {
    const [selectedDate, setSelectedDate] = React.useState(value??dayjs());

    const handleDateChange =(newDate: any)=> {
        if (dayjs.isDayjs(newDate) && newDate.isValid()) {
            setSelectedDate(newDate);
            onChange(newDate);
        }
    }
    const handleTimeChange =(newTime: any)=> {
        if (dayjs.isDayjs(newTime) && newTime.isValid()) {
            setSelectedDate(newTime);
            onChange(newTime);
        }
    }
    
    

    return(
        <Dialog open={open} onClose={handleClose}>
            <DialogContent sx={{ display: 'none' }}>
                { isTimePicker ? (
                    <MobileTimePicker
                        value={selectedDate}
                        onChange={handleTimeChange}
                        open={open}
                        onClose={handleClose}
                        //views={["hours", "minutes"]}
                        //ampm={false}
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
        </Dialog>
    );
}


// ? локализация
export function DatePickerCustom({ value, variant, left, onChange, isTimePicker=false, ...props }: DataPickerCustomProps) {
    const [open, setOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState<any>();
    const theme = useTheme();


    const useFiltre =(value)=> {
        let formatted = value.format();
        
        if(isTimePicker) {
            formatted = value.format('HH:mm');  
        }
        else {
            formatted = value.format('YYYY-MM-DD');  
        }

        if(onChange) onChange(formatted);
    }

    React.useEffect(() => {
        dayjs.locale('ru');
    }, []);
    React.useEffect(() => {
        if(isTimePicker) setInputValue(dayjs(value, 'HH:mm'));
        else setInputValue(dayjs(value, 'YYYY-MM-DD'));
    }, [value]);
    

    return(
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <InputPaper {...props} >
            { left && 
                <React.Fragment>
                    { left }
                    { variant && 
                        <Divider flexItem orientation="vertical" variant={variant} />
                    }
                </React.Fragment>
            }
        
            { isTimePicker
                ? (
                    <TimeField
                        value={inputValue}
                        onChange={(newValue) => useFiltre(newValue)}
                        ampm={false}
                        inputProps={{style: {textAlign: theme.elements.input.alight}}}
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                variant: 'standard',
                                InputProps: {
                                    disableUnderline: true,
                                    sx: { textAlign: 'center', ml:'15px' },
                                },
                                sx: {
                                    '& input::placeholder': { 
                                        color: theme.palette.placeholder.main,
                                        opacity: 1,
                                        fontStyle: theme.elements.input.fontStyle
                                     },
                                }
                            },
                        }}
                    />
                )
                : (
                    <DateField 
                        value={inputValue}
                        onChange={(newValue)=> useFiltre(newValue)}
                        inputProps={{style: {textAlign: theme.elements.input.alight}}}
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                variant: 'standard',
                                InputProps: {
                                    disableUnderline: true,
                                    sx: { textAlign: 'center', ml:'15px' },
                                },
                                sx: {
                                    '& input::placeholder': { 
                                        color: theme.palette.placeholder.main,
                                        opacity: 1,
                                        fontStyle: theme.elements.input.fontStyle
                                     },
                                }
                            },
                        }}
                    />
                )
            }

            <React.Fragment>
                { variant || theme.elements.input.variant && 
                    <Divider sx={{mr:'5px'}} flexItem orientation="vertical" variant={variant ?? theme.elements.input.variant} />
                }
                <IconButton color='inherit' onClick={() => setOpen(true)}>
                    { isTimePicker 
                        ? <AccessTime style={{color:theme.palette.text.secondary, opacity:'0.6'}} /> 
                        : <CalendarMonth style={{color:theme.palette.text.secondary, opacity:'0.6'}} />
                    }
                </IconButton>
            </React.Fragment>
        </InputPaper>

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

