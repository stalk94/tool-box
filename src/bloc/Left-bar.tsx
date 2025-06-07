import React from "react";
import { Button, IconButton, Box, Popover, Typography, Divider, Select, MenuItem, Chip, Stack, FormControlLabel } from "@mui/material";
import { BorderStyle, CheckBox, ColorLens, FormatColorText, More, Widgets } from '@mui/icons-material';
import {
    Settings, AccountTree, Logout, Palette, Extension, Save, Functions,
    RadioButtonUnchecked, RadioButtonChecked, Add, Code
} from "@mui/icons-material";
import { FaReact } from 'react-icons/fa';
import { editorContext, infoSlice, renderSlice, cellsSlice } from "./context";
import { TooglerInput } from '../components/input/input.any';
import LeftSideBarAndTool from '../components/nav-bars/tool-left'
import { updateComponentProps, updateCelltProps } from './helpers/updateComponentProps';
import Forms from './Forms';
import Inspector from './Inspector';
import { componentGroups, componentAtom } from './config/category';
import { createBlockToFile, fetchFolders } from "./helpers/export";
import { componentMap, componentsRegistry } from "./modules/helpers/registry";
import { usePopUpName, useSafeAsyncEffect } from './helpers/usePopUp';
import { getUniqueBlockName } from "./helpers/editor";
import { LeftToolPanelProps, ProxyComponentName, Component } from './type';
import { useKeyboardListener } from './helpers/hooks';
import { db } from "./helpers/export";
import { DraggableToolItem } from './Dragable';
import exportsGrid from "./modules/export/Grid";


