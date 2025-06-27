import { createTheme, PaletteOptions, ThemeOptions, Theme } from "@mui/material/styles";
import { CSSProperties } from "react";
import { typography, components } from './elements';
import { darkPallete } from './dark';
import { taskadePallete } from './taskade';
import { lightPallete } from './light';
import { mixins } from './mixins';


declare module '@mui/material/styles' {
    interface Mixins {
        responsivePadding: CSSProperties
        scrollbar: CSSProperties
    }
    interface Palette {
        input: {
            main: string
            border: string
            error: string
            success: string
            placeholder: string
        }
        slider: {
            thumb: string       // Цвет "пальца" ползунка
            track: string       // Цвет пути ползунка
            rail: string        // Цвет "рельсы" (основной фон)
        }
        chekbox: {
            main: string
            border: string
            success: string
        }
        switch: {
            trackOn: string
            trackOff: string
            thumb: string
            border: string
            icon: string
        }
        placeholder: {
            main: string;
        }
        table: {
            body: string
            header: string
            thead: string
        }
        navigation: {
            main: string
        }
        toolNavBar: {
            main: string
            select: string
            icon: string
            badgeText: string
            badgeBcg: string
        }
        menu: {
            main: string
            select: string
        }
    }

    interface TypeBackground {
        sidenav: string;
        card: string;
        input: string;
        navBar: string;
        appBar: string;
        menu: string;
    }

    interface PaletteOptions {
        placeholder?: {
            main: string;
        };
        table?: {
            body: string
            header: string
            thead: string
        }
        navigation: {
            main: string
        }
    }
}

//////////////////////////////////////////////////////
//      overides component props
//////////////////////////////////////////////////////
declare module '@mui/material/Button' {
    interface ButtonPropsSizeOverrides {
        mini: true;
    }
}
declare module '@mui/material/IconButton' {
    interface IconButtonPropsSizeOverrides {
        mini: true;
    }
}


export const darkTheme = createTheme({
    typography: typography.typography,
    mixins,
    palette: darkPallete.palette,
    components: components.components,
});
export const taskadeTheme = createTheme({
    typography: typography.typography,
    mixins,
    palette: taskadePallete.palette,
    components: components.components,
});
export const lightTheme = createTheme({
    mixins,
    palette: lightPallete.palette,
    components: components.components
});