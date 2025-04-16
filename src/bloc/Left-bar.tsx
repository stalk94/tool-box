import React from "react";
import { Button, useTheme, Box, IconButton } from "@mui/material";
import { BorderStyle, ColorLens, FormatColorText, More } from '@mui/icons-material';
import { Component, LayoutCustom } from './type';
import { Settings, Menu, Logout, Palette, Extension, Save, Functions } from "@mui/icons-material";
import context, { cellsContent, infoState } from './context';
import { useHookstate } from "@hookstate/core";
import { TooglerInput } from '../components/input/input.any';
import LeftSideBarAndTool from '../components/nav-bars/tool-left'
import { ContentData } from './Top-bar';
import { updateComponentProps } from './utils/updateComponentProps';
import Forms from './Forms';
import Inspector from './Inspector';

import { componentGroups } from './config/category';
import { createComponentFromRegistry } from './utils/createComponentRegistry';
import { componentMap, componentRegistry } from "./modules/utils/registry";
import { Divider } from "primereact/divider";


type Props = {
    addComponentToLayout: (elem: React.ReactNode)=> void
    useDump: ()=> void
    useEditProps: (component: Component, data: Record<string, any>)=> void
    externalPanelTrigger?: (fn: (panel: 'items' | 'component') => void) => void;
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
                { itemsInCurrentCategory.map(([type, config]) => {
                    const Icon = componentRegistry[type].icon ?? Settings;

                    return (
                        <Box key={type} sx={{ display: 'flex', flexDirection: 'row', mb: 1 }}>
                            <Button 
                                variant="outlined"
                                style={{color:'#fcfcfc', borderColor:'#fcfcfc61',boxShadow: '0px 2px 1px rgba(0, 0, 0, 0.4)'}}
                                startIcon={<Icon sx={{ color: 'gray', fontSize: 18 }} />}
                                sx={{ width: '100%', opacity: 0.6 }}
                                onClick={() =>
                                    addComponentToLayout(createComponentFromRegistry(type))
                                }
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
                sx={{px:0.2}}
                items={[
                    { label: <More sx={{fontSize:18}}/>, id: 'props' },
                    { label: <ColorLens sx={{fontSize:18}} />, id: 'base' },
                    { label: <BorderStyle sx={{fontSize:18}} />, id: 'flex' },
                    { label: <FormatColorText sx={{fontSize:20}} />, id: 'text' },
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
const useFunctions =(elem, onChange, curSub)=> {
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
export default function ({ addComponentToLayout, useDump, externalPanelTrigger }: Props) {
    const select = useHookstate(infoState.select);
    const [currentContentData, setCurrent] = React.useState<ContentData>();
    const [curSubpanel, setSubPanel] = React.useState<'props'|'base'|'flex'|'text'>('props');
    const [currentToolPanel, setCurrentToolPanel] = React.useState<'items'|'component'|'func'>('items');
    const [currentTool, setCurrentTool] = React.useState<keyof typeof componentGroups>('interactive');

    const menuItems = [
        { id: 'items', label: 'Библиотека', icon: <Extension />},
        { divider: true },
        { id: 'component', label: 'Настройки', icon: <Palette /> },
        { divider: true },
        { id: 'func', label: 'Функции', icon: <Functions /> },
    ];
    const endItems = [
        { id: 'save', label: 'Сохранить', icon: <Save /> },
        { id: 'exit', label: 'Выход', icon: <Logout /> }
    ];

    // Обновление текущего выделенного компонента
    React.useEffect(() => {
        const content = select.content.get({ noproxy: true });
        if (content?.props?.['data-id']) {
            setCurrent({
                id: content.props['data-id'],
                type: content.props['data-type']
            });
        } else {
            console.warn('🚨 У контента отсутствует data-id');
        }
    }, [select.content]);

    // Проброс управляющей функции
    React.useEffect(() => {
        if (externalPanelTrigger) {
            externalPanelTrigger(setCurrentToolPanel);
        }
    }, [externalPanelTrigger]);

    // Обработка навигации по разделам
    const changeNavigation = (item) => {
        if (item.id === 'items') setCurrentToolPanel('items');
        else if (item.id === 'component') setCurrentToolPanel('component');
        else if (item.id === 'func') setCurrentToolPanel('func');
        else if (item.id === 'save') useDump();
    }
    // ANCHOR - updateComponentProps
    const changeEditor = (newDataProps) => {
        const component = select.content.get({ noproxy: true });
        if (component) updateComponentProps({ component, data: newDataProps });
    }
    const changeFunc =()=> {

    }
    
    const panelRenderers = {
        items: () => useElements(currentTool, setCurrentTool, addComponentToLayout),
        component: () => useComponent(select.content, changeEditor, curSubpanel, setSubPanel),
        func: () => useFunctions(select.content, changeFunc, curSubpanel),
    }
    const { start, children } = panelRenderers[currentToolPanel] 
        ? panelRenderers[currentToolPanel]() 
        : { start: null, children: null };

    
    return (
        <LeftSideBarAndTool
            sx={{ height: '100%' }}
            schemaNavBar={{ items: menuItems, end: endItems }}
            width={260}
            onChangeNavigation={changeNavigation}
            start={start}
            end={
                <Inspector
                    data={
                        globalThis.sharedContext.get()
                    }
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