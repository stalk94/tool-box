import React from 'react';
import { Menu, MenuItem, ListItemText, ListItemIcon } from '@mui/material';


export interface ContextMenuItem<T = any> {
    label: string | React.ReactNode
    icon?: React.ReactNode
    onClick: (target: T) => void
}
export type ContextMenuState<T = any> = {
    mouseX: number;
    mouseY: number;
    targetData: T | null;
    showIf?: (target: T) => boolean;
}


export default function useContextMenu<T = any>(items: ContextMenuItem<T>[]) {
    const [menuState, setMenuState] = React.useState<ContextMenuState<T> | null>(null);
    
    
    const handleOpen = React.useCallback((e: React.MouseEvent, data: T) => {
        e.preventDefault();
        setMenuState({
            mouseX: e.clientX,
            mouseY: e.clientY,
            targetData: data,
        });
    }, []);
    const handleClose = React.useCallback(() => setMenuState(null), []);

    const menu = React.useMemo(() => {
        if (!menuState) return null;

        const filtered = items.filter(item => item.showIf?.(menuState.targetData.type) !== false);

        return (
            <Menu
                open
                onClose={handleClose}
                anchorReference="anchorPosition"
                anchorPosition={{ top: menuState.mouseY, left: menuState.mouseX }}
            >
                {filtered.map((item, index) => (
                    <MenuItem
                        key={index}
                        onClick={() => {
                            item.onClick?.(menuState.targetData.id);
                            handleClose();
                        }}
                    >
                        {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
                        <ListItemText>{item.label}</ListItemText>
                    </MenuItem>
                ))}
            </Menu>
        );
    }, [menuState, items, handleClose]);


    return {
        handleOpen,
        targetData: menuState?.targetData ?? null,
        menu,
    }
}