import React from "react";
import { Menu, alpha, MenuProps } from "@mui/material";


type SelectMenuProps = {
    anchorEl: any
    open: boolean
    handleClose: ()=> void
    width?: string | number
    children: React.ReactNode
}


export function SelectMenu({ anchorEl, open, handleClose, width, children }: SelectMenuProps) {
    return(
        <Menu elevation={2}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            sx={{
                mt: 0.5,
                "& .MuiPaper-root": {
                    backgroundColor: (theme)=> alpha(theme.palette.background.paper, 0.1),
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
        >
            { children }
        </Menu>
    );
}