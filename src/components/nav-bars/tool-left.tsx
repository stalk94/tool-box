import React, { useState } from "react";
import { Box, BoxProps, useTheme, alpha, darken } from "@mui/material";
import { NavLinkItem } from '../popup/menuItem';
import BaseLeftSideBar from "./left-nav";
import { Mutators } from '../tools/decorators';


type SideBarAndToolPanelProps = {
    schemaNavBar: {
        items: NavLinkItem[]
        end?: NavLinkItem[]
    }
    /** ⬇️ Нижняя панелька для дополнительных элементов(tool) */
    end?: React.ReactNode
    /** ⬆️ Верхняя панелька для дополнительных элементов(tool) */
    start?: React.ReactNode
    /** 💻 Контент рабочей области(правая панель) */
    children: React.ReactNode
    /** 🔥 нажат элемент боковой навигации */
    onChangeNavigation?: (item: NavLinkItem)=> void
    /** 📏 Ширина рабочей области (без учета навигации) */
    width?: string | number
} & BoxProps



/**
 * Боковая панель со связаным полем справа
 * - подаем `schemaNavBar`
 * - слушаем `onChangeNavigation`
 * - меняем `children`
 */
export default function SideBarAndToolPanel({ schemaNavBar, start, end, children, onChangeNavigation, sx, width }: SideBarAndToolPanelProps) {
    const theme = useTheme();
    
    
    return(
        <Box component='div'
            sx={{
                ...sx,
                display: 'flex',
                flexDirection: 'row',
                maxHeight: '100%',
                overflow: 'hidden',
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
                    width: width ?? 200,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: darken(alpha(theme.palette.background.paper, 1), 0.15),
                    borderLeft: `1px solid ${theme.palette.divider}`,
                    overflowY: "auto",
                    ...theme.elements.scrollbar
                }}
            >
                {/* верхняя панель инструментов */}
                <Box 
                    sx={{
                        position: "sticky",
                        top: 0,
                        zIndex: 10,
                        textAlign: 'center',
                        background: 'gray',
                    }}
                >
                    { start }
                </Box>

               { children }

               {/* нижняя панель инструментов */}
                <Box 
                    sx={{
                        position: "sticky",
                        bottom: 0,
                        zIndex: 10,
                        marginTop: 'auto',
                        textAlign: 'center',
                        background: 'gray',
                    }}
                >
                    { end }
                </Box>
            </Box>
        </Box>
    );
}