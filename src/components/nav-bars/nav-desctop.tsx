import React, { useState } from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Divider, Box, } from "@mui/material";
import { NavLinkItem, DesktopNestedMenuItem, NavMenu } from './fragment';


const OverflowNavigationItems =({ hiddenItems }: { hiddenItems: NavLinkItem[] })=> {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [menuOpen, setMenuOpen] = useState(false);

    const handleMenuClose = () => {
        setAnchorEl(null);
        setMenuOpen(false);
    }

    return(
        <React.Fragment>
            <IconButton
                edge="end"
                color="inherit"
                aria-label="menu-overflow"
                sx={{ mr: 0, color: 'gray' }}
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
    );
}


// * стилизацию сделать
export default function NavigationItemsDesktop({ items }: { items: NavLinkItem[] }) {
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const [visibleItems, setVisibleItems] = useState<NavLinkItem[]>(items);
    const [hiddenItems, setHiddenItems] = useState<NavLinkItem[]>([]);
  
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
        <Box ref={containerRef}
            sx={{
                display: { xs: "none", sm: "flex" },
                justifyContent: "flex-end",
                flexGrow: 1,
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
                                color="inherit"
                                startIcon={item.icon || null}
                                onClick={() => item.comand?.(item)}
                            >
                                { item.label }
                            </Button>
                        ) 
                        : item.icon ? (
                            <IconButton 
                                color="inherit" 
                                onClick={() => item.comand?.(item)}
                            >
                                { item.icon }
                            </IconButton>
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
                <OverflowNavigationItems hiddenItems={hiddenItems}/>
            }
        </Box>
    );
}