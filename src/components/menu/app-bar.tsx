import React from "react";
import ItemMenuList, { NavLinkItem } from './list';
import Menu from './index';

export interface NavMenuProps {
    anchorEl: null | HTMLElement;
    open: boolean;
    onClose: () => void;
    navLinks: NavLinkItem[];
}


/** Выпадающие меню для `<AppBar>` (desktop) */ 
export default function({ anchorEl, open, onClose, navLinks }: NavMenuProps) {
    return (
        <Menu
            elevation={0}
            sx={{ 
                mt: 2, 
                "& .MuiPaper-root": {
                    //backgroundColor: (theme)=> theme.palette.background.paper,
                    backdropFilter: "blur(14px)",
                }
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={onClose}
            PaperProps={{
                style: {
                    maxHeight: '70vh',
                    minWidth: '200px'
                },
            }}
        >
            { navLinks.map((item, index) => (
                <ItemMenuList key={index}
                    item={item}
                    onItemClick={() => onClose()}
                />
            ))}
        </Menu>
    );
}