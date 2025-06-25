import React from "react";
import { Button, IconButton, Box, Select, MenuItem, useTheme, Theme } from "@mui/material";
import {
    Settings, AccountTree, Logout, Extension, Save, Functions, List
} from "@mui/icons-material";
import { editorContext, settingsSlice } from "../context";
import { motion } from 'framer-motion';
import { TooglerInput } from '../../components/input/input.any';
import LeftSideBarAndTool from '../../components/nav-bars/tool-left';
import { categoryActions } from '../config/category';
import { usePopUpName, useSafeAsyncEffect } from '../helpers/usePopUp';
import { LeftToolPanelProps, ProxyComponentName, Component } from '../type';





export default function ({  }) {
    const [currentToolPanel, setCurrentToolPanel] = React.useState<'list'>('list');
    const [currentToolBase, setCurrentToolBase] = React.useState<keyof typeof categoryActions>('all');
    
    const menuItems = [
        { id: 'list', label: '', icon: <List />, style: {paddingTop:2} },
        { divider: true },
    ];
    const endItems = [
        { id: 'save', label: 'Сохранить', icon: <Save /> },
    ];

    const handleSave =()=> {

    }
    const panelRenderers = {
        list: () => ({
            start: ( 
                <TooglerInput
                    value={currentToolBase}
                    onChange={setCurrentToolBase}
                    sx={{ px: 0.2 }}
                    items={Object.entries(categoryActions).map(([id, group]) => {
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
                </>
            ) 
        }),
    }
    const { start, children } = panelRenderers[currentToolPanel]
        ? panelRenderers[currentToolPanel]()
        : { start: null, children: null };

    

    return (
        <LeftSideBarAndTool
            selected={currentToolPanel}
            sx={{ height: '100%' }}
            schemaNavBar={{ 
                items: menuItems, 
                end: endItems 
            }}
            width={260}
            onChangeNavigation={(item)=> {
                if(item.id !== 'save') setCurrentToolPanel(item.id);
                else handleSave();
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