import React from "react";
import { SnackbarProvider, useSnackbar } from 'notistack';
import Container from '@mui/material/Container';
import { Button, ThemeProvider, createTheme } from '@mui/material';
import Render from './Render';
import { AlertProvider, useAlert } from 'src/index';
import type { RenderPageData, ProjectConfig } from '../type';

type PageProps = {
    theme: any
    data: RenderPageData
    prev?: boolean
}

const Helpers = ({ children, theme }) => {
    return (
        <ThemeProvider theme={createTheme(theme)}>
            <AlertProvider
                delDelay={6000}
                variant='top-right'
            >
                <SnackbarProvider
                    maxSnack={3}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    autoHideDuration={4000}
                    preventDuplicate
                >
                    { children }
                </SnackbarProvider>
            </AlertProvider>
        </ThemeProvider>
    );
}


export default function Page({ theme, data, prev }: PageProps) {
    const { addAlert } = useAlert();
    globalThis.PRODACTION = prev ? false : true;
    globalThis.__META__ = data.meta;
    globalThis.EDITOR = false;


    React.useEffect(() => {
        sharedEmmiter.on('error', (msg)=> addAlert('error', msg));
        sharedEmmiter.on('success', (msg)=> addAlert('success', msg));
        sharedEmmiter.on('info', (msg)=> addAlert('info', msg));
        
        return () => {
            if (prev) {
                globalThis.EDITOR = true;
            }
            sharedEmmiter.off('error', (msg)=> addAlert('error', msg));
            sharedEmmiter.off('success', (msg)=> addAlert('success', msg));
            sharedEmmiter.off('info', (msg)=> addAlert('info', msg));
        }
    }, []);


    return (
        <Helpers theme={theme}>
            {prev &&
                <div
                    style={{ 
                        position: 'absolute', 
                        zIndex: 99999, 
                        right: 0, 
                        bottom: 0 
                    }}
                >
                    <Button variant="outlined" onClick={prev}>
                        go editor
                    </Button>
                </div>
            }
            <div className="PAGE-CONTAINER"
                style={{
                    width: '100%',
                    maxWidth: '100%',
                    height: '100%',
                    overflowX: 'hidden',
                    overflowY: 'auto',
                }}
            >
                {data.header &&
                    <Render
                        layouts={data.header.layouts}
                        cells={data.header.content}
                        size={data.header.size}
                    />
                }
                <Render
                    layouts={data.body.layouts}
                    cells={data.body.content}
                    size={data.body.size}
                />
                {data.footer &&
                    <Render
                        layouts={data.footer.layouts}
                        cells={data.footer.content}
                        size={data.footer.size}
                    />
                }
            </div>
        </Helpers>
    );
}