const RenderListProject = ({ currentCat }) => {
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
const RenderProjectTopPanel = () => {
    const { popover, handleOpen, trigger } = usePopUpName();
    const [value, setValue] = React.useState(editorContext.meta?.scope?.get());
    

    const handleChangeScope = (newScope: string) => {
        const currentProject = infoSlice.project?.get()?.[newScope];
        const existingNamesBlocks = currentProject.map(el => el.name);
        
        // 🧹 Чистим layout/render до применения нового
        renderSlice.set([]);
        editorContext.layout.set([]);
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
                sx={{ fontSize: 14, height: 36, color: '#ccc', background: '#2a2a2a84', ml: 1, mt: 0.3 }}
            >
                {Object.keys(infoSlice.project.get())?.map((scope) => (
                    <MenuItem key={scope} value={scope} >
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
function AtomsRenderer({ category, setCategory, desserealize }) {
    const [blankComponents, setBlankComponents] = React.useState<React.JSX.Element[]>([]);

    React.useEffect(() => {
        if (category === 'blank') {
            (async () => {
                const value = await db.get('blank');
                const result = Object.keys(value || {}).map(key => desserealize(value[key]));
                setBlankComponents(result);
            })();
        }
    }, [category]);

    return (
        <>
            {category === 'blank' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                    {blankComponents.map((el, i) => (
                        <div key={i} style={{ width: 80, height: 80, overflow: 'hidden', border: '1px solid #ccc' }}>
                            <div
                                style={{
                                    transform: `scale(0.2)`,
                                    transformOrigin: 'top left',
                                    width: `${100 / 0.2}%`,
                                    height: `${100 / 0.2}%`,
                                    pointerEvents: 'none',
                                }}
                            >
                                { el }
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}


const useAtoms =(category, setCategory, desserealize)=> {
    const categories = Object.entries(componentAtom);

    return {
        start: (
            <TooglerInput
                value={category}
                onChange={setCategory}
                sx={{ px: 0.2 }}
                items={categories.map(([id, group]) => {
                    const Icon = group.icon ?? Settings;
                    return {
                        id,
                        label: <Icon style={{ fontSize: 18 }} />
                    };
                })}
            />
        ),
        children: (
            <AtomsRenderer
                category={category} 
                setCategory={setCategory}
                desserealize={desserealize} 
            />
        )
    };
}
const useElements = (currentTool, setCurrentTool) => {
    const categories = Object.entries(componentGroups);
    const itemsInCurrentCategory = Object.entries(componentMap).filter(([type]) => {
        const meta = componentsRegistry[type] as any; // или прокинуть icon/category отдельно

        const category = meta?.category ?? 'misc';
        return category === currentTool;
    });

    return {
        start: (
            <TooglerInput
                value={currentTool}
                onChange={setCurrentTool}
                sx={{ px: 0.2 }}
                items={categories.map(([id, group]) => {
                    const Icon = group.icon ?? Settings;
                    return {
                        id,
                        label: <Icon sx={{ fontSize: 18 }} />
                    };
                })}
            />
        ),
        children: (
            <>
                {itemsInCurrentCategory.map(([type, config]: [ProxyComponentName, any]) => {
                    const Icon = componentsRegistry[type].icon ?? Settings;

                    return (
                        <Box key={type} sx={{ display: 'flex', flexDirection: 'row', mb: 1 }}>
                            <DraggableToolItem
                                id={type}
                                dataType={type}
                                type={'element'}
                                element={
                                    <Button
                                        variant="outlined"
                                        style={{ color: '#fcfcfc', borderColor: '#fcfcfc61', boxShadow: '0px 2px 1px rgba(0, 0, 0, 0.4)' }}
                                        startIcon={<Icon sx={{ color: 'gray', fontSize: 18 }} />}
                                        sx={{ width: '100%', opacity: 0.6 }}
                                        
                                    >
                                        { type }
                                    </Button>
                                }
                            />
                        </Box>
                    );
                })}
            </>
        )
    };
}
const useStylesEditor = (elem, onChange, curSub, setSub) => {
    
    return {
        start: (
            <TooglerInput
                value={curSub}
                disabled={!elem.get()}
                onChange={setSub}
                sx={{ px: 0.2 }}
                items={[
                    { label: <More sx={{ fontSize: 18 }} />, id: 'props' },
                    { label: <ColorLens sx={{ fontSize: 18 }} />, id: 'styles' },
                    { label: <BorderStyle sx={{ fontSize: 18 }} />, id: 'flex' },
                    { label: <FormatColorText sx={{ fontSize: 20 }} />, id: 'text' },
                ]}
            />
        ),
        children: (
            <Forms
                type={curSub}
                elemLink={elem}
                onChange={onChange}
            />
        )
    };
}
const useSlot = (slot, curSub, setSub, onChange) => {
    return {
        start: (
            <TooglerInput
                value={curSub}
                disabled={!slot?.component?.get()}
                onChange={setSub}
                sx={{ px: 0.2 }}
                items={[
                    { label: <More sx={{ fontSize: 18 }} />, id: 'props' },
                    { label: <ColorLens sx={{ fontSize: 18 }} />, id: 'style' },
                    { label: <BorderStyle sx={{ fontSize: 18 }} />, id: 'flex' },
                    { label: <FormatColorText sx={{ fontSize: 20 }} />, id: 'text' },
                ]}
            />
        ),
        children: (
            <Forms
                type={curSub}
                elemLink={slot?.component}
                onChange={onChange}
            />
        )
    };
}


// левая панель редактора
export default function ({ useDump, desserealize }: LeftToolPanelProps) {
    const meta = editorContext.meta;
    const select = infoSlice.select;
    const [force, useForce] = React.useReducer((i)=> i+1, 0);
    const [curSlotPanel, setCurSlotPanel] = React.useState<'props' | 'styles' | 'flex' | 'text'>('props');
    const [curSubpanel, setSubPanel] = React.useState<'props' | 'styles' | 'flex' | 'text'>('props');
    const [currentToolPanel, setCurrentToolPanel] = React.useState<'project' | 'component' | 'atoms' | 'styles' | 'slot'>('project');
    const [currentTool, setCurrentTool] = React.useState<keyof typeof componentGroups>('misc');
    const [currentAtom, setCurrentAtom] = React.useState<string>('blank');

    
    const menuItems = [
        { id: 'project', label: 'управление', icon: <AccountTree />, style: {paddingTop:2} },
        { divider: <Divider sx={{borderColor: 'rgba(128, 128, 129, 0.266)',my:1.2}}/> },
        { id: 'component', label: 'Библиотека', icon: <Extension /> },
        { divider: true },
        { id: 'styles', label: 'Настройки', icon: <Palette /> },
        { divider: true },
        { id: 'atoms', label: 'Атомы', icon: <FaReact size={22}/> },
        { divider: true },
        //{ id: 'slot', label: 'cell', icon: <TbCell size={24} style={{margin: 3}} /> }
    ];
    const endItems = [
        { id: 'save', label: 'Сохранить', icon: <Save /> },
        { id: 'export', label: 'export', icon: <Code /> },
        { id: 'exit', label: 'Выход', icon: <Logout /> }
    ];

    const handleExportGrid = () => exportsGrid(
        editorContext.layouts.get(),
        cellsSlice.get(),
        meta.scope.get(),
        meta.name.get()
    );
    useKeyboardListener((key)=> {
        if(key === '1') setCurrentTool('block');
        else if(key === '2') setCurrentTool('interactive');
        else if(key === '3') setCurrentTool('media');
        else if(key === '4') setCurrentTool('complex');
        else if(key === '5') setCurrentTool('misc');
    });
    React.useEffect(() => {
        const handler = (data) => {
            if (data.curentComponent) {
                requestIdleCallback(()=> select.content.set(data.curentComponent));
            }
            if (data?.currentToolPanel) {
                if(data.force) useForce();
                setTimeout(()=> setCurrentToolPanel(data.currentToolPanel), 0);
            }
            if (data?.curSubpanel) setSubPanel(data.curSubpanel);
        }
        
        EVENT.on('leftBarChange', handler);
        return () => EVENT.off('leftBarChange', handler);
    }, []);
   

    // Обработка навигации по разделам
    const changeNavigation =(item: {id: string}) => {
        if (item.id === 'component') setCurrentToolPanel('component');
        else if (item.id === 'project') setCurrentToolPanel('project');
        else if (item.id === 'styles') setCurrentToolPanel('styles');
        else if (item.id === 'atoms') setCurrentToolPanel('atoms');
        else if (item.id === 'save') useDump();
        else if (item.id === 'slot') setCurrentToolPanel('slot');
        else if (item.id === 'export') handleExportGrid();
    }
    const useComponentUpdateFromEditorForm = (newDataProps) => {
        const selectComponent = select.content.get();

        if (selectComponent) updateComponentProps({ 
            component: selectComponent, 
            data: newDataProps 
        });
    }
    const useComponentSlotUpdateFromEditorForm = (newDataProps) => {
        const selectSlot = select.slot.get();

        if (selectSlot) EVENT.emit(`slotUpdate.${selectSlot.parent['data-id']}`, {
            data: newDataProps,
            index: selectSlot.index
        });
    }

    const panelRenderers = React.useMemo(()=> ({
        project: () => ({
            start: ( <RenderProjectTopPanel /> ),
            children: ( <RenderListProject currentCat={'all'}/> ) 
        }),
        component: () => useElements(currentTool, setCurrentTool),
        styles: () => useStylesEditor(select.content, useComponentUpdateFromEditorForm, curSubpanel, setSubPanel),
        atoms: () => useAtoms(currentAtom, setCurrentAtom, desserealize),
        slot: ()=> useSlot(select.slot, curSlotPanel, setCurSlotPanel, useComponentSlotUpdateFromEditorForm)
    }), [force, select, currentToolPanel, currentTool, curSubpanel]);
    const { start, children } = panelRenderers[currentToolPanel]();
    

    return (
        <LeftSideBarAndTool
            selected={currentToolPanel}
            sx={{ height: '100%' }}
            style={{
                overflow: currentToolPanel === 'component' ? 'hidden' : 'auto',
                overflowY: currentToolPanel === 'component' ? 'hidden' : 'auto' 
            }}
            schemaNavBar={{ 
                items: menuItems, 
                end: endItems 
            }}
            width={260}
            onChangeNavigation={changeNavigation}
            start={[]}
            center={start}
            end={
                <Inspector
                    data={globalThis?.sharedContext?.get()}
                    onClose={console.log}
                />
            }
        >
            <Box sx={{ mt: 1, mx: 1 }}>
                { children }
            </Box>
        </LeftSideBarAndTool>
    );
}



/**
 * useSafeAsyncEffect(async (isMounted) => {
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
 */