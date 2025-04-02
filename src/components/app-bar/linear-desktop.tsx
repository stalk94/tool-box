import React, { useState } from "react";
import Button from "@mui/material/Button";
import { KeyboardArrowDown } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Divider, Box, SxProps, useTheme, alpha, } from "@mui/material";
import { NavLinkItem } from '../menu/list';
import AppBarMenu from '../menu/atomize';


type OverflowNavigationItemsProps = { 
    hiddenItems: NavLinkItem[] 
    element?: React.ReactNode 
}
type NavigationItemsDesktopProps = { 
    items: NavLinkItem[] 
    /** кастомный элемент в режиме переполнения */
    elementOverflow?: React.ReactNode 
    sx?: SxProps
}


// Компонент для отображения элемента с вложенным меню в десктопном режиме
export const DesktopNestedMenuItem =({ item }: { item: NavLinkItem })=> {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    }
    const handleClose = () => {
        setAnchorEl(null);
    }


    return (
        <React.Fragment>
            <Button
                color="navigation"
                startIcon={item.icon || null}
                endIcon={<KeyboardArrowDown />}
                onClick={handleClick}
            >
                { item.label }
            </Button>
            <AppBarMenu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                navLinks={item.children}
            />
        </React.Fragment>
    );
}
// то что не помешается в десктопном виде
const OverflowNavigationItems =({ hiddenItems, element }: OverflowNavigationItemsProps)=> {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [menuOpen, setMenuOpen] = useState(false);

    const handleMenuClose = () => {
        setAnchorEl(null);
        setMenuOpen(false);
    }
    const renderDefaultElement = () => {
        return(
            <IconButton
                edge="end"
                color="navigation"
                aria-label="menu-overflow"
                sx={{ mr: 0 }}
            >
                <MenuIcon />
            </IconButton>
        );
    }

    return(
        <React.Fragment>
            <Box 
                sx={{
                    //ml: 1,
                    mr: 2
                }}
                onClick={(e) => {
                    setAnchorEl(e.currentTarget);
                    setMenuOpen(true);
                }}
            >
                { element ?? renderDefaultElement() }
            </Box>
            
            <AppBarMenu
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={handleMenuClose}
                navLinks={hiddenItems}
            />
        </React.Fragment>
    );
}


/** линейная навигация для больших экранов */
export default function LinearNavigationItemsDesktop({ items, elementOverflow, sx }: NavigationItemsDesktopProps) {
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const [visibleItems, setVisibleItems] = useState<NavLinkItem[]>(items);
    const [hiddenItems, setHiddenItems] = useState<NavLinkItem[]>([]);
  

    //? надо придумать отслежку размера либо типо того
    React.useEffect(()=> {
        const updateVisibleItems =()=> {
            if (!containerRef.current) return;

            const containerWidth = containerRef.current.offsetWidth;
            let totalWidth = 0;
            const newVisibleItems: NavLinkItem[] = [];
            const newHiddenItems: NavLinkItem[] = [];

            for (const item of items) {
                const itemWidth = 130;
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
        <Box 
            ref={containerRef}
            sx={{
                display: { 
                    xs: "none", 
                    sm: "flex" 
                },
                justifyContent: "flex-end",
                flexGrow: 1,
                ...sx
            }}
        >
            { visibleItems.map((item, index) => (
                <React.Fragment key={index}>
                    {/* элемент с вложенным списком, с label/icon, только с icon*/}
                    { item.children 
                        ? (
                            <DesktopNestedMenuItem 
                                item={item} 
                            />
                        ) 
                        : item.label ? (
                            <Button
                                color="navigation"
                                startIcon={item.icon || null}
                                onClick={() => item.comand?.(item)}
                            >
                                { item.label }
                            </Button>
                        ) 
                        : item.icon ? (
                            <Button
                                color="navigation"
                                onClick={() => item.comand?.(item)}
                            >
                                { item.icon }
                            </Button>
                        ) 
                        : null
                    }

                    {/* Разделитель, кроме последнего элемента */}
                    { (hiddenItems.length > 0 || index < visibleItems.length - 1) && (
                        <Divider
                            orientation="vertical"
                            flexItem
                            sx={{
                                height: "22px",
                                alignSelf: "center",
                                mx: 1
                            }}
                        />
                    )}
                </React.Fragment>
            ))}

            {/* то что не помещается выносим в выделенную вкладку */}
            { hiddenItems.length > 0 &&
                <OverflowNavigationItems 
                    hiddenItems={hiddenItems}
                    element={elementOverflow}
                />
            }
        </Box>
    );
}