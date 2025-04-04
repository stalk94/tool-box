import React, { useState } from "react";
import { Check, ExpandMore, ChevronRight } from "@mui/icons-material";
import { MenuItem, ListItemIcon, List, ListItemText, ListItem, Collapse, Box, Divider, useTheme } from "@mui/material";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';


export type StateNavLinks = {
    /** данные для badge */
    badge?: number | React.ReactNode
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


// todo: застилизировать
// Компонент для рендера элементов меню с поддержкой подменю
export default function({ item, onItemClick }: MobailMenuProps) {
    const theme = useTheme();
    const colorSelect = theme.palette.menu.select;
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
    if (item?.divider) {
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
        </React.Fragment>
    );
}
