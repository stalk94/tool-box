import { createTheme } from "@mui/material/styles";


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
            default: "#1a2035",
            sidenav: "#1f283e",
            card: "#202940",
            paper: "#272c3a",
        },
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