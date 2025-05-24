import 'primereact/resources/primereact.min.css'; 
import 'primeicons/primeicons.css';   
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { createRoot } from 'react-dom/client';
import { SnackbarProvider } from 'notistack';
import { Provider } from 'react-redux';
import ErrorBoundary from './components/error';
import { createTheme, ThemeProvider, Button, CssBaseline } from '@mui/material';
import { darkTheme, lightTheme } from './theme/index';
import './style/index.css';
import Editor from './bloc/App';
import { store } from 'statekit-react';
import './bloc/modules/index';

const App = () => {
    const savedTheme = localStorage.getItem('theme');
    const [darkMode, setDarkMode] = React.useState(savedTheme === 'light' ? false: true);
    const [size, setSize] = React.useState({
        width: 100,
        height: 100
    });
    

    const toggleTheme =()=> {
        localStorage.setItem('theme', !darkMode ? 'dark' : 'light');
        setDarkMode(!darkMode);
    }
    React.useEffect(()=> {
        globalThis.EDITOR = true;
    }, []);


    
    return(
        <Provider store={store}>
            <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
                <CssBaseline />
                <SnackbarProvider
                    maxSnack={3}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    autoHideDuration={4000}
                    preventDuplicate
                >
                    <Editor/>
                </SnackbarProvider>
            </ThemeProvider>
        </Provider>
    );
}


//------------------------------------------------------------------------


createRoot(document.querySelector(".root")).render(<App/>);


/**
 * <Tools mode={darkMode} toggleTheme={toggleTheme}/>
                                <MovieTable />
 */