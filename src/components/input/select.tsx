import React from 'react';
import { useTheme, alpha, Box } from '@mui/material';
import Divider from '@mui/material/Divider';
import { SelectProps } from '@mui/material/Select';
import { ArrowDropDown } from '@mui/icons-material';
import { InputPaper } from './atomize';
import Menu from '../menu/index';
import ItemsList from '../menu/list';
import { NavLinkItemSlider } from '../menu/type';


export type BaseSelectProps = {
    value: any
    onChange?: (newValue: string)=> void
    items: NavLinkItemSlider[]
    placeholder?: string
    position?: 'start' | 'end'
    variant: "fullWidth" | "inset" | "middle"
    borderStyle?: 'dashed' | 'solid' | 'dotted'
}



export default function Custom({ value, onChange, items, placeholder, ...props }: BaseSelectProps) {
    const theme = useTheme();
    const [width, setWidth] = React.useState('200px');
    const [isOpen, setIsOpen] = React.useState(false);
    const [selected, setSelected] = React.useState(value);
    const selectRef = React.useRef<HTMLDivElement>(null);

    const base = {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'row'
    }

    const chekSelected =(item, selected)=> {
        if(props.onlyId && item.id === selected) return item.label;
        else if(item.id === selected.id) return item.label;
    }
    const chekLabel =()=> {
        if(placeholder && placeholder.length > 0) return placeholder;
        else return 'Выбрать';
    }
    const handleToggleDropdown =()=> {
        if(!props.disabled) {
            setIsOpen(!isOpen);
        }
    }
    const handleSelectItem =(item)=> {
        setSelected(item);
        if(onChange) {
            if(props.onlyId) onChange(item.id);
            else onChange(item);
        }
        setIsOpen(false);
    }
    React.useEffect(()=> {
        const observer = new ResizeObserver(() => {
            if (selectRef.current) {
                setWidth(selectRef.current.getBoundingClientRect().width);
            }
        });
      
        if (selectRef.current) {
            observer.observe(selectRef.current);
        }

        return ()=> {
            if (selectRef.current) {
                observer.unobserve(selectRef.current);
            }
        }
    }, []);


    return(
        <InputPaper {...props}>
        <div tabIndex={0} style={base} ref={selectRef}>
            <div
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
                    color: selected ? theme.palette.text.primary : theme.palette.text.secondary
                }}
            >
                <div style={{
                        marginLeft: '5%',
                        fontSize: '16px'
                    }}
                >
                    { selected && items.find((item)=> 
                        chekSelected(item, selected))?.label
                    } 
                    { !selected &&  chekLabel() }
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
                            color: !isOpen ? theme.palette.text.primary : theme.palette.text.secondary
                        }} 
                    /> 
                </div>
            </div>
            
            {/* выпадалка */}
            <Menu
                anchorEl={selectRef.current}
                open={isOpen}
                onClose={()=> setIsOpen(false)}
                width={width}
            >
                { items.map((item, index)=> 
                    <ItemsList
                        key={index}
                        item={item}
                        onItemClick={handleSelectItem}
                    />
                )}
            </Menu>    
        </div>
        </InputPaper>
    );
}