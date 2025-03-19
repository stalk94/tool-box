import React, { useState } from "react";
import { Menu, alpha, MenuProps } from "@mui/material";
import ItemMenuList, { NavLinkItem } from './list';

export interface NavMenuProps {
    anchorEl: null | HTMLElement;
    open: boolean;
    onClose: () => void;
    navLinks: NavLinkItem[];
    isMobile: boolean;
}
type LeftNavMenuProps = MenuProps & {
    anchorEl: any
    open: boolean
    handleClose: ()=> void
    children: React.ReactNode
}


// Выпадающее меню левого меню навигации
export function LeftNavMenu({ anchorEl, open, handleClose, children, ...props }: LeftNavMenuProps) {

    return(
        <Menu elevation={1}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            { ...props }
            sx={{
                ml: 0.5,
                "& .MuiPaper-root": {
                    backgroundColor: (theme)=> alpha(theme.palette.background.paper, 0.8),
                    backdropFilter: "blur(14px)",
                }
            }}
        >
            { children }
        </Menu>
    );
}


// Выпадающее меню верхней навигации
export default function({ anchorEl, open, onClose, navLinks, isMobile }: NavMenuProps) {
    return (
        <Menu elevation={2}
            sx={{ 
                mt: isMobile ? 1.2 : 2, 
                ml: isMobile ? 1 : 8,
                "& .MuiPaper-root": {
                    backgroundColor: (theme)=> alpha(theme.palette.background.paper, 0.1),
                    backdropFilter: "blur(14px)",
                }
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={onClose}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            PaperProps={{
                style: {
                    maxHeight: '70vh',
                    minWidth: '200px'
                },
            }}
        >
            { navLinks.map((item, index) => (
                <React.Fragment key={index}>
                    <ItemMenuList 
                        item={item} 
                        onItemClick={() => onClose()} 
                    />
                </React.Fragment>
            ))}
        </Menu>
    );
}