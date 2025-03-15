import { createTheme, PaletteOptions } from "@mui/material/styles";


const shadows = {
    xs: '0px 1px 3px rgba(0, 0, 0, 0.1)',
    sm: '0px 2px 6px rgba(0, 0, 0, 0.15)',
    md: '0px 4px 12px rgba(0, 0, 0, 0.2)',
    lg: '0px 6px 18px rgba(0, 0, 0, 0.25)',
    xl: '0px 8px 24px rgba(0, 0, 0, 0.3)',
}
// глобальные стили для элементов
const elements = {
    input: {
        fontStyle: "italic",
        variant: <undefined|"fullWidth"|"inset"|"middle"> 'middle',
        alight: <'center'|undefined> undefined
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