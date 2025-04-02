import React from "react";
import Menu, { CustomMenuProps } from './atomize';


type MenuProps = CustomMenuProps & {
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
export default function ({ anchorEl, open, onClose, width, children, ...props }: MenuProps) {
    
    return(
        <Menu 
            elevation={0}
            anchorEl={anchorEl}
            open={open}
            onClose={onClose}
            sx={{
                mt: 0.5,
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