import 'primereact/resources/primereact.min.css'; 
import 'primeicons/primeicons.css';  
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css'; 
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
import { AlertProvider } from './index';
import Page from './bloc/export/Page';
import SandBox from './sand/SandBox';
import './bloc/modules/index';
import "./style/edit.css";


const App = () => {
    const savedTheme = localStorage.getItem('theme');
    const mod = localStorage.getItem('MOD');
    const [mode, setMode] = React.useState(mod ?? 'sand');
    const [darkMode, setDarkMode] = React.useState(savedTheme === 'light' ? false: true);

    const useMode =(type: 'sand' | 'editor')=> {
        setMode(type);
        localStorage.setItem('MOD', type);
    }
    React.useEffect(()=> {
        if (!globalThis.__DATA__) globalThis.EDITOR = true;
    }, []);


    if (globalThis.__DATA__) return(
        <Page
            theme={globalThis.__DATA__.theme}
            data={globalThis.__DATA__.data}
        />
    );
    return(
        <Provider store={store}>
            <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
                <AlertProvider>
                    <CssBaseline />
                    <SnackbarProvider
                        maxSnack={3}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        autoHideDuration={4000}
                        preventDuplicate
                    >
                        { mode === 'sand' &&
                            <SandBox setMode={useMode} />
                        }
                        { mode !== 'sand' &&
                            <Editor setMode={useMode} />
                        }
                    </SnackbarProvider>
                </AlertProvider>
            </ThemeProvider>
        </Provider>
    );
}


//------------------------------------------------------------------------

const container = document.querySelector('.root');
const root = createRoot(container);
root.render(<App />);


/**
 * <Tools mode={darkMode} toggleTheme={toggleTheme}/>
                                <MovieTable />
 */