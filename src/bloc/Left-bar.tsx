import React from "react";
import { Button, useTheme, Box, Popover, Typography, Divider } from "@mui/material";
import { BorderStyle, ColorLens, FormatColorText, More } from '@mui/icons-material';
import {
    Settings, AccountTree, Logout, Palette, Extension, Save, Functions,
    FolderSpecial, Edit, Add
} from "@mui/icons-material";
import context, { cellsContent, infoState } from './context';
import { useHookstate } from "@hookstate/core";
import { TooglerInput } from '../components/input/input.any';
import LeftSideBarAndTool from '../components/nav-bars/tool-left'
import { ContentData } from './Top-bar';
import { updateComponentProps } from './utils/updateComponentProps';
import Forms from './Forms';
import Inspector from './Inspector';
import { componentGroups } from './config/category';
import { createBlockToFile } from "./utils/export";
import { createComponentFromRegistry } from './utils/createComponentRegistry';
import { componentMap, componentRegistry } from "./modules/utils/registry";
import { TextInput } from "src/index";
import { fetchFolders, getUniqueBlockName } from "./utils/editor";
import { LeftToolPanelProps } from './type';


const RenderListProject = ({ currentCat }) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [blockName, setBlockName] = React.useState('');
    const meta = useHookstate(context.meta);
    const project = useHookstate(infoState.project);
    
    const getAllBlockFromScope = () => {
        const currentScope = project?.get({ noproxy: true })?.[meta.scope.get()];
        return currentScope;
    }
    const handleCreateNewBlock = () => {
        const scope = getAllBlockFromScope();
        const existingNames = scope.map(el => el.name);
        const uniqueName = getUniqueBlockName(blockName.trim(), existingNames);

        createBlockToFile(meta.scope.get(), uniqueName)
            .then(()=> {
                 fetchFolders().then((data)=> {
                    context.meta.name.set(uniqueName);
                    infoState.project.set(data);
                });
                setBlockName('');
                setAnchorEl(null);
            })
            .catch(console.error)
    }
    const renderPopUp =()=> (
        <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
        >
            <Box sx={{ p: 1, display: 'flex', gap: 1 }}>
                <TextInput
                    size="small"
                    placeholder="Имя блока"
                    value={blockName}
                    onChange={setBlockName}
                />
                <Button
                    variant="contained"
                    size="small"
                    disabled={!blockName.trim()}
                    onClick={handleCreateNewBlock}
                >
                    OK
                </Button>
            </Box>
        </Popover>
    );

    return (
        <>
            {currentCat === 'all' &&
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Button 
                        size="small" 
                        sx={{mx:2, mb:2, mt:1}} 
                        variant="outlined" 
                        color="success"
                        onClick={(e) => setAnchorEl(e.currentTarget)}
                    >
                        <Add /> add block
                    </Button>
                    { getAllBlockFromScope()?.map((blockData, index) =>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                my: 0.7,
                                borderBottom: '1px dotted #83818163',
                                opacity: meta.name.get() === blockData.name ? 1 : 0.6,
                            }}
                            key={index}
                        >
                            <Typography variant='subtitle1' style={{fontSize:'14px'}}>
                                { blockData.name }
                            </Typography>
                            <button
                                style={{
                                    cursor: 'pointer',
                                    color: meta.name.get() === blockData.name ? '#C9C9C9' : '#c9c5c5c7',
                                    background: 'transparent',
                                    marginLeft: 'auto',
                                    borderRadius: '4px',
                                    border: meta.name.get() === blockData.name ? `1px solid #C9C9C9` : 'none',
                                }}
                                onClick={() => context.meta.name.set(blockData.name)}
                            >
                                <Edit />
                            </button>
                        </Box>
                    )}
                    { renderPopUp() }
                </Box>
            }
        </>
    );
}


const useProject = (currentCat, setCurrentCat) => {
    const categories = [
        { id: 'all', icon: FolderSpecial }
    ];

    return {
        start: (
            <TooglerInput
                value={currentCat}
                onChange={setCurrentCat}
                sx={{ px: 0.2 }}
                items={categories.map((cat) => {
                    const Icon = cat.icon ?? Settings;
                    return {
                        id: cat.id,
                        label: <Icon sx={{ fontSize: 18 }} />
                    };
                })}
            />
        ),
        children: (<RenderListProject currentCat={currentCat}/>)
    };
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
const useFunctions = (elem, onChange, curSub) => {
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
    const [currentContentData, setCurrent] = React.useState<ContentData>();
    const [project, setProject] = React.useState<'cur' | 'all'>('all');
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

    // слушаем эмитер
    React.useEffect(() => {
        const handler = (data) => {
            if (data.curentComponent) setCurrent(data.curentComponent);
            if (data.currentToolPanel) setCurrentToolPanel(data.currentToolPanel);
            if (data.curSubpanel) setSubPanel(data.curSubpanel);
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
    const changeFunc = () => {

    }

    const panelRenderers = {
        project: () => useProject(project, setProject),
        items: () => useElements(currentTool, setCurrentTool, addComponentToLayout),
        component: () => useComponent(select.content, changeEditor, curSubpanel, setSubPanel),
        func: () => useFunctions(select.content, changeFunc, curSubpanel),
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
                {children}
            </Box>
        </LeftSideBarAndTool>
    );
}