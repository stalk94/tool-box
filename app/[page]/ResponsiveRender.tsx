'use client';
import React from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
import RenderPage from '../components/RenderPage';
import { DataRenderPage } from '../types/page';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { darkTheme, lightTheme } from '../theme/index';
import { useRouter } from 'next/navigation';
import '../globals.css'; // обязательно для стилей

type Props = {
  schema: DataRenderPage;
  header?: DataRenderPage;
  footer?: DataRenderPage;
}


export default function ResponsiveRenderPage({ schema, header, footer }: Props) {
    const router = useRouter();
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down('sm'));
    const isSm = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const isMd = useMediaQuery(theme.breakpoints.between('md', 'lg'));

    let currentBreakpoint: 'lg' | 'md' | 'sm' | 'xs' = 'lg';
    if (isXs) currentBreakpoint = 'xs';
    else if (isSm) currentBreakpoint = 'sm';
    else if (isMd) currentBreakpoint = 'md';
    globalThis.EDITOR = false;                      // меняем флаг
    
    React.useEffect(() => globalThis.ROUTER = router, [router]);

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <RenderPage 
                schema={schema} 
                headerBlock={header} 
                footerBlock={footer}
                breakpoint={currentBreakpoint}
            />
        </ThemeProvider>
    );
}