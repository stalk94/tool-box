import { createTheme, PaletteOptions, ThemeOptions, Theme } from "@mui/material/styles";


declare module '@mui/material/styles' {
    interface Palette {
        placeholder: {
            main: string;
        };
        table: {
            body: string
            header: string
            thead: string
        }
    }

    interface TypeBackground {
        sidenav: string;
        card: string;
        input: string;
        navBar: string;
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
    }
    interface Theme {
        elements: typeof elements;
    }
    interface ThemeOptions {
        elements?: typeof elements;
    }
}



// глобальные стили для элементов
const elements = {
    input: {
        fontStyle: "italic",
        variant: <undefined|"fullWidth"|"inset"|"middle"> 'middle',
        alight: <'center'|undefined> undefined
    },
    scrollbar: {
        "&::-webkit-scrollbar": {
            width: "3px",
            height: "5px",
        },
        "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#7e7e7e",
            borderRadius: '7px',
        },
        "&::-webkit-scrollbar-track": {
            background: "#2e2e2e",
        }
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
        table: {
            body: "#5151513f",
            header: "#5c5c5c62",
            thead: "#353943"
        },
        background: {
            default: '#2c303d',
            sidenav: "#1f283e",
            card: "#202940",
            paper: "rgb(63, 63, 63)",
            input: "rgba(59, 59, 59, 0.01)",      // цвет фона всех инпутов, селектов #3b3b3ba8
            navBar: "#86898d61"
        },
        // это управляет цветами обводок инпутов
        action: {
            active: 'rgba(255, 255, 255, 0.25)'  
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