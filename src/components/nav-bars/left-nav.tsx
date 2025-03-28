import React, { useState } from "react";
import { BoxProps, List, ListItemButton, ListItemIcon, ListItemText, Collapse, Divider,
    Box, MenuItem, Badge, useTheme, alpha, darken
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { NavLinkItem } from '../menu/list';
import { LeftNavMenu } from '../menu/nav-menu';


type SidebarMenuProps = {
    collapsed: boolean
    onChange?: (item: NavLinkItem)=> void
    items: NavLinkItem[]
    sx?: {}
}
type LeftNavigationProps = SidebarMenuProps & BoxProps & {
    type: 'box' | 'drawer'
    end?: NavLinkItem[]
}


/**
 * Базовый выдвижной список (располагается слева)
 * Можно передавать onChange которая для каждого выполнится выбранного.  
 * * так же у каждого item может быть свой comand()
 */
export function SidebarMenu({ collapsed, items, sx, onChange }: SidebarMenuProps) {
    const theme = useTheme();
    const colorSelect = alpha(theme.palette.action.active, 0.1);
    const [openMenus, setOpenMenus] = useState({});
    const [anchorEl, setAnchorEl] = useState(null);
    const [currentChildren, setCurrentChildren] = useState([]);
    const [selectedItem, setSelectedItem] = useState<string|null>(null);
    const [activeParent, setActiveParent] = useState(null);


    React.useEffect(()=> {
        if(collapsed) setOpenMenus({});
    }, [collapsed]);
    const handleToggle =(id: string)=> {
        setOpenMenus((prev) => ({ ...prev, [id]: !prev[id] }));
    }
    const handleItemClick = (item: NavLinkItem, parent = null) => {
        if(onChange) onChange(item);
        item.comand?.(item);

        setSelectedItem(item.id);
        setActiveParent(parent); // Устанавливаем активного родителя (или null)
    }
    const handleOpenPopover = (event, children, parentId) => {
        setAnchorEl(event.currentTarget);
        setCurrentChildren(children.map(child => ({ ...child, parentId }))); // Добавляем parentId к детям
    }
    const handlerClick =(event, item)=> {
        if(!item.children) handleItemClick(item);
        else if (item.children) {
            if (collapsed) {
                handleOpenPopover(event, item.children, item.id);
            } 
            else handleToggle(item.id);
        }
    }
    const handleClosePopover = () => {
        setAnchorEl(null);
        setCurrentChildren([]);
    }
    

    return (
        <React.Fragment>
            {/* вертикальный список */}
            <Box sx={sx ?? { 
                    display: "flex", 
                    flexDirection: "column",
                    overflowY: "auto", 
                    overflowX: "hidden",
                    ...theme.elements.scrollbar
                }}
            >
                <List>
                    { items.map((item, index) => (
                        <React.Fragment key={index}>
                            {/* разделитель */}
                            { item.divider && 
                                item.divider === true 
                                    ? <Divider sx={{mt:1, mb:1, borderStyle: 'dashed'}}/>
                                    : item.divider
                            }

                            {/* элемент */}
                            { !item.divider && (
                                <React.Fragment>
                                    <ListItemButton
                                        onClick={(e)=> handlerClick(e, item)}
                                        sx={{
                                            justifyContent: collapsed ? "center" : "flex-start",
                                            px: collapsed ? 0 : 2,
                                            backgroundColor: (selectedItem === item.id||activeParent === item.id) ? colorSelect : "transparent",
                                        }}
                                    >
                                        <ListItemIcon sx={{ minWidth: collapsed ? "auto" : 36, color: "gray" }}>
                                            {collapsed && item?.state?.badge ? (
                                                <Badge
                                                    badgeContent={item.state.badge}
                                                    color="primary"
                                                    variant="standard"
                                                >
                                                    { item.icon }
                                                </Badge>
                                            ) : (
                                                item.icon
                                            )}
                                        </ListItemIcon>

                                        { !collapsed && 
                                            <ListItemText primary={item.label} />
                                        }

                                        { !collapsed && item.children && 
                                            (openMenus[item.id] 
                                                ? <ExpandLess /> 
                                                : <ExpandMore />
                                            )
                                        }
                                    </ListItemButton>

                                    {/* вложенные children */}
                                    {!collapsed && item.children && (
                                        <Collapse in={openMenus[item.id]} timeout="auto" unmountOnExit>
                                            <List component="div" disablePadding>
                                                {item.children.map((child, childIndex) => (
                                                    <ListItemButton
                                                        key={childIndex}
                                                        sx={{ pl: 4, backgroundColor: selectedItem === child.id ? colorSelect : "transparent" }}
                                                        onClick={() => {
                                                            handleItemClick(child, item.id);
                                                        }}
                                                    >
                                                        <ListItemIcon sx={{ minWidth: 36, color: "gray" }}>
                                                            { child.icon }
                                                        </ListItemIcon>
                                                        <ListItemText primary={child.label} />
                                                    </ListItemButton>
                                                ))}
                                            </List>
                                        </Collapse>
                                    )}
                                </React.Fragment>
                            )}
                        </React.Fragment>
                    ))}
                </List>
            </Box>

            {/* Меню */}
            <LeftNavMenu
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                handleClose={handleClosePopover}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "center", horizontal: "left" }}
            >
                { currentChildren.map((child, index)=> (
                    <MenuItem
                        key={index}
                        sx={{ 
                            backgroundColor: selectedItem === child.id ? colorSelect : "transparent" 
                        }}
                        onClick={()=> {
                            handleItemClick(child, child.parentId); // Используем parentLabel из child
                            handleClosePopover();
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 36, color: "gray" }}>
                            { child.icon }
                        </ListItemIcon>
                        <ListItemText primary={child.label} />
                    </MenuItem>
                ))}
            </LeftNavMenu>
        </React.Fragment>
    );
}




export default function BaseLeftSideBar({ collapsed, items, onChange, end, sx }: LeftNavigationProps) {
    const theme = useTheme();
    const styleEnd = { 
        borderTop: `1px dotted ${theme.palette.divider}`,
        backdropFilter: "blur(14px)",
        backgroundColor: darken(theme.palette.background.paper, 0.16),
        ...theme.elements.scrollbar
    }

    
    return(
        <Box component='div'
            sx={{
                ...sx,
                width: collapsed ? 60 : 200,
                display: 'flex',
                flexDirection: 'column',
                maxHeight: '100%',
                overflowY: 'auto',
                justifyContent: 'space-between',
                border: `1px solid ${alpha('#000', 0.25)}`,
                backgroundColor: (theme)=> alpha(theme.palette.background.paper, 0.65)
            }}
        >
            <SidebarMenu
                collapsed={collapsed}
                items={items}
                onChange={onChange}
            />
            {/* низ */}
            {end &&
                <SidebarMenu
                    collapsed={collapsed}
                    sx={styleEnd}
                    items={end}
                    onChange={onChange}
                />
            }

        </Box>
    );
}