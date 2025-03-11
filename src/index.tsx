import { EVENT, send } from "./lib/engine";
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { createRoot } from 'react-dom/client';
import ErrorBoundary from './components/error';
import { createTheme, ThemeProvider, Button, CssBaseline } from '@mui/material';
import MovieTable from './components/movie-table';
import { dark, lite } from './lib/colors';
import Test from './test';
import './style/index.css';


const Tools =({ toggleTheme, mode })=> {
    
    return(
        <div style={{display:'flex',flexDirection:'row', padding:'5px'}}>
            <div style={{display:'flex',flexDirection:'row',marginLeft:'auto'}}>
                <div style={{margin:'auto', marginRight:'25px'}}>
                    { mode===true ? '☀️' : '🌙' }
                </div>
                <Button onClick={toggleTheme} variant="contained">
                    { mode===true ? 'lite mod' : 'dark mod' }
                </Button>
            </div>
        </div>
    );
}


function App() {
    const savedTheme = localStorage.getItem('theme');
    const [darkMode, setDarkMode] = React.useState(savedTheme === 'dark' ? true : false);
    const themeLight = createTheme({
        palette: {
            mode: 'light',
            ...lite
        },
    });
    const themeDark = createTheme({
        palette: {
            mode: 'dark',
            ...dark
        },
    });

    
    const toggleTheme =()=> {
        localStorage.setItem('theme', !darkMode ? 'dark' : 'light');
        setDarkMode(!darkMode);
    }
    React.useEffect(()=> {
        
    }, []);

    
    return(
        <ErrorBoundary>
            <ThemeProvider theme={darkMode?themeDark:themeLight}>
                <CssBaseline />
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={
                            <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
                                <Test />
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