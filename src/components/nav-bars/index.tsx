import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Home, Settings, Info } from "@mui/icons-material";
import { AppBar, Toolbar, Divider, Box, useTheme, } from "@mui/material";
import { NavLinkItem, NavMenu } from './fragment';
import NavigationItemsDesktop from './nav-desctop';


type NavbarProps = {
    start?: React.ReactNode
    end?: React.ReactNode
    items: NavLinkItem[]
}
const navLinksTest: NavLinkItem[] = [
    { label: "Главная", icon: <Home sx={{opacity:0.3}} />, comand: (v) => console.log(v) },
    { label: "Услуги", icon: <Settings sx={{opacity:0.3}} />,
        children: [
            { label: "Услуга 1", icon: <Home sx={{opacity:0.3}} />, comand: (v) => console.log(v) },
            { label: "Услуга 2", comand: (v) => console.log(v) },
            { label: "Услуга 3", comand: (v) => console.log(v) },
        ]
    },
    { label: "Услуги-2",
        children: [
            { label: "Услуга 1", icon: <Home />, comand: (v) => console.log(v) },
            { label: "Услуга 2", comand: (v) => console.log(v) },
            { label: "Услуга 3", comand: (v) => console.log(v) },
        ]
    },
    { label: "Услуги-3", icon: <Settings sx={{opacity:0.3}} />,
        children: [
            { label: "Услуга 1", icon: <Home />, comand: (v) => console.log(v) },
            { label: "Услуга 2", comand: (v) => console.log(v) },
            { label: "Услуга 3", comand: (v) => console.log(v) },
        ]
    },
    { label: "Контакты", icon: <Info sx={{opacity:0.3}} />, comand: (v) => console.log(v) },
    { label: "Конец", icon: <Info sx={{opacity:0.3}} />,
        children: [
            { label: "Услуга 1", icon: <Home />, comand: (v) => console.log(v) },
            { label: "Услуга 2", comand: (v) => console.log(v) },
            { label: "Услуга 3", comand: (v) => console.log(v) },
        ] }
];


// * стилизацию сделать: кнопок, разделителей, выпадаюших Menu, тени
export default function Navbar({ start, end, items }: NavbarProps) {
    const theme = useTheme();
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
    

    return (
        <AppBar position="static" sx={{ padding: 0, margin: 0, background: theme.palette.background.navBar }}>
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
                    items={items ?? navLinksTest}
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
                    navLinks={(items ?? navLinksTest)}
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