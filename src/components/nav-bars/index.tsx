import React, { useState } from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Home, Settings, Info } from "@mui/icons-material";
import { AppBar, Toolbar, Divider, Box, } from "@mui/material";
import { NavLinkItem, DesktopNestedMenuItem, NavMenu } from './fragment';


type NavbarProps = {
    start?: React.ReactNode
    end?: React.ReactNode
    items: NavLinkItem[]
}

const navLinksTest: NavLinkItem[] = [
    { label: "Главная", icon: <Home />, comand: (v) => console.log(v) },
    { label: "Услуги", icon: <Settings />,
        children: [
            { label: "Услуга 1", icon: <Home />, comand: (v) => console.log(v) },
            { label: "Услуга 2", comand: (v) => console.log(v) },
            { label: "Услуга 3", comand: (v) => console.log(v) },
        ]
    },
    { label: "Услуги-2", icon: <Settings />,
        children: [
            { label: "Услуга 1", icon: <Home />, comand: (v) => console.log(v) },
            { label: "Услуга 2", comand: (v) => console.log(v) },
            { label: "Услуга 3", comand: (v) => console.log(v) },
        ]
    },
    { label: "Услуги-3", icon: <Settings />,
        children: [
            { label: "Услуга 1", icon: <Home />, comand: (v) => console.log(v) },
            { label: "Услуга 2", comand: (v) => console.log(v) },
            { label: "Услуга 3", comand: (v) => console.log(v) },
        ]
    },
    { divider: <Divider sx={{ mt: 1, mb: 1 }} /> },
    { label: "Контакты", icon: <Info />, comand: (v) => console.log(v) },
    { label: "Конец", icon: <Info />,
        children: [
            { label: "Услуга 1", icon: <Home />, comand: (v) => console.log(v) },
            { label: "Услуга 2", comand: (v) => console.log(v) },
            { label: "Услуга 3", comand: (v) => console.log(v) },
        ] }
];

// * сделать разделители
const NavigationItemsDesktop =({ items }: { items: NavLinkItem[] })=> {
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const [visibleItems, setVisibleItems] = useState<NavLinkItem[]>(items);
    const [hiddenItems, setHiddenItems] = useState<NavLinkItem[]>([]);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [menuOpen, setMenuOpen] = useState(false);

    
    const handleMenuClose = () => {
        setAnchorEl(null);
        setMenuOpen(false);
    }
    React.useEffect(()=> {
        const updateVisibleItems =()=> {
            if (!containerRef.current) return;

            const containerWidth = containerRef.current.offsetWidth;
            let totalWidth = 0;
            const newVisibleItems: NavLinkItem[] = [];
            const newHiddenItems: NavLinkItem[] = [];

            for (const item of items) {
                const itemWidth = 100;
                totalWidth += itemWidth;

                if (totalWidth < containerWidth - 100) {
                    newVisibleItems.push(item);
                } 
                else {
                    newHiddenItems.push(item);
                }
            }

            setVisibleItems(newVisibleItems);
            setHiddenItems(newHiddenItems);
        };

        updateVisibleItems();
        window.addEventListener("resize", updateVisibleItems);

        return ()=> window.removeEventListener("resize", updateVisibleItems);
    }, [items]);


    return(
        <Box ref={containerRef}
            sx={{
                display: { xs: "none", sm: "flex" },
                justifyContent: "flex-end",
                flexGrow: 1,
            }}
        >
            { visibleItems.map((item, index) => {
                if (item.divider) {
                    return (
                        <React.Fragment key={index}>
                            { item.divider }
                        </React.Fragment>
                    );
                }
                if (item.children) {
                    return (
                        <DesktopNestedMenuItem
                            key={index}
                            item={item}
                        />
                    );
                }

                return item.label ? (
                    <Button
                        key={index}
                        color="inherit"
                        startIcon={item.icon || null}
                        onClick={() => item.comand?.(item)}
                        //sx={{borderRight:'1px solid red'}}
                    >
                        { item.label }
                    </Button>
                ) : item.icon ? (
                    <IconButton
                        key={index}
                        color="inherit"
                        onClick={() => item.comand?.(item)}
                    >
                        { item.icon }
                    </IconButton>
                ) : null;
            })}
            
            { hiddenItems.length > 0 &&
                <React.Fragment>
                    <IconButton
                        edge="end"
                        color="inherit"
                        aria-label="menu-overflow"
                        sx={{ mr: 0 }}
                        onClick={(e) => {
                            setAnchorEl(e.currentTarget);
                            setMenuOpen(true);
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <NavMenu
                        anchorEl={anchorEl}
                        open={menuOpen}
                        onClose={handleMenuClose}
                        navLinks={hiddenItems}
                        isMobile={false}
                    />
                </React.Fragment>
            }
        </Box>
    );
}


export default function Navbar({ start, end, items }: NavbarProps) {
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
        <React.Fragment>
            <AppBar position="static" sx={{ padding: 0, margin: 0  }}>
                <Toolbar>
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

                    { end &&
                        <React.Fragment>
                            <Divider flexItem 
                                orientation="vertical" 
                                variant='middle' 
                                sx={{ml: 1, mt: 2, mb: 2, borderStyle: 'dashed'}}
                            />
                            { end }
                        </React.Fragment>
                    }
                </Toolbar>
            </AppBar>
        </React.Fragment>
    );
}