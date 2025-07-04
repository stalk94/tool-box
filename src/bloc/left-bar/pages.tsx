import React from "react";
import { Button, IconButton, Box, Typography, Divider, Select, MenuItem} from "@mui/material";
import {
    Settings, AccountTree, Logout, Palette, Extension, Save, Functions,
    RadioButtonUnchecked, RadioButtonChecked, Add, Code
} from "@mui/icons-material";
import { editorContext, infoSlice, cellsSlice } from "../context";
import { createBlockToFile, fetchFolders } from "../helpers/export";
import { usePopUpName, useSafeAsyncEffect } from '../helpers/usePopUp';
import { getUniqueBlockName } from "../helpers/editor";



export const RenderListPages = ({ currentCat }) => {
    const meta = editorContext.meta.use();
    const { popover, handleOpen, trigger } = usePopUpName();
    

    const getKeyNameBreakpoint = (width?: number) => {
        const breakpoints = { lg: 1200, md: 960, sm: 600, xs: 460 };
        width = width ?? size.width.get();

        // Преобразуем в отсортированный массив: от меньшего к большему
        const sorted = Object.entries(breakpoints).sort((a, b) => a[1] - b[1]);

        // Находим первый breakpoint, значение которого >= width
        for (const [key, value] of sorted) {
            if (width <= value) return key;
        }

        // Если ничего не нашли — возвращаем самый крупный
        return sorted[sorted.length - 1][0];
    }
    const getAllBlockFromScope = () => {
        const project = infoSlice.project.get();
        const meta = editorContext.meta.get();

        const currentScope = project[meta.scope];
        return currentScope ?? [];
    }
    const getKeyNameSize = (name: string) => {
        let key = '';
        const find = getAllBlockFromScope().find((el)=> el.name === name);
        if(find?.data?.size?.width) key = getKeyNameBreakpoint(find.data.size.width);

        return key;
    }
    const getColor = (name: string) => {
        let key = '';
        const find = getAllBlockFromScope().find((el)=> el.name === name);
        if(find?.data?.size?.width) key = getKeyNameBreakpoint(find.data.size.width);

        return {
            lg: '#d75d41',   // индиго — для десктопа, стабильный и строгий
            md: '#edb156',   // teal — для планшета, свежий и универсальный
            sm: '#83c9d4',   // тёплый оранжевый — для малых экранов, но без агрессии
            xs: '#909090'
        }[key] ?? '#495057';
    }
    useSafeAsyncEffect (async (isMounted) => {
        if (!trigger) return;

        const meta = editorContext.meta.get();
        const scope = getAllBlockFromScope();
        const existingNames = scope.map(el => el.name);
        const uniqueName = getUniqueBlockName(trigger.replace(/[^\w]/g, ''), existingNames);

        if (typeof window === 'undefined') return;

        try {
            await createBlockToFile(meta.scope, uniqueName);
            const data = await fetchFolders();

            if (isMounted() && data) {
                editorContext.meta.name.set(uniqueName);
                infoSlice.project.set(data);
            }
        } 
        catch (err) {
            console.error('❌ Ошибка при создании блока:', err);
        }
    }, [trigger]);
    

    return (
        <>
            {currentCat === 'all' &&
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Button 
                        size="small" 
                        sx={{mx:2, mb:2, mt:1}} 
                        variant="outlined" 
                        color="success"
                        onClick={handleOpen}
                    >
                        <Add /> add page
                    </Button>

                    { getAllBlockFromScope()?.map((blockData, index) =>
                        <Box key={index} sx={{ display: 'flex', flexDirection: 'row', width:'100%' }}>
                            <button style={{opacity: meta.name === blockData.name ? 1 : 0.5}} 
                                className={`
                                    rounded-md px-2 text-gray-200 
                                    hover:bg-stone-600 hover:text-zinc-400 
                                    transition-colors duration-150 cursor-pointer
                                `}
                            >
                               <Settings sx={{ fontSize: '16px' }} />
                            </button>
                                
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    my: 0.7,
                                    width:'100%',
                                    cursor: 'pointer',
                                    borderBottom: `1px dotted ${meta.name === blockData.name ? '#ffffff61' : '#83818163'}`,
                                    opacity: meta.name === blockData.name ? 1 : 0.5,
                                    '&:hover': {
                                        backgroundColor: '#e0e0e022',
                                    }
                                }}
                                onClick={() => {
                                    if (editorContext.meta.name.get() === blockData.name) return;
                                    editorContext.meta.name.set(blockData.name);
                                }}
                            >
                                <Typography
                                    variant='inherit'
                                    style={{ fontSize: '15px', color: 'white' }}
                                >
                                    <span style={{ marginLeft: '5px', color: 'white' }}>
                                        { blockData.name }
                                    </span>
                                </Typography>
                                <button
                                    style={{
                                        cursor: 'pointer',
                                        color: meta.name === blockData.name ? '#C9C9C9' : '#c9c5c5c7',
                                        background: 'transparent',
                                        marginLeft: 'auto',
                                        borderRadius: '4px',
                                        border: 'none',
                                    }}
                                >
                                    {meta.name === blockData.name
                                        ? <RadioButtonChecked sx={{ fontSize: '16px' }} />
                                        : <RadioButtonUnchecked sx={{ fontSize: '16px' }} />
                                    }
                                </button>
                            </Box>
                        </Box>
                    )}
                    { popover }
                </Box>
            }
        </>
    );
}

