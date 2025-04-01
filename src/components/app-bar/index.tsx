import React from "react";
import { AppBar, Toolbar, Box, useTheme, AppBarProps, alpha } from "@mui/material";
import LinearNavigationDesktop from './linear-desktop';
import MobailBurgerNavigation from './mobail-burger';

type AppBarCustomProps = AppBarProps & {
    start: React.ReactNode
    center: React.ReactNode
    end: React.ReactNode
}


/** 
 * шаблон левого слота 
 */
export const Start =({ children })=> {
    return(
        <Box
            sx={{
                display: "flex",
                justifyContent: "flex-start",
                flexGrow: 1,
                alignItems: "center"
            }}
        >
            { children }
        </Box>
    );
}
/** 
 * шаблон центрального слота, (! это линейная навигация она видна только на desktop) 
 */
export const Center = LinearNavigationDesktop;
/** 
 * компонент мобильного меню заменяет LinearNavigation на маленьких экранах 
 */
export const MobailBurger = MobailBurgerNavigation;


/**
 * строительный шаблон для app bar, наследуется от MUI appbar
 * - `start` - левый слот 
 * - `center` - центральный слот (к примеру линейная навигация)
 * - `end` - правый слот (к примеру user, main)
 */
export default function ({ start, center, end, ...props }: AppBarCustomProps) {
    const theme = useTheme();

    // alpha(theme.palette.background.input, 0.35)
    return(
        <AppBar 
            position="static" 
            sx={{ 
                p: 0, 
                m: 0, 
                backgroundColor: theme.palette.background.appBar,
                backdropFilter: "blur(14px)",
            }}
            { ...props }
        >
            <Toolbar 
                disableGutters 
                sx={{ px: 1, }}
            >
               { start }
               { center }

               <Box
                    sx={{
                        ml: 'auto'
                    }}
                >
                    { end }
                </Box>
            </Toolbar>
        </AppBar>
    );
}