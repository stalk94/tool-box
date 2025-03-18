import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { AppBar, Toolbar, Divider, Box, useTheme, alpha } from "@mui/material";
import { NavMenu } from './fragment';
import { NavLinkItem } from '../popup/menuItem';
import NavigationItemsDesktop from './nav-desctop';


type NavbarProps = {
    start?: React.ReactNode
    end?: React.ReactNode
    items: NavLinkItem[]
}



// * стилизацию сделать: кнопок, разделителей, выпадаюших Menu, тени
export default function Navbar({ start, end, items }: NavbarProps) {
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [menuOpen, setMenuOpen] = useState(false);

    
    // обработчик данных для внесения правок и форматирования
    const useTransformator =(items: NavLinkItem[])=> {
        return items.map((item)=> {
            if(item.icon && React.isValidElement(item.icon)) {
                item.icon = React.cloneElement(item.icon, {sx: { opacity: 0.4 }})
            }

            return item;
        });
    }
    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
        setMenuOpen(true);
    }
    const handleMenuClose = () => {
        setAnchorEl(null);
        setMenuOpen(false);
    }
    

    return (
        <AppBar 
            position="static" 
            sx={{ 
                padding: 0, 
                margin: 0, 
                background: theme.palette.background.navBar,
                backdropFilter: "blur(14px)"
            }}
        >
            <Toolbar>
                {/* Лого и прочее */}
                <Box 
                    sx={{
                        //display: { xs: "none", sm: "flex" },
                        display: "flex",
                        justifyContent: "flex-start",
                        flexGrow: 1,
                        alignItems: "center"
                    }}
                >
                    { start }
                </Box>

                {/* Кнопки навигации (на больших экранах) */}
                <NavigationItemsDesktop 
                    items={useTransformator(items)}
                />

                {/* Бургер-меню для мобилок */}
                <IconButton
                    edge="end"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 1, display: { sm: "none" } }}
                    onClick={handleMenuOpen}
                >
                    <MenuIcon />
                </IconButton>

                {/* Выпадающее меню mobile */}
                <NavMenu
                    anchorEl={anchorEl}
                    open={menuOpen}
                    onClose={handleMenuClose}
                    navLinks={items}
                    isMobile={true}
                />

                {/* user меню к примеру */}
                { end &&
                    <React.Fragment>
                        <Divider flexItem 
                            orientation="vertical" 
                            variant='middle' 
                            sx={{ml: 2, mt: 2, mb: 2, borderStyle: 'dashed'}}
                        />
                        { end }
                    </React.Fragment>
                }
            </Toolbar>
        </AppBar>
    );
}