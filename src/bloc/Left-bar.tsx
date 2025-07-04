import React from "react";
import { Button, Box, Typography, Divider } from "@mui/material";
import { BorderStyle, CheckBox, ColorLens, FormatColorText, More, Widgets, AccountCircle } from '@mui/icons-material';
import { Settings, AccountTree, Logout, Palette, Extension, Save, Code } from "@mui/icons-material";
import { LuBlocks } from "react-icons/lu";
import { editorContext, infoSlice, cellsSlice } from "./context";
import TooglerInput from 'src/components/input/toogler';
import LeftSideBarAndTool from '../components/nav-bars/tool-left'
import { updateComponentProps } from './helpers/updateComponentProps';
import Forms from './Forms';
import Inspector from './Inspector';
import { componentGroups, settingsBlock, specialComponents, componentBlock } from './config/category';
import { componentMap, componentsRegistry } from "./modules/helpers/registry";
import { LeftToolPanelProps, ProxyComponentName, Component } from './type';
import { useKeyboardListener } from './helpers/hooks';
import BlockRender from './left-bar/blocks';
import BlockSettings from './left-bar/settings-block';
import { DraggableToolItem } from './Dragable';
import { PiCodeBlockFill } from "react-icons/pi";
import { RenderListPages, RenderProjectTopPanel } from './left-bar/pages';
import exportsGrid from "./modules/export/Grid";


///////////////////////////////////////////////////////////////////////////////////
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

                    if(!specialComponents.includes(type)) return (
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
const useBlock = (category='any', setCategory) => {
    const categories = Object.entries(componentBlock);

    return {
        start: (
            <TooglerInput
                value={category}
                onChange={(v)=> setCategory && setCategory(v)}
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
        children: (<BlockRender category={category}/>)
    };
}
const useBlockSettings = (category, setCategory) => {
    const categories = Object.entries(settingsBlock);

    return {
        start: (
            <TooglerInput
                value={category}
                onChange={(v)=> setCategory && setCategory(v)}
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
            <BlockSettings
                category={category}
            />
        )
    };
}

////////////////////////////////////////////////////////////////////////////////////


export default function ({ useDump }: LeftToolPanelProps) {
    const meta = editorContext.meta;
    const select = infoSlice.select;
    const [force, useForce] = React.useReducer((i)=> i+1, 0);
    const [curSlotPanel, setCurSlotPanel] = React.useState<'props' | 'styles' | 'flex' | 'text'>('props');
    const [curSubpanel, setSubPanel] = React.useState<'props' | 'styles' | 'flex' | 'text'>('props');
    const [currentToolPanel, setCurrentToolPanel] = React.useState<'project' | 'block' | 'component' | 'styles' | 'slot'>('project');
    const [currentTool, setCurrentTool] = React.useState<keyof typeof componentGroups>('misc');
    const [currentSettings, setCurrentSettings] = React.useState<keyof typeof settingsBlock>('all');
    const [currentBlock, setCurrentBlock] = React.useState<string>('any');

    
    const menuItems = [
        { id: 'project', label: 'управление', icon: <AccountTree />, style: {paddingTop:2} },
        { divider: <Divider sx={{borderColor: 'rgba(128, 128, 129, 0.266)',my:1.2}}/> },
        { id: 'block', label: '', icon: <LuBlocks size={22} /> },
        { divider: true },
        { id: 'blockSetting', label: '', icon:  <PiCodeBlockFill size={22} /> },
        { divider: true },
        { id: 'component', label: 'Библиотека', icon: <Extension /> },
        { divider: true },
        { id: 'styles', label: 'Настройки', icon: <Palette /> },
        { divider: true },
        //{ id: 'slot', label: 'cell', icon: <TbCell size={24} style={{margin: 3}} /> }
    ];
    const endItems = [
        { id: 'save', label: 'Сохранить', icon: <Save /> },
        { id: 'export', label: 'export', icon: <Code /> },
        { id: 'user', label: 'Выход', icon: <AccountCircle /> }
    ];

    const startNgrock = async() => {
        const res = await window.electronAPI.startNgrock('1roLqOcXYfEopiwzSBJVEJnqktv_3ds7wmtXYFkP3d8CzTc8u');
        
    }
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
        else if (item.id === 'block') setCurrentToolPanel('block');
        else if (item.id === 'project') setCurrentToolPanel('project');
        else if (item.id === 'styles') setCurrentToolPanel('styles');
        else if (item.id === 'blockSetting') setCurrentToolPanel('blockSetting');
        else if (item.id === 'save') useDump();
        else if (item.id === 'slot') setCurrentToolPanel('slot');
        else if (item.id === 'export') handleExportGrid();
        else if (item.id === 'exit') startNgrock();
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
            children: ( <RenderListPages currentCat={'all'}/> ) 
        }),
        block: ()=> useBlock(currentBlock, setCurrentBlock),
        blockSetting: ()=> useBlockSettings(currentSettings, setCurrentSettings),
        component: ()=> useElements(currentTool, setCurrentTool),
        styles: () => useStylesEditor(select.content, useComponentUpdateFromEditorForm, curSubpanel, setSubPanel),
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