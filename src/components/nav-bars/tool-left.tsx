import React, { useState } from "react";
import { Box, useTheme, alpha, darken } from "@mui/material";
import { NavLinkItem } from '../popup/menuItem';
import BaseLeftSideBar from "./left-nav";


type SideBarAndToolPanelProps = {
    schemaNavBar: {
        items: NavLinkItem[]
        end?: NavLinkItem[]
    }
    children: React.ReactNode
    /** 🔥 нажат элемент боковой навигации */
    onChangeNavigation?: (item: NavLinkItem)=> void
}


export default function SideBarAndToolPanel({ schemaNavBar, children, onChangeNavigation }: SideBarAndToolPanelProps) {
    const theme = useTheme();

    return(
        <Box component='div'
            sx={{
                width: 260,
                display: 'flex',
                flexDirection: 'row',
                maxHeight: '100%',
                overflow: 'hidden'
            }}
        >
            {/* левая навигационное меню */}
            <BaseLeftSideBar
                type="drawer"
                collapsed={true}
                onChange={onChangeNavigation}
                items={schemaNavBar.items}
                end={schemaNavBar.end}
            />
            {/* правая рабочая область */}
            <Box
                sx={{
                    width: '200px',
                    paddingLeft: '10px',
                    backgroundColor: darken(alpha(theme.palette.background.paper, 1), 0.15),
                    borderLeft: `1px solid ${theme.palette.divider}`,
                    overflowY: "auto",
                    ...theme.elements.scrollbar
                }}
            >
                { children }
            </Box>
        </Box>
    );
}