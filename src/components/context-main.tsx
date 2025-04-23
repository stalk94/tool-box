import React from 'react';
import { Menu, MenuItem, ListItemText, ListItemIcon } from '@mui/material';


export interface ContextMenuItem<T = any> {
    label: string;
    icon?: React.ReactNode;
    onClick: (target: T) => void;
}
export type ContextMenuState<T = any> = {
    mouseX: number;
    mouseY: number;
    targetData: T | null;
}


export default function useContextMenu<T = any>(items: ContextMenuItem<T>[]) {
    const [menuState, setMenuState] = React.useState<ContextMenuState<T> | null>(null);

    const handleOpen = (e: React.MouseEvent, data: T) => {
        e.preventDefault();
        setMenuState({
            mouseX: e.clientX,
            mouseY: e.clientY,
            targetData: data,
        });
    }
    const handleClose = () => setMenuState(null);

    const menu = menuState ? (
        <Menu
            open
            onClose={handleClose}
            anchorReference="anchorPosition"
            anchorPosition={{ top: menuState.mouseY, left: menuState.mouseX }}
        >
            { items.map((item, index) => (
                <MenuItem
                    key={index}
                    onClick={() => {
                        item.onClick?.(menuState.targetData);
                        handleClose();
                    }}
                >
                    { item.icon && <ListItemIcon>{ item.icon }</ListItemIcon> }
                    <ListItemText>
                        { item.label }
                    </ListItemText>
                </MenuItem>
            ))}
        </Menu>
    ) : null;


    return {
        handleOpen,
        targetData: menuState?.targetData ?? null,
        menu,
    }
}