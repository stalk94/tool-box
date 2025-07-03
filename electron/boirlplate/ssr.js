import React from 'react';
import { renderToString } from 'react-dom/server';
import createEmotionServer from '@emotion/server/create-instance';
import { CacheProvider } from '@emotion/react';
import App from './App';
import createCache from '@emotion/cache';
import { ThemeProvider, CssBaseline } from '@mui/material';


export function renderApp(theme) {
    const cache = createCache({ key: 'mui', prepend: true });
    const { extractCriticalToChunks, constructStyleTagsFromChunks } = createEmotionServer(cache);

    const html = renderToString(
        <CacheProvider value={cache}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <App />
            </ThemeProvider>
        </CacheProvider>
    );

    const chunks = extractCriticalToChunks(html);
    const styles = constructStyleTagsFromChunks(chunks);

    return { html, styles };
}