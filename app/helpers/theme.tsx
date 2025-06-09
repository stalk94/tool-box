'use client';

import { ThemeProvider, CssBaseline } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { darkTheme } from '../../src/theme/index';



export default function Providers({ children }: { children: React.ReactNode }) {

    return (
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
            <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                { children }
            </ThemeProvider>
        </AppRouterCacheProvider>
    );
}