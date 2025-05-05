'use client';
import React from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
import RenderPage from '../components/RenderPage';
import { DataRenderPage } from '../types/page';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { darkTheme, lightTheme } from '../theme/index';
import '../globals.css'; // обязательно для стилей



export default function ResponsiveRenderPage({ schema }: { schema: DataRenderPage }) {
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down('sm'));
    const isSm = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const isMd = useMediaQuery(theme.breakpoints.between('md', 'lg'));

    let currentBreakpoint: 'lg' | 'md' | 'sm' | 'xs' = 'lg';
    if (isXs) currentBreakpoint = 'xs';
    else if (isSm) currentBreakpoint = 'sm';
    else if (isMd) currentBreakpoint = 'md';
    globalThis.EDITOR = false;                      // меняем флаг


    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <RenderPage 
                schema={schema} 
                breakpoint={currentBreakpoint}
            />
        </ThemeProvider>
    );
}