export const RenderProjectTopPanel = () => {
    const { popover, handleOpen, trigger } = usePopUpName();
    const [value, setValue] = React.useState(editorContext.meta?.scope?.get());
    

    const handleChangeScope = (newScope: string) => {
        const currentProject = infoSlice.project?.get()?.[newScope];
        const existingNamesBlocks = currentProject.map(el => el.name);
        
        // 🧹 Чистим layout/render до применения нового
        editorContext.size.set({ width: 0, height: 0, breackpoint: 'lg' });

        setValue(newScope);
        editorContext.meta.scope.set(newScope);
        if(existingNamesBlocks[0]) editorContext.meta.name.set(existingNamesBlocks[0]);
    }
    useSafeAsyncEffect(async (isMounted) => {
        if (!trigger) return;
        
        const existingNames = Object.keys(infoSlice.project.get()) ?? [];
        const uniqueName = getUniqueBlockName(trigger.trim(), existingNames);

        if (uniqueName.length <= 3 || typeof window === 'undefined') return;

        try {
            await createBlockToFile(uniqueName, 'root');
            const data = await fetchFolders();
            
            if (isMounted() && data) {
                editorContext.meta.scope.set(uniqueName);
                editorContext.meta.name.set('root');
                infoSlice.project.set(data);

                handleChangeScope(uniqueName);
            }
        } 
        catch (err) {
            console.error('❌ Ошибка при создании блока:', err);
        }
    }, [trigger]);
    editorContext.meta.scope.useWatch((scope)=> {
        console.log(scope);
        setValue(scope);
    });
    


    return(
        <Box sx={{ display: 'flex' }}>
            <Select
                size="small"
                value={value}
                onChange={(e) => handleChangeScope(e.target.value)}
                displayEmpty
                sx={{ 
                    fontSize: 14, 
                    height: 36, 
                    color: value === 'system' ? 'red' : '#ccc', 
                    background: '#2a2a2a84', 
                    ml: 1, 
                    mt: 0.3 
                }}
            >
                {Object.keys(infoSlice.project.get())?.map((scope) => (
                    <MenuItem key={scope} 
                        value={scope} 
                        style={{color: scope === 'system' && 'red'}}
                    >
                        { scope }
                    </MenuItem>
                ))}
            </Select>
            <IconButton
                color="inherit"
                sx={{}}
                onClick={handleOpen}
            >
                <Add />
            </IconButton>
            { popover }
        </Box>
    );
}