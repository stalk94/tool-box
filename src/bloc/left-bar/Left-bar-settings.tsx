import React from "react";
import { Button, IconButton, Box, Select, MenuItem, useTheme, Theme } from "@mui/material";
import type { Palette } from '@mui/material';
import {
    Settings, Adjust, Logout, Extension, Save, Functions, Palette as Pallet,
    BorderStyle, CheckBox, ColorLens, FormatColorText, More, Widgets
} from "@mui/icons-material";
import { editorContext, settingsSlice, infoSlice } from "../context";
import { motion } from 'framer-motion';
import TooglerInput from 'src/components/input/toogler';
import LeftSideBarAndTool from '../../components/nav-bars/tool-left';
import { Form, Schema, AccordionForm, AccordionScnema, Accordion } from '../../index';
import { componentThemeSettings, componentBaseSettings } from '../config/category';
import { colorsList, actionsColors, actionsOpacity } from '../config/theme';
import { usePopUpName, useSafeAsyncEffect } from '../helpers/usePopUp';
import { useKeyboardListener } from '../helpers/hooks';
import { db } from "../helpers/export";
import cloneDeep from 'lodash/cloneDeep';
import { taskadeTheme, lightTheme, darkTheme } from 'src/theme';
const listTheme = {
    taskade: taskadeTheme,
    light: lightTheme,
    dark: darkTheme
}



const BasePanel =()=> {
    const [acordeon, setAcordeon] = React.useState<Schema[]>([]);

    const getRender =()=> {
        const result = [];
        const metaProject = editorContext.meta.project.get();
        const project = infoSlice.projects[metaProject].get();

        Object.keys(project).map((scope)=> {
            if (scope !== 'system') result.push({
                title: scope,
                content: (
                    Object.keys(project[scope]).map((name, i)=> 
                        <div key={i}
                            style={{ display: 'flex', flexDirection: 'row', width:'100%' }}
                        >
                            <button
                                className={`
                                    rounded-md px-2 text-gray-200 
                                    hover:bg-stone-600 hover:text-zinc-400 
                                    transition-colors duration-150 cursor-pointer
                                `}
                            >
                                <Adjust sx={{ fontSize: '16px' }} />
                            </button>
                            { name }
                        </div>
                    )
                )
            });
        });
        setAcordeon(result);
    }
    React.useEffect(()=> {
        getRender();
    }, []);
    

    return(
        <>
            <Accordion
                activeIndexs={[0]}
                items={acordeon}
            />
        </>
    );
}
const ThemePanel =()=> {
    const currentGroop = settingsSlice.theme.currentGroop.use();
    const [data, setData] = React.useState<Record<string, string>>({});     // default
    const [schema, setSchema] = React.useState<Schema[]>([]);
    const [acordeon, setAcordeon] = React.useState<Schema[]>([]);

    const toolAutoGenerationColor = (color: 'string') => {
        return theme.palette.augmentColor({
            color: {
                main: color
            },
        });
    }
    const getToolPalette =()=> {
        const exclude = ['mode', 'contrastThreshold', 'getContrastText', 'augmentColor', 'tonalOffset', 'navigation'];
        const keys = [...Object.keys(settingsSlice.theme.pallete.get(true)), 'colors'];
        return keys.filter((key)=> ![...exclude, ...colorsList].includes(key));
    }
    const createSchemeColors = (data: Record<string, string>, type?:'slider'): Schema[] => {
        if(!type) return Object.entries(data).map(([key, value])=> {
            return ({
                type: 'color',
                value: value,
                label: key,
                id: key,
                labelSx: { fontSize: '12px' }
            });
        });
        else return Object.entries(data).map(([key, value])=> {
            return ({
                type: 'slider',
                value: value,
                label: key,
                id: key,
                min: 0, 
                max: 1, 
                step: 0.01,
                labelSx: { fontSize: '12px' }
            });
        });
    }
    const createSchemeNested = (data: Record<string, Record<string, string>>): AccordionScnema[] => {
        return Object.entries(data).map(([key, value])=> {
            return ({
                id: key,
                label: key,
                scheme: createSchemeColors(value)
            });
        });
    }
    const handleEdit =(key:string, value:string, nested?:string)=> {
        const pallete = settingsSlice.theme.pallete.get(true);
        const copy = cloneDeep(pallete);

        if(!nested) {
            if(key === 'divider') copy[currentGroop] = value;
            else copy[currentGroop][key] = value;
        }
        else {
            if(nested === 'actionsColor' || nested === 'actionsOpacity'){
                copy.action[key] = value;
            }
            else copy[nested][key] = value;
        }

        EVENT.emit('themeEdit', copy);
    }
    React.useEffect(()=> {
        const pallete = settingsSlice.theme.pallete.get(true);
        const cur = pallete[currentGroop];

        if(cur && currentGroop !== 'colors' && currentGroop !== 'action') {
            if(typeof cur === 'object') {
                setAcordeon([]);
                setData(cur);
                setSchema(createSchemeColors(cur));
            }
            else if(typeof cur === 'string') {
                setAcordeon([]);
                setSchema([{
                    type: 'color',
                    value: cur,
                    label: currentGroop,
                    id: currentGroop,
                    labelSx: { fontSize: '12px' }
                }]);
            }
        }
        else if(currentGroop === 'action') {
            const actionColor = {};
            const actionNumber = {};

            actionsOpacity.map((key)=> {
                actionNumber[key] = pallete.action[key];
            });
            actionsColors.map((key)=> {
                actionColor[key] = pallete.action[key];
            });
            

            setSchema([]);
            setAcordeon([{
                id: 'actionsColor',
                label: 'actions colors',
                scheme: createSchemeColors(actionColor)
            },{
                id: 'actionsOpacity',
                label: 'actions opacity',
                scheme: createSchemeColors(actionNumber, 'slider')
            }]);
        }
        else if(currentGroop === 'colors') {
            const nested = {};
            colorsList.map((key)=> {
                nested[key] = pallete[key];
            });
            setSchema([]);
            setAcordeon(createSchemeNested(nested));
        }
    }, [currentGroop]);


    return(
        <motion.div
            className="FORM"
            style={{ display: 'flex', flexDirection: 'column' }}
            initial={{ opacity: 0 }}     
            animate={{ opacity: 1 }} 
            transition={{ duration: 1 }}
        >
            <Select
                size="small"
                value={currentGroop}
                onChange={(e)=> settingsSlice.theme.currentGroop.set(e.target.value)}
                displayEmpty
                sx={{ fontSize: 14, height: 36, color: '#ccc', background: '#2a2a2a84', ml: 1, mt: 0.3, mb:2 }}
            >
                {getToolPalette()?.map((key) => (
                    <MenuItem key={key} value={key} >
                        { key }
                    </MenuItem>
                ))}
            </Select>
            { schema[0] &&
                <Form
                    labelPosition="column"
                    scheme={schema}
                    onSpecificChange={(old, news)=> {
                        Object.entries(news).forEach(([key, value]) => handleEdit(key, value))
                    }}
                />
            }
            { acordeon[0] &&
                <AccordionForm
                    activeIndex={[0]}
                    key={`accordion-1`}
                    scheme={acordeon}
                    headerStyle={{
                        fontSize: '12px',
                        color: 'orange',
                        paddingLeft: '14px',
                    }}
                    labelPosition="column"
                    onSpecificChange={(old, news, keyProps: string) => {
                        Object.entries(news).forEach(([key, value]) => handleEdit(key, value, keyProps))
                    }}
                />
            }
        </motion.div>
    );
}


