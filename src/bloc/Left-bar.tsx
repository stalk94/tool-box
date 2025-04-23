import React from "react";
import { Button, IconButton, Box, Popover, Typography, Divider, Select, MenuItem } from "@mui/material";
import { BorderStyle, ColorLens, FormatColorText, More } from '@mui/icons-material';
import {
    Settings, AccountTree, Logout, Palette, Extension, Save, Functions,
    RadioButtonUnchecked, RadioButtonChecked, Add
} from "@mui/icons-material";
import context, { cellsContent, infoState } from './context';
import { useHookstate } from "@hookstate/core";
import { TooglerInput } from '../components/input/input.any';
import LeftSideBarAndTool from '../components/nav-bars/tool-left'
import { updateComponentProps } from './utils/updateComponentProps';
import Forms from './Forms';
import Inspector from './Inspector';
import { componentGroups } from './config/category';
import { createBlockToFile, fetchFolders } from "./utils/export";
import { createComponentFromRegistry } from './utils/createComponentRegistry';
import { componentMap, componentRegistry } from "./modules/utils/registry";
import { usePopUpName } from './utils/usePopUp';
import { getUniqueBlockName } from "./utils/editor";
import { LeftToolPanelProps } from './type';



const RenderListProject = ({ currentCat }) => {
    const size = useHookstate(context.size);
    const meta = useHookstate(context.meta);
    const project = useHookstate(infoState.project);
    const { popover, handleOpen } = usePopUpName((name)=> {
        const scope = getAllBlockFromScope();
        const existingNames = scope.map(el => el.name);
        const uniqueName = getUniqueBlockName(name.trim(), existingNames);

        createBlockToFile(meta.scope.get(), uniqueName)
            .then(()=> {
                fetchFolders().then((data)=> {
                    context.meta.name.set(uniqueName);
                    infoState.project.set(data);
                });
            })
            .catch(console.error)
    });
    

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
        const currentScope = project?.get({ noproxy: true })?.[meta.scope.get()];
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
                        <Add /> add block
                    </Button>
                    { getAllBlockFromScope()?.map((blockData, index) =>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                my: 0.7,
                                cursor:'pointer',
                                borderBottom: `1px dotted ${meta.name.get() === blockData.name ? '#ffffff61' : '#83818163'}`,
                                opacity: meta.name.get() === blockData.name ? 1 : 0.6,
                                '&:hover': {
                                    backgroundColor: '#e0e0e022',
                                }
                            }}
                            onClick={() => context.meta.name.set(blockData.name)}
                            key={index}
                        >
                            <Typography 
                                variant='inherit' 
                                style={{fontSize:'15px', color:'white'}}
                            >
                                <span style={{color: getColor(blockData.name), marginRight:'5px'}}>
                                    {`[${ getKeyNameSize(blockData.name) }]`}
                                </span>
                               
                                <span style={{marginLeft:'5px', color:'white'}}>{ blockData.name }</span>
                            </Typography>
                            <button
                                style={{
                                    cursor: 'pointer',
                                    color: meta.name.get() === blockData.name ? '#C9C9C9' : '#c9c5c5c7',
                                    background: 'transparent',
                                    marginLeft: 'auto',
                                    borderRadius: '4px',
                                    border: 'none',
                                }}
                            >
                                { meta.name.get() === blockData.name
                                    ? <RadioButtonChecked sx={{ fontSize: '16px'}} />
                                    : <RadioButtonUnchecked sx={{ fontSize: '16px'}} />
                                }
                            </button>
                        </Box>
                    )}
                    { popover }
                </Box>
            }
        </>
    );
}
const RenderProjectTopPanel = () => {
    const project = useHookstate(infoState.project);
    const { popover, handleOpen } = usePopUpName((name)=> {
        const existingNames = Object.keys(project.get({ noproxy: true })) ?? [];
        const uniqueName = getUniqueBlockName(name.trim(), existingNames);

        if(uniqueName.length > 3) createBlockToFile(uniqueName, 'root')
            .then(()=> {
                 fetchFolders().then((data)=> {
                    context.meta.scope.set(uniqueName);
                    context.meta.name.set('root');
                    infoState.project.set(data);
                });
            })
            .catch(console.error)
    });


    const handleChangeScope = (newScope: string) => {
        const currentProject = project?.get({ noproxy: true })?.[newScope];
        const existingNamesBlocks = currentProject.map(el => el.name);

        context.meta.scope.set(newScope);
        if(existingNamesBlocks[0]) context.meta.name.set(existingNamesBlocks[0]);
    }


    return(
        <Box sx={{ display: 'flex' }}>
            <Select
                size="small"
                defaultValue={context.meta.scope.get()}
                onChange={(e) => handleChangeScope(e.target.value)}
                displayEmpty
                sx={{ fontSize: 14, height: 36, color: '#ccc', background: '#2a2a2a84', ml: 1, mt: 0.3 }}
            >
                {Object.keys(project.get({ noproxy: true }))?.map((scope) => (
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


const useElements = (currentTool, setCurrentTool, addComponentToLayout) => {
    const categories = Object.entries(componentGroups);
    const itemsInCurrentCategory = Object.entries(componentMap).filter(([type]) => {
        const meta = componentRegistry[type] as any; // или прокинуть icon/category отдельно

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
                {itemsInCurrentCategory.map(([type, config]) => {
                    const Icon = componentRegistry[type].icon ?? Settings;

                    return (
                        <Box key={type} sx={{ display: 'flex', flexDirection: 'row', mb: 1 }}>
                            <Button
                                variant="outlined"
                                style={{ color: '#fcfcfc', borderColor: '#fcfcfc61', boxShadow: '0px 2px 1px rgba(0, 0, 0, 0.4)' }}
                                startIcon={<Icon sx={{ color: 'gray', fontSize: 18 }} />}
                                sx={{ width: '100%', opacity: 0.6 }}
                                onClick={() => {
                                    //infoState.select.panel.lastAddedType.set(type);
                                    addComponentToLayout(createComponentFromRegistry(type))
                                }}
                            >
                                {type}
                            </Button>
                        </Box>
                    );
                })}
            </>
        )
    };
}
const useComponent = (elem, onChange, curSub, setSub) => {
    
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
const useFunctions = () => {
    return {
        start: (null),
        children: (
            <>
                functions
            </>
        )
    };
}


// левая панель редактора
export default function ({ addComponentToLayout, useDump }: LeftToolPanelProps) {
    const select = useHookstate(infoState.select);
    const [curSubpanel, setSubPanel] = React.useState<'props' | 'styles' | 'flex' | 'text'>('props');
    const [currentToolPanel, setCurrentToolPanel] = React.useState<'project' | 'items' | 'component' | 'func'>('project');
    const [currentTool, setCurrentTool] = React.useState<keyof typeof componentGroups>('interactive');

    const menuItems = [
        { id: 'project', label: 'управление', icon: <AccountTree /> },
        { divider: <Divider sx={{borderColor: 'rgba(128, 128, 129, 0.266)',my:1.2}}/> },
        { id: 'items', label: 'Библиотека', icon: <Extension /> },
        { divider: true },
        { id: 'component', label: 'Настройки', icon: <Palette /> },
        { divider: true },
        { id: 'func', label: 'Функции', icon: <Functions /> },
    ];
    const endItems = [
        { id: 'save', label: 'Сохранить', icon: <Save /> },
        { id: 'exit', label: 'Выход', icon: <Logout /> }
    ];


    React.useEffect(() => {
        const handler = (data) => {
            if (data.curentComponent) {
                console.log('Tool bar left select content set')
                requestIdleCallback(()=> select.content.set(data.curentComponent));
            }
            if (data?.currentToolPanel) setCurrentToolPanel(data.currentToolPanel);
            if (data?.curSubpanel) setSubPanel(data.curSubpanel);
        }

        EVENT.on('leftBarChange', handler);
        return () => EVENT.off('leftBarChange', handler);
    }, []);

    // Обработка навигации по разделам
    const changeNavigation = (item) => {
        if (item.id === 'items') setCurrentToolPanel('items');
        else if (item.id === 'project') setCurrentToolPanel('project');
        else if (item.id === 'component') setCurrentToolPanel('component');
        else if (item.id === 'func') setCurrentToolPanel('func');
        else if (item.id === 'save') useDump();
    }
    // ANCHOR - updateComponentProps
    const changeEditor = (newDataProps) => {
        const component = select.content.get({ noproxy: true });
        if (component) updateComponentProps({ component, data: newDataProps });
    }


    const panelRenderers = {
        project: () => ({
            start: ( <RenderProjectTopPanel /> ),
            children: ( <RenderListProject currentCat={'all'}/> ) 
        }),
        items: () => useElements(currentTool, setCurrentTool, addComponentToLayout),
        component: () => useComponent(select.content, changeEditor, curSubpanel, setSubPanel),
        func: () => useFunctions(),
    }
    const { start, children } = panelRenderers[currentToolPanel]
        ? panelRenderers[currentToolPanel]()
        : { start: null, children: null };

    

    return (
        <LeftSideBarAndTool
            selected={currentToolPanel}
            sx={{ height: '100%' }}
            schemaNavBar={{ items: menuItems, end: endItems }}
            width={260}
            onChangeNavigation={changeNavigation}
            start={start}
            end={
                <Inspector
                    data={globalThis.sharedContext.get()}
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