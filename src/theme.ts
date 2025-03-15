import { createTheme, PaletteOptions, Theme } from "@mui/material/styles";


// глобальные стили для элементов
const elements = {
    input: {
        fontStyle: "italic",
        variant: <undefined|"fullWidth"|"inset"|"middle"> 'middle',
        alight: <'center'|undefined> undefined
    }
}

declare module '@mui/material/styles' {
    interface Palette {
        placeholder: {
            main: string;
        };
    }

    interface PaletteOptions {
        placeholder?: {
            main: string;
        };
    }

    interface Theme {
        elements: typeof elements;
    }

    interface ThemeOptions {
        elements?: typeof elements;
    }
}

export const darkTheme = createTheme({
    elements,
    palette: {
        mode: "dark",
        primary: {
            main: "#90caf9",
        },
        secondary: {
            main: "#f48fb1",
        },
        text: {
            disabled: 'gray'
        },
        placeholder: {
            main: '#808080'   
        },
        background: {
            default: '#2c303d',
            sidenav: "#1f283e",
            card: "#202940",
            paper: "#3b3b3ba8",
            input: "#3b3b3ba8"      // цвет фона всех инпутов, селектов
        },
        action: {
            active: '#ffffff21'
        }
    },
});

export const lightTheme = createTheme({
    elements,
    palette: {
        mode: "light",
        primary: {
            main: "#1976d2",
        },
        secondary: {
            main: "#dc004e",
        },
        placeholder: {
            main: '#808080'   
        },
    }
});