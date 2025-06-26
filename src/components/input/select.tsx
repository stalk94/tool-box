import React from 'react';
import { useTheme, alpha, Select, MenuItem, FormControl } from '@mui/material';
import { InputPaper } from './atomize';
import { NavLinkItemSlider } from '../menu/type';
import { ExpandMore } from '@mui/icons-material';
import { StylesProps } from './type';

export type BaseSelectProps = {
    value: any
    onChange?: (newValue: string)=> void
    items: NavLinkItemSlider[]
    placeholder?: string
    position?: 'start' | 'end'
    onlyId?: boolean
    variant: "fullWidth" | "inset" | "middle"
    borderStyle?: 'dashed' | 'solid' | 'dotted'
    styles?: StylesProps 
}


export default function ({ value, onChange, items, placeholder, ...props }: BaseSelectProps) {
    const [selected, setSelected] = React.useState({});
    

    const placeholderStyle = {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontWeight: 400,
        fontSize: '0.9rem',         // ≈ 14px
        lineHeight: 1.43,
        letterSpacing: '0.01071em',
        paddingLeft: props.left ? 9 : 18,
        ...props?.styles?.placeholder
    }
    const handleSelectItem = (id: string) => {
        const item = items.find(i => i.id === id);
        if (!item) return;

        setSelected(item);
        if (onChange) {
            if (props.onlyId) onChange(item.id);
            else onChange(item);
        }
    }
    React.useEffect(()=> {
        if (typeof window === 'undefined') return;
        
        if(value) {
            if(typeof value === 'object') setSelected(value);
            else setSelected({ id: value, label: value });
        }
    }, [value]);

    
    return(
        <InputPaper {...props}>
            <Select
                IconComponent={ExpandMore}
                value={selected}
                onChange={(event)=> handleSelectItem(event.target.value)}
                displayEmpty
                style={{
                    backgroundColor: 'none',
                    background: 'none',
                }}
                sx={{
                    maxHeight: 40,
                    width: '100%',
                    backgroundColor: 'none',
                    background: 'none',
                    border: '0px',
                    fontSize: '0.9rem',
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                    },
                    '& .MuiSelect-icon': {
                       mr: 0.5,
                       mt: 0.3,
                       height: '50%',
                        ...props?.styles?.icon,
                    }
                }}
                renderValue={(selected) => {
                    if (!selected) return (
                        <span style={placeholderStyle}>
                            { placeholder }
                        </span>
                    );
                    const item = items.find((i) => i.id === selected.id);
                    return item?.label ?? selected.id;
                }}
            >
                { items.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                        { item.label }
                    </MenuItem>
                ))}
            </Select>
        </InputPaper>
    );
}
