import { createTheme } from "@mui/material/styles";

const shadows = {
    xs: '0px 1px 3px rgba(0, 0, 0, 0.1)',
    sm: '0px 2px 6px rgba(0, 0, 0, 0.15)',
    md: '0px 4px 12px rgba(0, 0, 0, 0.2)',
    lg: '0px 6px 18px rgba(0, 0, 0, 0.25)',
    xl: '0px 8px 24px rgba(0, 0, 0, 0.3)',
}


export const darkTheme = createTheme({
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
        background: {
            default: '#2c303d',
            sidenav: "#1f283e",
            card: "#202940",
            paper: "#3b3b3ba8",
        },
        action: {
            active: '#ffffff21'
        }
    },
});

export const lightTheme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#1976d2",
        },
        secondary: {
            main: "#dc004e",
        },
    },
});