import React, { useState } from "react";
import { Check, ExpandMore, ChevronRight } from "@mui/icons-material";
import { MenuItem, ListItemIcon, List, ListItemText, ListItem, Collapse, Box, Divider, useTheme } from "@mui/material";


export type StateNavLinks = {
    badge?: number 
}
export interface NavLinkItem {
    id: string
    label?: string
    icon?: React.ReactNode
    /** 🔥 кастомный параметр подсветит элемент как выбранный */
    select?: any
    comand?: (item: any) => void
    divider?: React.ReactNode | boolean
    /** ℹ️ можно передавать доп данные элемента */
    state?: StateNavLinks
    children?: NavLinkItem[]
}
export type MobailMenuProps = {
    item: NavLinkItem
    onItemClick: (item: NavLinkItem) => void
}



// Компонент для рендера элементов меню с поддержкой подменю
export default function({ item, onItemClick }: MobailMenuProps) {
    const theme = useTheme();
    const colorSelect = theme.palette.action.active;
    const [open, setOpen] = useState(false);


    const renderChek = (
        <Check sx={{color:'#6bef62',opacity: 0.6,fontSize:16}} />
    );
    const handleClick = () => {
        if (item.children) {
            setOpen(!open);
        } 
        if (!item.children) {
            onItemClick(item);
            item.comand?.(item);
        }
    }
    if (item.divider) {
        if(typeof item.divider === 'boolean') return(
            <Divider sx={{ width: '100%' }}/>
        );

        return (
            <Box sx={{mt:1,mb:1}} display="flex" justifyContent="center" width="100%">
                { item.divider }
            </Box>
        );
    }
    React.useEffect(()=> {
        if(item.children) {
            if(item.children.find((elem)=> elem.select)) setOpen(true);
        }
    }, [item]);


    return (
        <React.Fragment>
            <MenuItem 
                sx={{ backgroundColor: item.select ? colorSelect: 'transparent' }}
                onClick={handleClick}
            >
                {/* иконка */}
                { item.icon && 
                    <ListItemIcon>
                        { React.cloneElement(item.icon, {sx: {opacity: 1}}) }
                    </ListItemIcon>
                }
                {/* текст пункта */}
                <ListItemText 
                    primary={item.label} 
                />
                {/* иконка раскрыть вложенные */}
                { item.children && (
                    open 
                        ? <ExpandMore sx={{opacity: 0.6}} /> 
                        : <ChevronRight sx={{opacity: 0.6}}  />
                )}
                {/* выбранный элемент */}
                { item.select && renderChek }
            </MenuItem>

            {/* Если имеются вложенные */}
            { item.children && (
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding sx={{ml:0.5, mr: 0.5}}>
                        { item.children.map((childItem, childIndex) => (
                            <ListItem
                                key={childIndex}
                                button='true'
                                sx={{ 
                                    cursor: 'pointer', 
                                    pl: 4, 
                                    background: childItem.select ? colorSelect : '#0000001a',
                                }}
                                onClick={()=> {
                                    childItem.comand?.(childItem);
                                    onItemClick(childItem);
                                }}
                            >
                                { childItem.icon && 
                                    <ListItemIcon sx={{minWidth: 36}}>
                                        { childItem.icon }
                                    </ListItemIcon>
                                }
                                <ListItemText secondary={childItem.label} />
                                {/* выбранный элемент */}
                                { childItem.select && renderChek }
                            </ListItem>
                        ))}
                    </List>
                </Collapse>
            )}
        </React.Fragment>
    );
}
