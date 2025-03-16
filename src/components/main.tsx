import React, { useState } from "react";
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Collapse, Divider, Box, Popover, Badge } from "@mui/material";
import { Home, Settings, Menu, ExpandLess, ExpandMore, Logout } from "@mui/icons-material";


const menuItems = [
	{ label: "Меню", icon: <Menu />, children: [
		{ label: "Вложенный 1", icon: <Home />, comand: (v) => console.log(v) },
		{ label: "Вложенный 2", icon: <Settings />, comand: (v) => console.log(v) },
	] },
	{ label: "Меню2", icon: <Menu />, children: [
		{ label: "Вложенный 3", icon: <Home />, comand: (v) => console.log(v) },
		{ label: "Вложенный 4", icon: <Settings />, comand: (v) => console.log(v) },
	] },
	{ label: "Главная", icon: <Home />, comand:(v)=> console.log(v) },
	{ label: "Настройки", icon: <Settings />, comand:(v)=> console.log(v) },
	{ divider: <Divider sx={{mt:1, mb:1}}/> },
	{ label: "Выход", icon: < Logout />, comand:(v)=> console.log(v) },
];
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


export default function SidebarMenu({ collapsed }) {
    const [openMenus, setOpenMenus] = useState({});
    const [anchorEl, setAnchorEl] = useState(null);
    const [currentChildren, setCurrentChildren] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [activeParent, setActiveParent] = useState(null);


    React.useEffect(()=> {
        if(collapsed) setOpenMenus({});
    }, [collapsed]);
    const handleToggle =(label)=> {
        setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
    }
    const handleItemClick = (label, parent = null) => {
        setSelectedItem(label);
        setActiveParent(parent); // Устанавливаем активного родителя (или null)
    }
    const handleOpenPopover = (event, children, parentLabel) => {
        setAnchorEl(event.currentTarget);
        setCurrentChildren(children.map(child => ({ ...child, parentLabel }))); // Добавляем parentLabel к детям
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
                    overflowY: "auto"
                },
            }}
        >
            <Box sx={{ flexGrow: 1, overflowY: "auto", overflowX: "hidden" }}>
                <List>
                    {menuItems.map((item, index) => (
                        <React.Fragment key={index}>
                            {item.divider && item.divider}

                            {!item.divider && (
                                <React.Fragment>
                                    <ListItemButton
                                        onClick={(event) => {
                                            if (item.comand) {
                                                item.comand(item);
                                                handleItemClick(item.label);
                                            }
                                            if (item.children) {
                                                if (collapsed) {
                                                    handleOpenPopover(event, item.children, item.label);
                                                } 
                                                else handleToggle(item.label);
                                                
                                            }
                                        }}
                                        sx={{
                                            justifyContent: collapsed ? "center" : "flex-start",
                                            px: collapsed ? 0 : 2,
                                            backgroundColor: selectedItem === item.label ? "#e0e0e0" : "transparent",
                                        }}
                                    >
                                        <ListItemIcon sx={{ minWidth: collapsed ? "auto" : 36, color: "gray" }}>
                                            {item.children && collapsed ? (
                                                <Badge
                                                    color="primary"
                                                    variant={activeParent === item.label ? "dot" : "standard"}
                                                >
                                                    {item.icon}
                                                </Badge>
                                            ) : (
                                                item.icon
                                            )}
                                        </ListItemIcon>

                                        {!collapsed && <ListItemText primary={item.label} />}

                                        {!collapsed && item.children && (openMenus[item.label] ? <ExpandLess /> : <ExpandMore />)}
                                    </ListItemButton>

                                    {!collapsed && item.children && (
                                        <Collapse in={openMenus[item.label]} timeout="auto" unmountOnExit>
                                            <List component="div" disablePadding>
                                                {item.children.map((child, childIndex) => (
                                                    <ListItemButton
                                                        key={childIndex}
                                                        sx={{ pl: 4, backgroundColor: selectedItem === child.label ? "#e0e0e0" : "transparent" }}
                                                        onClick={() => {
                                                            child.comand(child);
                                                            handleItemClick(child.label, item.label);
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

            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClosePopover}
                anchorOrigin={{ vertical: "center", horizontal: "right" }}
                transformOrigin={{ vertical: "center", horizontal: "left" }}
                sx={{ mt: -1 }}
            >
                <List>
                    {currentChildren.map((child, index) => (
                        <ListItemButton
                            key={index}
                            sx={{ backgroundColor: selectedItem === child.label ? "#e0e0e0" : "transparent" }}
                            onClick={() => {
                                child.comand(child);
                                handleItemClick(child.label, child.parentLabel); // Используем parentLabel из child
                                handleClosePopover();
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 36, color: "gray" }}>
                                { child.icon }
                            </ListItemIcon>
                            <ListItemText primary={child.label} />
                        </ListItemButton>
                    ))}
                </List>
            </Popover>
        </Drawer>
    );
}