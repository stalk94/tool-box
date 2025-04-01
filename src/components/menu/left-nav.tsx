import React from "react";
import { alpha, MenuProps } from "@mui/material";
import Menu from './index';


type LeftNavMenuProps = MenuProps & {
    anchorEl: any
    open: boolean
    onClose: ()=> void
    children: React.ReactNode
}



// Выпадающее меню левого меню навигации
export default function ({ anchorEl, open, onClose, children, ...props }: LeftNavMenuProps) {

    return(
        <Menu
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            { ...props }
            sx={{
                ml: 1,
                mt: {
                    xs: 1.5,
                    md: 0
                },
                "& .MuiPaper-root": {
                    //backgroundColor: (theme)=> theme.palette.background.paper,
                    backdropFilter: "blur(14px)",
                }
            }}
        >
            { children }
        </Menu>
    );
}