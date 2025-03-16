import React, { useState, useRef, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { AppBar, Toolbar, Menu, MenuItem, Divider, Box } from "@mui/material";
import { Home, Settings, Info } from "@mui/icons-material";


interface NavMenuMobailProps {
    anchorEl: null | HTMLElement;
    open: boolean;
    onClose: () => void;
    navLinks: {
        label?: string;
        icon?: React.ReactNode;
        comand: (item: any) => void;
        divider?: React.ReactNode;
    }[];
}
interface NavMenuProps {
    navLinks: {
        label?: string;
        icon?: React.ReactNode;
        comand: (item: any) => void;
        divider?: React.ReactNode;
    }[];
}
const navLinks = [
    { label: "Главная", icon: <Home />, comand:(v)=> console.log(v) }, 
    { label: "Контакты", comand:(v)=> console.log(v) },
    { divider: <Divider sx={{mt:1, mb:1}}/> },
    { label: "Контакты", children: [
        { label: "Главная", icon: <Home />, comand:(v)=> console.log(v) }
    ]},
];



const NavMenuMobail: React.FC<NavMenuMobailProps> = ({ anchorEl, open, onClose, navLinks }) => {
    return (
        <Menu sx={{ mt: 2, ml: 1 }}
            anchorEl={anchorEl}
            open={open}
            onClose={onClose}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "right"
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
        >
            { navLinks.map((item, index) => {
                if (item.divider) {
                    return (
                        <React.Fragment key={index}>
                            { item.divider }
                        </React.Fragment>
                    );
                }

                return (
                    <MenuItem
                        key={index}
                        onClick={() => {
                            item.comand?.(item);
                            onClose();
                        }}
                    >
                        { item.icon && <>{item.icon}&nbsp;</> }
                        { item.label }
                    </MenuItem>
                );
            })}
        </Menu>
    );
}
const NavMenu: React.FC<NavMenuProps> = ({ navLinks }) => {
    return (
        <Box
            sx={{
                display: { xs: "none", sm: "flex" },
                justifyContent: "flex-end",
                flexGrow: 1,
            }}
        >
            { navLinks.map((item, index)=>
                item.label ? (
                    <Button
                        key={index}
                        color="inherit"
                        startIcon={item.icon || null}
                        onClick={() => item.comand?.(item)}
                    >
                        {item.label}
                    </Button>
                ) : item.icon ? (
                    <IconButton
                        key={index}
                        color="inherit"
                        onClick={() => item.comand?.(item)}
                    >
                        {item.icon}
                    </IconButton>
                ) : (
                    item.divider &&
                    <React.Fragment key={index}>
                        {item.divider}
                    </React.Fragment>
                )
            )}
        </Box>
    );
}


// * учесть варриант когда элементы не помешаются а так же что могут быть вложенные
// * возможность добавить справа элемент меню юзера к примеру
export default function Navbar({ start, end }) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [menuOpen, setMenuOpen] = useState(false);

    const handleMenuOpen =(event: React.MouseEvent<HTMLElement>)=> {
        setAnchorEl(event.currentTarget);
        setMenuOpen(true);
    }
    const handleMenuClose =()=> {
        setAnchorEl(null);
        setMenuOpen(false);
    }


    return (
        <React.Fragment>
            <AppBar position="static" sx={{ padding: 0, margin: 0 }}>
                <Toolbar >
                    <Box 
                        sx={{
                            //display: { xs: "none", sm: "flex" },
                            justifyContent: "flex-start",
                            flexGrow: 1,
                        }}
                    >
                        { start }
                    </Box>
                    {/* Кнопки навигации (на больших экранах) */}
                    <NavMenu 
                        navLinks={navLinks}
                    />

                    {/* Бургер-меню для мобилок */}
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ display: { sm: "none" } }}
                        onClick={handleMenuOpen}
                    >
                        <MenuIcon />
                    </IconButton>

                    {/* Выпадающее меню */}
                    <NavMenuMobail
                        anchorEl={anchorEl}
                        open={menuOpen}
                        onClose={handleMenuClose}
                        navLinks={navLinks}
                    />

                    { end &&
                        <React.Fragment>
                            <Divider flexItem 
                                orientation="vertical" 
                                variant='middle' 
                                sx={{mt: 2, mb: 2, borderStyle: 'dashed'}}
                            />
                            { end }
                        </React.Fragment>
                    }
                </Toolbar>
            </AppBar>
        </React.Fragment>
    );
}


/**
 * <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Логотип
                    </Typography>
 * <IconButton
                            edge="end"
                            color="inherit"
                            aria-label="menu"
                            sx={{ ml:1 }}
                        >
                            <MenuIcon />
                        </IconButton>
 */