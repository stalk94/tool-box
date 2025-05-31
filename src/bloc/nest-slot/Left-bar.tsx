import React from "react";
import { Button, IconButton, Box, Popover, Typography, Divider, Select, MenuItem } from "@mui/material";
import { BorderStyle, ColorLens, FormatColorText, More, Widgets } from '@mui/icons-material';
import {
    Settings, AccountTree, Logout, Palette, Extension, Save, Functions,
    RadioButtonUnchecked, RadioButtonChecked, Add, Code
} from "@mui/icons-material";
import { FaReact } from 'react-icons/fa';
import { editorSlice, infoSlice, renderSlice, cellsSlice } from "./context";
import { TooglerInput } from '../../components/input/input.any';
import LeftSideBarAndTool from '../../components/nav-bars/tool-left'
import { updateComponentProps } from './shim';
import Forms from '../Forms';
import Inspector from '../Inspector';
import { componentGroups, componentAtom } from '../config/category';
import { ComponentSerrialize, ProxyComponentName } from '../type';
import { useKeyboardListener } from '../helpers/hooks';
import { db } from "../helpers/export";
import { DraggableToolItem } from './Dragable';
import { componentsRegistry } from "../modules/helpers/registry";
import { desserealize } from '../helpers/sanitize';


function AtomsRenderer({ category, setCategory, desserealize }) {
    const [blankComponents, setBlankComponents] = React.useState<JSX.Element[]>([]);

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
const useElements = (currentTool, setCurrentTool, componentMap) => {
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


// левая панель редактора
export default function (
    { onChange, componentMap }: 
    {
        componentMap: Record<ProxyComponentName, boolean>
        onChange: (data: any)=> void 
    }
) {
    const select = infoSlice.select;
    const [curSubpanel, setSubPanel] = React.useState<'props' | 'styles' | 'flex' | 'text'>('props');
    const [currentToolPanel, setCurrentToolPanel] = React.useState<'component' | 'atoms' | 'styles'>('component');
    const [currentTool, setCurrentTool] = React.useState<keyof typeof componentGroups>('block');
    const [currentAtom, setCurrentAtom] = React.useState<string>('blank');
    
   
    const menuItems = [
        { id: 'component', label: 'Библиотека', icon: <Extension /> },
        { divider: true },
        { id: 'atoms', label: 'Атомы', icon: <FaReact size={24}/> },
        { divider: true },
        { id: 'styles', label: 'Настройки', icon: <Palette /> },
        { divider: true },
    ];
    const endItems = [];

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
            if (data?.currentToolPanel) setCurrentToolPanel(data.currentToolPanel);
            if (data?.curSubpanel) setSubPanel(data.curSubpanel);
        }

        EVENT.on('leftBarChange', handler);
        return () => EVENT.off('leftBarChange', handler);
    }, []);
   
    
    // Обработка навигации по разделам
    const changeNavigation =(item) => {
        if (item.id === 'component') setCurrentToolPanel('component');
        else if (item.id === 'styles') setCurrentToolPanel('styles');
        else if (item.id === 'atoms') setCurrentToolPanel('atoms');
        else if (item.id === 'save') {
            onChange({
                content: cellsSlice.get(),		// список компонентов в ячейках
                size: {
                    width: editorSlice.size.width.get(),
                    height: editorSlice.size.height.get()
                }
            });
        };
    };
    const useComponentUpdateFromEditorForm = (newDataProps) => {
        const selectComponent = select.content.get();
        if (selectComponent) updateComponentProps({ 
            component: selectComponent, 
            data: newDataProps 
        });
    }
   

    const panelRenderers = {
        project: () => ({
            start: ( <RenderProjectTopPanel /> ),
            children: ( <RenderListProject currentCat={'all'}/> ) 
        }),
        component: () => useElements(currentTool, setCurrentTool, componentMap),
        styles: () => useStylesEditor(select.content, useComponentUpdateFromEditorForm, curSubpanel, setSubPanel),
        atoms: () => useAtoms(currentAtom, setCurrentAtom, desserealize)
    }
    const { start, children } = panelRenderers[currentToolPanel]
        ? panelRenderers[currentToolPanel]()
        : { start: null, children: null };

    

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
                    data={globalThis.sharedContext.get()}  // ??
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
