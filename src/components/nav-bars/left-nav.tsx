import React, { useState } from "react";
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Collapse, Divider, Box, 
    Menu, MenuItem, Badge, useTheme, alpha 
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { NavLinkItem } from '../popup/menuItem';


type SidebarMenuProps = {
    collapsed: boolean
    onChange?: (item: NavLinkItem)=> void
    items: NavLinkItem[]
}
const TopPanel =()=> (
	<Box
		sx={{
			position: "sticky",
			top: 0,
			width: "100%",
			padding: 2,
			boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
		}}
	>
		top
	</Box>
)


/**
 * 
 * Можно передавать onChange которая для каждого выполнится выбранного.  
 * * так же у каждого item может быть свой comand()
 */
export default function SidebarMenu({ collapsed, items, onChange }: SidebarMenuProps) {
    const theme = useTheme();
    const colorSelect = theme.palette.action.active;
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
    const handleClosePopover = () => {
        setAnchorEl(null);
        setCurrentChildren([]);
    }


    return (
        <Drawer
            variant="permanent"
            sx={{
                width: collapsed ? 60 : 200,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: collapsed ? 60 : 200,
                    transition: "width 0.3s",
                    overflowX: "hidden",
                    overflowY: "auto",
                    backgroundColor: (theme) => alpha(theme.palette.background.paper, 1),
                },
            }}
        >
            <Box sx={{ flexGrow: 1, overflowY: "auto", overflowX: "hidden" }}>
                <List>
                    { items.map((item, index) => (
                        <React.Fragment key={index}>
                            { item.divider && 
                                item.divider === true 
                                    ? <Divider sx={{mt:1, mb:1}}/>
                                    : item.divider
                            }

                            {!item.divider && (
                                <React.Fragment>
                                    <ListItemButton
                                        onClick={(event) => {
                                            if (item.comand) {
                                                handleItemClick(item);
                                            }
                                            if (item.children) {
                                                if (collapsed) {
                                                    handleOpenPopover(event, item.children, item.id);
                                                } 
                                                else handleToggle(item.id);
                                            }
                                        }}
                                        sx={{
                                            justifyContent: collapsed ? "center" : "flex-start",
                                            px: collapsed ? 0 : 2,
                                            backgroundColor: selectedItem === item.id ? colorSelect : "transparent",
                                        }}
                                    >
                                        <ListItemIcon sx={{ minWidth: collapsed ? "auto" : 36, color: "gray" }}>
                                            {item.children && collapsed ? (
                                                <Badge
                                                    color="primary"
                                                    variant={activeParent === item.id ? "dot" : "standard"}
                                                >
                                                    {item.icon}
                                                </Badge>
                                            ) : (
                                                item.icon
                                            )}
                                        </ListItemIcon>

                                        {!collapsed && <ListItemText primary={item.label} />}

                                        {!collapsed && item.children && 
                                            (openMenus[item.id] 
                                                ? <ExpandLess /> 
                                                : <ExpandMore />
                                            )
                                        }
                                    </ListItemButton>

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

            <Menu elevation={1}
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClosePopover}
                anchorOrigin={{ vertical: "center", horizontal: "right" }}
                transformOrigin={{ vertical: "center", horizontal: "left" }}
                sx={{ 
                    ml: 0.5,
                    "& .MuiPaper-root": {
                        backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.8),
                        backdropFilter: "blur(14px)",
                    }
                }}
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
            </Menu>
        </Drawer>
    );
}