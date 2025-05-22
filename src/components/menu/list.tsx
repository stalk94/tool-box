import React, { useState } from "react";
import { Check, ExpandMore, ChevronRight } from "@mui/icons-material";
import { MenuItem, ListItemIcon, List, ListItemText, ListItem, Collapse, MenuItemProps, Divider, useTheme } from "@mui/material";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { NavLinkItem } from './type';


export type ListProps = MenuItemProps & {
    item: NavLinkItem
    onItemClick: (item: NavLinkItem) => void
}



/** 
 * Компонент для рендера элементов списка выпадающего меню, с поддержкой вложенности(1 lvl)     
 * наследуется от MenuItem MUI
 */ 
export default function({ item, onItemClick }: ListProps) {
    const theme = useTheme();
    const isMounted = React.useRef(false);
    const colorSelect = theme.palette?.menu?.select;
    const [open, setOpen] = useState(false);
    
    
    const renderIcon =(item, isTop: boolean)=> {
        if(item.icon) return (
            React.cloneElement(item.icon, {
                sx: { 
                    fontSize: isTop ? 20 : 18 
                }
            })
        )
        else if(!item.icon) return(
            <FiberManualRecordIcon 
                sx={{ 
                    fontSize: isTop ? 12 : 10, 
                    pl: 0.5 
                }} 
            />
        );
    }
    const handleClick = () => {
        if (item.children) {
            setOpen(!open);
        } 
        if (!item.children) {
            onItemClick(item);
            item.comand?.(item);
        }
    }
    React.useEffect(()=> {
        if(item.children && isMounted.current) {
            if(item.children.find((elem)=> elem.select)) setOpen(true);
        }
        else if(!isMounted.current) {
            isMounted.current = true;
        }
    }, [item]);


    return (
        <React.Fragment>
            <MenuItem 
                sx={{ backgroundColor: item.select ? colorSelect: 'transparent' }}
                onClick={handleClick}
            >
                {/* иконка */}
                <ListItemIcon sx={{ minWidth: 26 }}>
                    { renderIcon(item, true) }
                </ListItemIcon>

                {/* текст пункта */}
                <ListItemText primary={item.label} />
                {/* иконка раскрыть вложенные */}
                { item.children && (
                    open 
                        ? <ExpandMore sx={{opacity: 0.6}} /> 
                        : <ChevronRight sx={{opacity: 0.6}}  />
                )}
            </MenuItem>

            {/* Если имеются вложенные, это вложенный список */}
            { item.children && (
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding sx={{ml:0.5, mr: 0.5}}>
                        { item.children.map?.((childItem, childIndex) => (
                            <ListItem
                                key={childIndex}
                                button='true'
                                sx={{ 
                                    cursor: 'pointer', 
                                    pl: 3, 
                                    background: childItem.select ? colorSelect : '#0000001a',
                                    opacity: 0.8,
                                }}
                                onClick={()=> {
                                    childItem.comand?.(childItem);
                                    onItemClick(childItem);
                                }}
                            >
                                {/* иконка вложенного */}
                                <ListItemIcon sx={{ minWidth: '32px' }}>
                                    { renderIcon(item, false) }
                                </ListItemIcon>
                                
                                <ListItemText 
                                    primary={childItem.label} 
                                />
                            </ListItem>
                        ))}
                    </List>
                </Collapse>
            )}
            {/* если в схеме есть свойство `divider` */}
            { item.divider &&  
                <Divider 
                    style={{ 
                        width: '100%',
                        margin: 0 
                    }}
                />
            }
        </React.Fragment>
    );
}
