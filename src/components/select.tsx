import React from 'react';
import { NativeSelect, styled, useTheme } from '@mui/material';
import Divider from '@mui/material/Divider';
import Select, { SelectChangeEvent, SelectProps } from '@mui/material/Select';
import { ArrowDropDown } from '@mui/icons-material';
import { InputPaper } from './input.any';
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
export type BaseSelectProps = {
    value: any
    onChange?: (newValue: string)=> void
    items: ItemsSelect[]
    placeholder?: string
    position?: 'start' | 'end'
    variant: "fullWidth" | "inset" | "middle"
    borderStyle?: 'dashed' | 'solid' | 'dotted'
}
type CustomSelectProps = PropsSelect & SelectProps; 



function Custom({ value, onChange, items, label, ...props }: CustomSelectProps) {
    const theme = useTheme();
    const [isOpen, setIsOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState(value);
    const [isHovered, setIsHovered] = React.useState(false);
    const selectRef = React.useRef<HTMLDivElement>(null);

    const base = {
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'row'
    }
    const dropdown = {
        position: 'absolute',
        borderRadius: '3px',
        top: '100%',
        left: 0,
        width: '100%',
        padding: 0,
        marginTop: '5px',
        listStyle: 'none',
        borderTop: 'none',
        overflowY: 'auto',
        zIndex: 10
    }


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
        <div style={base} ref={selectRef}>
            <div className="selected"
                onClick={handleToggleDropdown}
                style={{
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%',
                    padding: 'auto',
                    margin: '6px',
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
                <ul className='dropdown' style={{...dropdown, background: theme.palette.background.paper }} >
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



export default function({ value, onChange, items, placeholder, variant, ...props }: BaseSelectProps) {
    return(
        <InputPaper {...props}>
            <Custom 
                value={value}
                disabled={props.disabled}
                label={placeholder} 
                items={items ?? []}
                onChange={onChange}
            />
        </InputPaper>
    );
}