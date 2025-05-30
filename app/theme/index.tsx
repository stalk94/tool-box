import { createTheme, PaletteOptions, ThemeOptions, Theme } from "@mui/material/styles";
import { CSSProperties } from "react";
import { typography, components } from './elements';
import { darkPallete } from './dark';
import { lightPallete } from './light';
import { mixins } from './mixins';


declare module '@mui/material/styles' {
    interface Mixins {
        responsivePadding: CSSProperties
    }
    interface Palette {
        input: {
            main: string
            border: string
            error: string
            success: string
            placeholder: string
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
    interface Theme {
        elements: typeof elements;
    }
}

// расщирения интерфейсов buttons
declare module '@mui/material/Button' {
    interface ButtonPropsColorOverrides {
        navigation: true;
    }
}



export const darkTheme = createTheme({
    typography: typography.typography,
    mixins,
    palette: darkPallete.palette,
    components: components.components,
});
export const lightTheme = createTheme({
    mixins,
    palette: lightPallete.palette,
});