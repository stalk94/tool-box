import React from 'react';
import ReactDOM from 'react-dom';
import { Theme } from '@mui/system';
import reactToWebComponent from 'react-to-webcomponent';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { desserealize } from '../../helpers/sanitize';
import type { ComponentSerrialize } from '../../type';





export function registerWebComponent(children: ComponentSerrialize, theme: Theme) {
    const cache = createCache({ key: 'mui' });
    const name = `editor-${children.props['data-type'].toLowerCase()}`;

    const Wrapped = (props: any) => {
        const RenderElement = React.useMemo(() => desserealize(children), [children]);

        return (
            <CacheProvider value={cache}>
                <ThemeProvider theme={theme}>
                    { RenderElement }
                </ThemeProvider>
            </CacheProvider>
        );
    }

    const WC = reactToWebComponent(Wrapped, React, ReactDOM);
    customElements.define(name, WC);
}