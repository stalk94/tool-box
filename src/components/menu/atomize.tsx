import React from "react";
import ItemMenuList, { NavLinkItem } from './list';
import { Menu, alpha, MenuProps } from "@mui/material";


export interface CustomMenuProps extends MenuProps {
    anchorEl: null | HTMLElement
    open: boolean
    onClose: () => void
    navLinks?: NavLinkItem[]
    /** children отобразится выше nav links(если он передан) */
    children?: React.ReactNode
}

// todo: застилизировать красиво
/** Базовое выпадаюшее меню */ 
export default function({ anchorEl, open, onClose, navLinks, children, ...props }: CustomMenuProps) {
    
    return (
        <Menu
            PaperProps={{
                style: {
                    maxHeight: '70vh',
                    minWidth: '200px'
                },
            }}
            { ...props }
            elevation={props.elevation ?? 0}
            sx={{ 
                mt: 2, 
                "& .MuiPaper-root": {
                    backgroundColor: (theme)=> theme.palette?.menu?.main,
                    backdropFilter: "blur(14px)",
                },
                ...props.sx
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={onClose}
        >
            { children }
            { navLinks && navLinks.map((item, index) => (
                <ItemMenuList key={index}
                    item={item}
                    onItemClick={() => onClose()}
                />
            ))}
        </Menu>
    );
}