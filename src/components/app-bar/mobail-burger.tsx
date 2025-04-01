import React, { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { NavLinkItem } from '../menu/list';
import { IconButton } from "@mui/material";
import MobailMenu from '../menu/mobail-burger';


type MobailBurgerProps = {
    items: NavLinkItem[]
    /** кастомная иконка */
    children?: React.ReactNode 
}



/** 
 * Бургер-меню кнопка для мобилок 
 * ! отключается видимость на экранах более 600px ширины
*/
export default function ({ items, children }: MobailBurgerProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [menuOpen, setMenuOpen] = useState(false);

    
    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
        setMenuOpen(true);
    }
    const handleMenuClose = () => {
        setAnchorEl(null);
        setMenuOpen(false);
    }


    return(
        <React.Fragment>
            <IconButton
                color="navigation"
                aria-label="navigation-menu"
                sx={{
                    mr: 1,
                    display: { 
                        sm: "none" 
                    }
                }}
                onClick={handleMenuOpen}
            >
                { children ?? <MenuIcon /> }
            </IconButton>


            {/* Выпадающее меню mobile */}
            <MobailMenu
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={handleMenuClose}
                navLinks={items}
            />
        </React.Fragment>
    );
}
