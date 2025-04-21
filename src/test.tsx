import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { createRoot } from 'react-dom/client';
import ErrorBoundary from './components/error';
import { createTheme, ThemeProvider, Button, CssBaseline } from '@mui/material';
import { darkTheme, lightTheme } from './theme/index';
import './style/index.css';
import Editor from './bloc/App';



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
    }, []);

    
    return(
        <ErrorBoundary>
            <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
                <CssBaseline />
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={
                            <Editor 
                                height={size.height} 
                                setHeight={(height: number)=> setSize({...size, height})}
                            />
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