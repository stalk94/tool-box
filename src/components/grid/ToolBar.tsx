import React from "react";
import { Button, useTheme, Box, Paper, Typography, Tooltip } from "@mui/material";
import { Delete as DeleteIcon, MoreVert as MoreVertIcon,
     RadioButtonChecked, Assignment, Input, Build 
} from '@mui/icons-material';
import { GridEditorProps, LayoutCustom } from './type';
import { Settings, Menu, Logout, VerifiedUser, Extension, Save } from "@mui/icons-material";
import context, { cellsContent, infoState } from './context';
import { useHookstate } from "@hookstate/core";
import { TooglerInput } from '../input/input.any';
import LeftSideBarAndTool from '../nav-bars/tool-left'



const useElements = (currentTool, setCurrentTool, addItem) => {
    const components = {
        text: (<>Text component</>),
        button: (
            <Button
                variant='outlined'
                sx={{ width: '100%' }}
                onClick={() => {
                    addItem(
                        <Button 
                            variant='outlined' 
                            color='info'
                            data-type='Button'
                        >
                            Button content
                        </Button>
                    );
                }}
            >
                Кнопка
            </Button>
        ),
        area: (<>Area component</>),
        input: (<>Input component</>),
        any: (<>Any component</>)
    }


    return {
        start: (
            <TooglerInput
                value={currentTool}
                onChange={(v) => {
                    setCurrentTool(v);
                }}
                items={[
                    { label: <Assignment sx={{fontSize:18}}/>, id: 'text' },
                    { label: <RadioButtonChecked sx={{fontSize:18}} />, id: 'button' },
                    { label: '⃣', id: 'area' },
                    { label: <Input sx={{fontSize:20}} />, id: 'input' },
                    { label: '🛠️', id: 'any' }
                ]}
            />
        ),
        children: components[currentTool] || null
    };
}
const useComponent = () => {
    return {
        start: (
            <div>

            </div>
        ),
        children: (
            <></>
        )
    };
}


// левая панель редактора
export default function ({ addComponentToLayout, useDump, useEditProps }) {
    const select = useHookstate(infoState.select);
    const [currentToolPanel, setCurrentToolPanel] = React.useState('items');
    const [currentTool, setCurrentTool] = React.useState('button');


    const menuItems = [
        { id: "items", label: "Главная", icon: <Extension /> },
        { id: "component", label: "Главная", icon: <Settings /> },
    ];
    const endItems = [
        { id: "save", label: "Настройки", icon: <Save /> },
        { id: "exit", label: "Выход", icon: <Logout /> }
    ];
    
    
    React.useEffect(()=> {
        const content = select.content.get({ noproxy: true });

        if(content?.props) {
            setCurrentToolPanel('component');
        }
    }, [select.content]);
    

    const changeNavigation = (item) => {
        if (item.id === 'items') setCurrentToolPanel('items');
        else if (item.id === 'component') setCurrentToolPanel('component');
        else if(item.id === 'save') useDump();
    }
    const renderProps = () => {
        if (currentToolPanel === 'items') {
            return useElements(currentTool, setCurrentTool, addComponentToLayout);
        }
        else if(currentToolPanel === 'component') {
            return useComponent();
        }

        return { start: null, children: null }
    }
    const { start, children } = renderProps();


    return (
        <LeftSideBarAndTool
            sx={{ height: '100%' }}
            schemaNavBar={{
                items: menuItems,
                end: endItems
            }}
            width={240}
            onChangeNavigation={changeNavigation}
            start={ start }
        >
            <Box sx={{ mt: 1, mx: 1 }}>
                { children }
            </Box>
        </LeftSideBarAndTool>
    );
}
