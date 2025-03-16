import React, { useState } from "react";
import Button from "@mui/material/Button";
import { KeyboardArrowDown, ExpandMore, ChevronRight } from "@mui/icons-material";
import { Menu, MenuItem, ListItemIcon, List, ListItemText, ListItem, Collapse } from "@mui/material";


export interface NavLinkItem {
    label?: string;
    icon?: React.ReactNode;
    comand?: (item: any) => void;
    divider?: React.ReactNode;
    children?: NavLinkItem[];
}
export interface NavMenuProps {
    anchorEl: null | HTMLElement;
    open: boolean;
    onClose: () => void;
    navLinks: NavLinkItem[];
    isMobile: boolean;
}
export type MobailMenuProps = {
    item: NavLinkItem
    onItemClick: (item: NavLinkItem) => void
}

// Компонент для мобильного меню с поддержкой подменю
const MobileMenuItem: React.FC<MobailMenuProps> =({ item, onItemClick })=> {
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        if (item.children) {
            setOpen(!open);
        } else if (item.comand) {
            onItemClick(item);
        }
    }
    if (item.divider) {
        return <>{item.divider}</>;
    }


    return (
        <>
            <MenuItem onClick={handleClick}>
                {item.icon && 
                    <ListItemIcon>
                        { item.icon }
                    </ListItemIcon>
                }
                <ListItemText primary={item.label} />
                { item.children && (
                    open ? <ExpandMore /> : <ChevronRight />
                )}
            </MenuItem>

            {item.children && (
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {item.children.map((childItem, childIndex) => (
                            <ListItem
                                key={childIndex}
                                button='true'
                                sx={{ pl: 4, background: '#0000001a' }}
                                onClick={() => {
                                    childItem.comand?.(childItem);
                                    onItemClick(childItem);
                                }}
                            >
                                {childItem.icon && 
                                    <ListItemIcon sx={{minWidth: 36}}>
                                        { childItem.icon }
                                    </ListItemIcon>
                                }
                                <ListItemText primary={childItem.label} />
                            </ListItem>
                        ))}
                    </List>
                </Collapse>
            )}
        </>
    );
}


// Компонент для отображения элемента с вложенным меню в десктопном режиме
export const DesktopNestedMenuItem: React.FC<{ item: NavLinkItem }> =({ item })=> {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    }
    const handleClose = () => {
        setAnchorEl(null);
    }
    const handleItemClick = (childItem: NavLinkItem) => {
        childItem.comand?.(childItem);
        handleClose();
    }


    return (
        <>
            <Button
                color="inherit"
                startIcon={item.icon || null}
                endIcon={<KeyboardArrowDown />}
                onClick={handleClick}
                //sx={{borderRight:'1px solid red'}}
            >
                {item.label}
            </Button>
            <Menu sx={{ mt: 2}}
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
            >
                {item.children?.map((childItem, childIndex) => (
                    <MenuItem
                        key={childIndex}
                        onClick={() => handleItemClick(childItem)}
                    >
                        { childItem.icon && 
                            <ListItemIcon>
                                { childItem.icon }
                            </ListItemIcon> 
                        }
                        <ListItemText>{childItem.label}</ListItemText>
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
}
// Выпадающее меню (mobile)
export const NavMenu: React.FC<NavMenuProps> =({ anchorEl, open, onClose, navLinks, isMobile })=> {
    return (
        <Menu sx={{ mt: isMobile ? 1 : 2, ml: isMobile ? 1 : 8}}
            anchorEl={anchorEl}
            open={open}
            onClose={onClose}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            PaperProps={{
                style: {
                    maxHeight: '70vh',
                    width:  '200px'
                },
            }}
        >
            { navLinks.map((item, index) => (
                <React.Fragment key={index}>
                    <MobileMenuItem 
                        item={item} 
                        onItemClick={() => onClose()} 
                    />
                </React.Fragment>
            ))}
        </Menu>
    );
}