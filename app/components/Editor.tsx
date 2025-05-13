import React from 'react';
import {
  ThemeProvider,
  CssBaseline,
  Button,
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box, IconButton
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { EditorProvider, useEditor } from './page-editor/context';
import { darkTheme, lightTheme } from '../theme/index';
import BlocEditorClient from '@bloc/App';
import PageEditorClient from './page-editor/PageEditor'



export default function Editor({ listsPages }: { listsPages: string[] }) {
    const [showBlocEditor, setShowBlocEditor] = React.useState(true);


    React.useEffect(()=> {
        globalThis.EDITOR = true;
    }, []);
    

    return(
        <ThemeProvider theme={darkTheme}>
            <EditorProvider>
            <CssBaseline />
                <>
                    { showBlocEditor ? (
                        <>
                            <BlocEditorClient setShowBlocEditor={setShowBlocEditor} />
                            <Box 
                                sx={{position: 'fixed', zIndex:4, bottom:10,right:10}}
                            >
                                <IconButton sx={{border:'1px solid gray'}} onClick={()=> setShowBlocEditor(false)}>
                                    <ArrowBack />
                                </IconButton>
                            </Box>
                        </>
                    ) : (
                        
                        <PageEditorClient
                            setShowBlocEditor={setShowBlocEditor}
                            listsPages={listsPages}
                        />
                    )}
                </>
            </EditorProvider>
        </ThemeProvider>
    );
}