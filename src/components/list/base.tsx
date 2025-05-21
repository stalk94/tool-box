import React from 'react';
import { List, ListItem, ListItemText, ListItemIcon, ListItemAvatar, Divider, ListItemButton, Box } from '@mui/material';
import { Search, RadioButtonChecked, Circle, Info, CheckCircle } from '@mui/icons-material';


type ItemList = {
    id?: string | number
    startIcon?: React.ReactNode
    primary: string | React.ReactNode
    secondary?: string | React.ReactNode
}
export type ListCustomProps = {
    onClick?: (index: number, item: ItemList)=> void
    items: ItemList[]
    style?: React.CSSProperties
    styles?: {
        primary?: React.CSSProperties
        secondary?: React.CSSProperties
        icon?: React.CSSProperties
    } 
}



export default function({ items, onClick, style, styles }: ListCustomProps) {
    const RenderButton =(item: ItemList, children, index: number)=> {
        return(
            <ListItemButton 
                sx={{p: 0}}
                onClick={()=> onClick(index, item)}
            >
                { children }
            </ListItemButton>
        );
    }
    const RenderList = (item: ItemList) => (
        <ListItem disablePadding>
            {item.startIcon &&
                <ListItemIcon
                    sx={{
                        ...styles?.icon
                    }}
                >
                    { item.startIcon }
                </ListItemIcon>
            }
            <ListItemText
                slotProps={{
                    primary: {
                        sx: {
                            ...styles?.primary
                        }
                    },
                    secondary: {
                        sx: {
                            ...styles?.secondary
                        }
                    }
                }}
                primary={item.primary}
                secondary={item.secondary}
            />
        </ListItem>
    );


    return (
        <List
            sx={{
                minWidth: 120,
                padding: 0.5,
                ...style
            }}
        >
            {onClick &&
                items.map((item, index)=> 
                    <React.Fragment key={index}>
                        { RenderButton(item, RenderList(item), index) }
                    </React.Fragment>
            )}
            {!onClick &&
                items.map((item, index)=> 
                    <React.Fragment key={index}>
                        {  RenderList(item) }
                    </React.Fragment>
            )}
        </List>
    );
}



/**
 *   <ListItemIcon
                        sx={{
                            ml: 'auto',
                            minWidth: 'unset',
                            alignSelf: 'center',
                        }}
                    >
                        <InboxIcon />
                    </ListItemIcon>
 */