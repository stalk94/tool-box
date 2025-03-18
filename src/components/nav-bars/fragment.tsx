import React, { useState } from "react";
import Button from "@mui/material/Button";
import { KeyboardArrowDown } from "@mui/icons-material";
import { Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import MobileMenuItem, { NavLinkItem } from '../popup/menuItem';
import { alpha, styled } from '@mui/material/styles';

export interface NavMenuProps {
    anchorEl: null | HTMLElement;
    open: boolean;
    onClose: () => void;
    navLinks: NavLinkItem[];
    isMobile: boolean;
}



// Выпадающее меню 
export const NavMenu =({ anchorEl, open, onClose, navLinks, isMobile }: NavMenuProps)=> {
    return (
        <Menu elevation={5}
            sx={{ 
                mt: isMobile ? 1.2 : 2, 
                ml: isMobile ? 1 : 8,
                "& .MuiPaper-root": {
                    backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.1),
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
                    <MobileMenuItem 
                        item={item} 
                        onItemClick={() => onClose()} 
                    />
                </React.Fragment>
            ))}
        </Menu>
    );
}

// Компонент для отображения элемента с вложенным меню в десктопном режиме
export const DesktopNestedMenuItem =({ item }: { item: NavLinkItem })=> {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    }
    const handleClose = () => {
        setAnchorEl(null);
    }


    return (
        <React.Fragment>
            <Button
                color="inherit"
                startIcon={item.icon || null}
                endIcon={<KeyboardArrowDown />}
                onClick={handleClick}
            >
                { item.label }
            </Button>
            <NavMenu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                navLinks={item.children}
                isMobile={false}
            />
        </React.Fragment>
    );
}
