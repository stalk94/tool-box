import React from 'react';
import { Button, Menu, ButtonProps } from '@mui/material';
import { ArrowDropDown } from '@mui/icons-material';
import ItemsList, { NavLinkItem } from './menuItem';
import { alpha, styled } from '@mui/material/styles';


type ItemSelect = NavLinkItem & {
    parent?: ItemSelect
}
type SelectButtonProps = ButtonProps & {
    value?: ItemSelect
    defaultLabel: string 
    items: ItemSelect[]
    onChange: (item: ItemSelect)=> void
}



export default function SelectButton({ value, defaultLabel, items, onChange, ...props }: SelectButtonProps) {
    const [current, setCurrent] = React.useState<ItemSelect | undefined>(value);
    const [isOpen, setIsOpen] = React.useState(false);
    const ref = React.useRef<HTMLButtonElement>(null);


    const transformedItems = React.useMemo(()=> {
        const transform = (items: ItemSelect[], parent?: ItemSelect): ItemSelect[] => {
            return items.map((item)=> {
                const newItem = { ...item, parent };

                if (item.children) {
                    newItem.children = transform(item.children, newItem);
                }

                return newItem;
            });
        };

        return transform(items);
    }, [items]);

    const findItemById = (items: ItemSelect[], id: string): ItemSelect | undefined => {
        for (const item of items) {
            if (item.id === id) return item;
            if (item.children) {
                const found = findItemById(item.children, id);
                if (found) return found;
            }
        }
        return undefined;
    }
    const handleItemClick = (item: ItemSelect) => {
        if (onChange) {
            onChange(item);
        }
        setCurrent(item);
        setIsOpen(false);
    }
    const getLabel = () => {
        if (!current) return defaultLabel;

        return current.parent ? (
            <React.Fragment>
                { current.parent.icon 
                    ? React.cloneElement(current.parent.icon, {style:{paddingTop:'2px',marginRight: '3px'}})
                    :  <label style={{ marginTop: 'auto', fontWeight:'bolder'}}>{ current.parent.label }</label>
                }
                <label style={{ margin: '0px 4px' }}>/</label>
                <label style={{ marginTop: 'auto', opacity: 0.7, fontSize: '12px' }}>
                    { current.label }
                </label>
            </React.Fragment>
        ) : current.label;
    }

    React.useEffect(()=> {
        if (value?.id) {
            const foundItem = findItemById(transformedItems, value.id);
            setCurrent(foundItem);
        } 
        else setCurrent(undefined);
    }, [value, transformedItems]);


    return (
        <React.Fragment>
            <Button
                ref={ref}
                onClick={()=> setIsOpen(!isOpen)}
                endIcon={
                    <ArrowDropDown
                        sx={{
                            marginLeft: '5px',
                            marginRight: '5px',
                            fontSize: '1.8rem',
                            transition: 'transform 0.3s ease',
                            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        }}
                    />
                }
                {...props}
            >
                { getLabel() }
            </Button>
            <Menu elevation={2}
                anchorEl={ref.current}
                open={isOpen}
                onClose={() => setIsOpen(false)}
                sx={{ 
                    mt: 0.5,
                    "& .MuiPaper-root": {
                        backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.1),
                        backdropFilter: "blur(14px)", // Размытие для эффекта стекла
                    }
                }}
                PaperProps={{ style: { maxHeight: '70vh', minWidth: '200px' } }}
            >
                {transformedItems.map((item, index) => (
                    <ItemsList 
                        key={index} 
                        item={item} 
                        onItemClick={handleItemClick} 
                    />
                ))}
            </Menu>
        </React.Fragment>
    );
}