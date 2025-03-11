import React from 'react';
import { useTheme } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent, SelectProps } from '@mui/material/Select';


type ItemsSelect = {
    value: any
    label: any
}
type PropsSelect = {
    value: any
    onChange?: (newValue: string)=> void
    items: ItemsSelect[]
    label?: string
}
type CustomSelectProps = PropsSelect & SelectProps; 



export default function({ value, onChange, items, label, ...props }: CustomSelectProps) {
    const theme = useTheme();
    const handleChange =(event: SelectChangeEvent)=> {
        if(onChange) onChange(event.target.value as string);
    }


    return(
        <FormControl fullWidth>
            { label &&
                <InputLabel id="demo-simple-select-label">
                    { label }
                </InputLabel>
            }
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={value}
                label={label}
                onChange={handleChange}
                {...props}
                MenuProps={{
                    PaperProps: {
                        style: {
                            background: theme.palette.background.paper
                        },
                    },
                }}
            >
                { items.map((elem, index)=> 
                    <MenuItem key={index} value={elem.value}>
                        { elem.label }
                    </MenuItem>
                ) }
            </Select>
        </FormControl>
    );
}