export default function ({ mod, setMod }) {
    const baseCtx = settingsSlice.base.use();
    const ctxTheme = settingsSlice.theme.use();
    
    
    const menuItems = [
        { id: 'base', label: '', icon: <Settings />, style: {paddingTop:2} },
        { divider: true },
        { id: 'theme', label: '', icon: <Pallet/> },
        { divider: true },
    ];
    const endItems = [
        { id: 'save', label: 'Сохранить', icon: <Save /> },
    ];
    useKeyboardListener((key)=> {
        
    });
    

    const panelRenderers = {
        base: () => ({
            start: ( 
                <></>
            ),
            children: ( 
                <BasePanel/>
            ) 
        }),
        theme: () => ({
            start: ( 
                <Box sx={{ display: 'flex' }}>
                    <Select
                        size="small"
                        value={ctxTheme.currentTheme}
                        onChange={(e)=> settingsSlice.theme.currentTheme.set(e.target.value)}
                        displayEmpty
                        sx={{ fontSize: 14, height: 36, color: '#ccc', background: '#2a2a2a84', ml: 1, mt: 0.3 }}
                    >
                        {Object.keys(listTheme)?.map((key) => (
                            <MenuItem key={key} value={key} >
                                { key }
                            </MenuItem>
                        ))}
                    </Select>
                </Box>
            ),
            children: ( 
                <ThemePanel />
            )
        })
    }
    const { start, children } = panelRenderers[mod]
        ? panelRenderers[mod]()
        : { start: null, children: null };

    

    return (
        <LeftSideBarAndTool
            selected={mod}
            sx={{ height: '100%' }}
            schemaNavBar={{ 
                items: menuItems, 
                end: endItems 
            }}
            width={260}
            onChangeNavigation={(item)=> {
                if(item.id !== 'save') setMod(item.id);
                else EVENT.emit('saveColor', {});
            }}
            start={[]}
            center={start}
            end={<></>}
        >
            <Box sx={{ mt: 1, mx: 1 }}>
                { children }
            </Box>
        </LeftSideBarAndTool>
    );
}