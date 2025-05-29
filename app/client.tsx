'use client';

import React from 'react';
import Editor from '@bloc/App';
import { Provider } from 'react-redux';
import { store } from 'statekit-react';
import { createTheme, ThemeProvider, Button, CssBaseline } from '@mui/material';
import { darkTheme, lightTheme } from './theme/index';


export default function EditorClient() {
    React.useEffect(() => {
        globalThis.EDITOR = true;
    }, []);

    
    return (
        <Provider store={store}>
            <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                <Editor />
            </ThemeProvider>
        </Provider>
    );
}