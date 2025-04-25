'use client'
import React from 'react';
import dynamic from 'next/dynamic';
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
import { DataRenderPage } from '../types/page';
import { EditorProvider, useEditor } from './page-editor/context';
import LeftTools from './page-editor/LeftTools';
import TopBar from './page-editor/TopBar';
import WorkArea from './page-editor/WorkArea';
import { darkTheme, lightTheme } from '../theme/index';


const BlocEditorRaw = dynamic(() => import('@bloc/App'), { ssr: false });
const BlocEditorClient = React.memo(BlocEditorRaw);


const PageEditor = ({ listsPages, setShowBlocEditor }: { listsPages: string[], setShowBlocEditor:(v:boolean)=> void }) => {
    const { 
        curentScope, 
        curentScopeBlockData, 
        setScopeBlockData,
        setList, 
        curentPageName, 
        curentPageData, 
        setPageData 
    } = useEditor();


    const pagaDump = async() => {
        if (!curentPageName || !curentPageData) {
            console.warn('Нет данных для сохранения страницы');
            return;
        }

        try {
            const response = await fetch(`/api/pages/${curentPageName}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(curentPageData),
            });

            if (!response.ok) {
                throw new Error(`Ошибка при сохранении страницы: ${response.statusText}`);
            }

            console.log('✅ Страница успешно сохранена');
        } 
        catch (error) {
            console.error('❌ Ошибка при сохранении страницы:', error);
        }
    }
    async function fetchPage(name: string): Promise<DataRenderPage> {
        const res = await fetch(`/api/pages/${name}`);
        if (!res.ok) throw new Error('page не найден');
        return await res.json();
    }
    React.useEffect(()=> {
        if(curentPageName) {
            globalThis.EDITOR = false;

            fetchPage(curentPageName)
                .then(setPageData)
                .catch(console.error)
        }
    }, [curentPageName]);
    React.useEffect(()=> {
        if(curentScope) {
            fetch(`/api/block/${curentScope}`)
                .then((res)=> res.json())
                .then((data)=> {
                    if(!data.error) setScopeBlockData(data);
                    else console.error(data.error);
                })
                .catch(console.error)
        }
    }, [curentScope]);
    React.useEffect(() => {
        setList(listsPages);
    }, []);

    
    return (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'row' }}>
            <LeftTools
                useDump={pagaDump}
                addPage={console.log}
            />
            <div style={{ width: '80%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <TopBar 
                    setShowBlocEditor={setShowBlocEditor}
                />
                { curentPageData && <WorkArea /> }
            </div>
        </div>       
    );
}



export default function ({ listsPages }: { listsPages: string[] }) {
    const [showBlocEditor, setShowBlocEditor] = React.useState(false);

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
                        
                        <PageEditor
                            setShowBlocEditor={setShowBlocEditor}
                            listsPages={listsPages}
                        />
                    )}
                </>
            </EditorProvider>
        </ThemeProvider>
    );
}