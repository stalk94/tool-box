import React from "react";
import { Button, useTheme, Box, IconButton } from "@mui/material";
import { BorderStyle, ColorLens, FormatColorText, More } from '@mui/icons-material';
import { Component, LayoutCustom } from './type';
import { Settings, Menu, Logout, VerifiedUser, Extension, Save } from "@mui/icons-material";
import context, { cellsContent, infoState } from './context';
import { useHookstate } from "@hookstate/core";
import { TooglerInput } from '../components/input/input.any';
import LeftSideBarAndTool from '../components/nav-bars/tool-left'
import { ContentData } from './Top-bar';
import { updateComponentProps } from './utils/updateComponentProps';
import Forms from './Forms';


import { componentRegistry, componentGroups } from './config/registry-component';
import { createComponentFromRegistry } from './utils/createComponentRegistry';


type Props = {
    addComponentToLayout: (elem: React.ReactNode)=> void
    useDump: ()=> void
    useEditProps: (component: Component, data: Record<string, any>)=> void
    externalPanelTrigger?: (fn: (panel: 'items' | 'component') => void) => void;
}


const useElements = (currentTool, setCurrentTool, addComponentToLayout) => {
    const categories = Object.entries(componentGroups);
    const itemsInCurrentCategory = Object.entries(componentRegistry).filter(
        ([, config]) =>
            config.category === currentTool ||
            (!config.category && currentTool === 'misc')
    );

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
                    const Icon = config.icon ?? Settings;

                    return (
                        <Box key={type} sx={{ display: 'flex', flexDirection: 'row', mb: 1 }}>
                            <IconButton>
                                <Icon sx={{ color: 'gray', fontSize: 18 }} />
                            </IconButton>
                            <Button
                                variant="outlined"
                                color="inherit"
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
                onChange={(v) => {
                    setSub(v);
                }}
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


// левая панель редактора
export default function ({ addComponentToLayout, useDump, externalPanelTrigger }: Props) {
    const select = useHookstate(infoState.select);
    const [currentContentData, setCurrent] = React.useState<ContentData>();
    const [curSubpanel, setSubPanel] = React.useState<'props'|'base'|'flex'|'text'>('props');
    const [currentToolPanel, setCurrentToolPanel] = React.useState<'items'|'component'>('items');
    const [currentTool, setCurrentTool] = React.useState<keyof typeof componentGroups>('block');

    const menuItems = [
        { id: 'items', label: 'Библиотека', icon: <Extension /> },
        { id: 'component', label: 'Настройки', icon: <Settings /> },
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
        else if (item.id === 'save') useDump();
    }
    // ANCHOR - updateComponentProps
    const changeEditor = (newDataProps) => {
        const component = select.content.get({ noproxy: true });
        if (component) updateComponentProps({ component, data: newDataProps });
    }
    
    const { start, children } = currentToolPanel === 'items'
        ? useElements(currentTool, setCurrentTool, addComponentToLayout)
        : useComponent(select.content, changeEditor, curSubpanel, setSubPanel);


    
    return (
        <LeftSideBarAndTool
            sx={{ height: '100%' }}
            schemaNavBar={{ items: menuItems, end: endItems }}
            width={260}
            onChangeNavigation={changeNavigation}
            start={start}
        >
            <Box sx={{ mt: 1, mx: 1 }}>
                { children }
            </Box>
        </LeftSideBarAndTool>
    );
}