import React from 'react';
import { NativeSelect, styled, useTheme } from '@mui/material';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Select, { SelectChangeEvent, SelectProps } from '@mui/material/Select';
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';
import '../style/index.css';


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
type BaseSelectProps = {
    value: any
    onChange?: (newValue: string)=> void
    items: ItemsSelect[]
    label?: any
    position?: 'start' | 'end'
    variant: "fullWidth" | "inset" | "middle"
    borderStyle?: 'dashed' | 'solid' | 'dotted'
}
type CustomSelectProps = PropsSelect & SelectProps; 



function Base({ value, onChange, items, label, ...props }: CustomSelectProps) {
    const theme = useTheme();
    const handleChange =(event: SelectChangeEvent)=> {
        if(onChange) onChange(event.target.value as string);
    }


    return(
        <div className="select-wrapper">
            <select style={{
                background: 'none',
                height: '100%',
                width: '100%',
                border: 'none',
                padding: '1rem',
                color: theme.palette.grey[400]
            }}
                value={value}
                label={label}
                onChange={handleChange}
            >
                {items.map((elem, index)=>
                    <option key={index} 
                        value={elem.value}
                    >
                        { elem.label }
                    </option>
                )}
            </select>
        </div>
    );
}
function Custom({ value, onChange, items, label, ...props }: CustomSelectProps) {
    const theme = useTheme();
    const [isOpen, setIsOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState(value);
    const selectRef = React.useRef<HTMLDivElement>(null);


    const chekLabel =()=> {
        if(label && label.length > 0) return label;
        else return 'Выбрать';
    }
    const handleToggleDropdown =()=> {
        if(!props.disabled) setIsOpen(!isOpen);
    }
    const handleSelectItem =(itemValue: string, itemLabel: string)=> {
        setSelectedValue(itemValue);
        if(onChange) onChange(itemValue);
        setIsOpen(false);
    }
    React.useEffect(()=> {
        const handleClickOutside =(event: MouseEvent)=> {
            if(selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
    
        document.addEventListener('mousedown', handleClickOutside);
        return ()=> document.removeEventListener('mousedown', handleClickOutside);
    }, []);


    return(
        <div className="custom-select" ref={selectRef}>
            <div className="selected"
                onClick={handleToggleDropdown}
                style={{
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    color: theme.palette.text.secondary
                }}
            >
                <div style={{
                        marginLeft: '5%',
                        fontSize: '16px'
                    }}
                >
                    { selectedValue && items.find((item)=> item.value === selectedValue)?.label } 
                    { !selectedValue &&  chekLabel() }
                </div>
                <div
                    style={{
                        marginLeft: 'auto',
                        transformOrigin: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Divider flexItem orientation="vertical" variant='fullWidth' />
                    <ArrowDropDown sx={{
                            marginLeft: '5px',
                            marginRight: '5px',
                            fontSize: '1.8rem',
                            transition: 'transform 0.3s ease',
                            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        }} 
                    /> 
                </div>
            </div>
            { isOpen &&
                <ul className="dropdown" 
                    style={{ background: theme.palette.background.paper }}
                >
                    { items.map((item)=> (
                        <li key={item.value}
                            onClick={()=> handleSelectItem(item.value, item.label)}
                            style={{
                                backgroundColor: selectedValue === item.value ? theme.palette.action.active : 'none',
                                border: selectedValue === item.value && `1px dotted ${theme.palette.primary.dark}`,
                                borderRadius: '3px',
                                color: theme.palette.text.secondary,
                                cursor: 'pointer',
                            }}
                        >
                            { item.label }
                        </li>
                    ))}
                </ul>
            }
        </div>
    );
}



function BaseSelect({ value, onChange, items, label, variant, ...props }: BaseSelectProps) {
    const theme = useTheme();

    const chek =()=> {
        const border = props?.borderStyle ?? 'solid';

        if(props.error) return `1px ${border} ${theme.palette.error.light}`;
        else if(props.disabled) return `1px ${border} ${theme.palette.action.disabled}`;
        else if(props.success) return `1px ${border} ${theme.palette.success.light}`;
        else return `1px ${border} ${theme.palette.action.active}`;
    }
    

    return(
        <Paper
            //component="form"
            sx={{ 
                opacity: props.disabled && 0.6,
                border: chek(),
                boxShadow: '0px 3px 3px rgba(0, 0, 0, 0.2)'
            }}
        >
            <Custom 
                value={value}
                disabled={props.disabled}
                label={label} 
                items={items ?? []}
                onChange={onChange}
            />
        </Paper>
    );
}



export default {
    Select: BaseSelect
}