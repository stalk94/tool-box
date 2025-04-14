import React from "react";
import { Menu, MenuProps } from '@mui/material';


type CustomMenuProps = MenuProps & {
    width?: string | number
}



/**
 * Базовый Menu (выпадаюшее меню)   
 * применяется во всех внутренних компонентах системы
 * оборачивает atomize доп свойством `width`
 * !? надо его упразднить, он добавляет сложности
 */
export default function ({ anchorEl, open, onClose, width, children, ...props }: CustomMenuProps) {
    return(
        <Menu 
            elevation={0}
            anchorEl={anchorEl}
            open={open}
            onClose={onClose}
            PaperProps={{
                style: {
                    width
                },
            }}
            { ...props }
        >
            { children }
        </Menu>
    );
}