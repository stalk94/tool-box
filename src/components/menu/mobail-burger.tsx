import React from "react";
import ItemMenuList, { NavLinkItem } from './list';
import Menu from './index';


export interface NavMenuProps {
    anchorEl: null | HTMLElement
    open: boolean
    onClose: () => void
    /** можно передавать `navLinks` тогда будет отрендерено listMenu */
    navLinks?: NavLinkItem[]
    /** Передавая children это будет отрендерено перед(вверху) `navLinks` */
    children?: React.ReactNode
}



/** 
 * Выпадающее меню `<MobailBurger>`
 * - Передавая children это будет отрендерено перед(вверху) `navLinks`        
 * - Можно передавать `navLinks` тогда будет отрендерено listMenu
 */ 
export default function({ anchorEl, open, onClose, navLinks, children }: NavMenuProps) {
    return (
        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={onClose}
            width={'100%'}
        >
            { children }
            { navLinks && navLinks.map((item, index) => (
                <ItemMenuList 
                    key={index}
                    item={item} 
                    onItemClick={() => onClose()} 
                />
            ))}
        </Menu>
    );
}