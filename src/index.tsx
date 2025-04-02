import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { createRoot } from 'react-dom/client';
import ErrorBoundary from './components/error';
import { createTheme, ThemeProvider, Button, CssBaseline } from '@mui/material';
import { darkTheme, lightTheme } from './_theme/index';
//import { dark, lite } from './lib/colors';

import './style/index.css';


function App() {
    const savedTheme = localStorage.getItem('theme');
    const [darkMode, setDarkMode] = React.useState(savedTheme === 'dark' ? true : false);

    
    const toggleTheme =()=> {
        localStorage.setItem('theme', !darkMode ? 'dark' : 'light');
        setDarkMode(!darkMode);
    }
    React.useEffect(()=> {
        
    }, []);

    
    return(
        <ErrorBoundary>
            <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
                <CssBaseline />
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={
                            <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
                                
                            </div>
                        } />
                        <Route path="*" element={<Navigate to='/' replace />} />
                    </Routes>
                </BrowserRouter>
            </ThemeProvider>
        </ErrorBoundary>
    );
}



//------------------------------------------------------------------------
createRoot(document.querySelector(".root")).render(<App/>);

/**
 * <Tools mode={darkMode} toggleTheme={toggleTheme}/>
                                <MovieTable />
 */