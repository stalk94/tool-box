import React from "react";
import { Menu, alpha, MenuProps } from "@mui/material";


type CustomMenuProps = MenuProps & {
    anchorEl: any
    open: boolean
    onClose: ()=> void
    width?: string | number
    children: React.ReactNode
}


/**
 * Базовый Menu (выпадаюшее меню)   
 * наследуется от MUI Menu
 */
export default function ({ anchorEl, open, onClose, width, children, ...props }: CustomMenuProps) {
    return(
        <Menu 
            elevation={0}
            anchorEl={anchorEl}
            open={open}
            onClose={onClose}
            sx={{
                mt: 1.5,
                "& .MuiPaper-root": {
                    backgroundColor: (theme)=> theme.palette.background.menu,
                    backdropFilter: "blur(14px)", // Размытие для эффекта стекла
                }
            }}
            PaperProps={{
                style: {
                    maxHeight: '70vh',
                    minWidth: '200px',
                    width
                },
            }}
            { ...props }
        >
            { children }
        </Menu>
    );
}