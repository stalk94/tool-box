'use client';

import * as React from 'react';
import { CacheProvider } from '@emotion/react';
import createEmotionCache from './cache';

const clientSideEmotionCache = createEmotionCache();


export default function EmotionRegistry({ children }: { children: React.ReactNode }) {
    return (
        <CacheProvider value={clientSideEmotionCache}>
            { children }
        </CacheProvider>
    );
}