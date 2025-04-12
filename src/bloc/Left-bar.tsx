import React from "react";
import { Button, useTheme, Box, Paper, Typography, Tooltip, SxProps, IconButton } from "@mui/material";
import { Delete as DeleteIcon, MoreVert as MoreVertIcon,
    RadioButtonChecked, Assignment, Input, BorderStyle, ColorLens, FormatColorText, More
} from '@mui/icons-material';
import { Component, LayoutCustom } from './type';
import { Settings, Menu, Logout, VerifiedUser, Extension, Save } from "@mui/icons-material";
import context, { cellsContent, infoState } from './context';
import { useHookstate } from "@hookstate/core";
import { TooglerInput } from '../components/input/input.any';
import LeftSideBarAndTool from '../components/nav-bars/tool-left'
import { ContentData } from './Top-bar';
import Forms from './config/Forms';

type Props = {
    addComponentToLayout: (elem: React.ReactNode)=> void
    useDump: ()=> void
    useEditProps: (component: Component, data: Record<string, any>)=> void
}


const useElements = (currentTool, setCurrentTool, addItem) => {
    const components = {
        text: (
            <Box sx={{display:'flex',flexDirection:'row',mb:1}}>
                <IconButton>
                    <Settings sx={{color:'gray',fontSize:18}} />
                </IconButton>
                <Button
                    variant='outlined'
                    color='inherit'
                    sx={{ width: '100%', opacity: 0.6 }}
                    onClick={() => addItem(
                        <Typography
                            data-type='Typography'
                        >
                            Текстовая область
                        </Typography>
                    )}
                >
                    Типографика
                </Button>
            </Box>
        ),
        button: ([
            <Box key='Button' sx={{display:'flex',flexDirection:'row',mb:1}}>
                <IconButton>
                    <Settings sx={{color:'gray',fontSize:18}} />
                </IconButton>
                <Button
                    variant='outlined'
                    color='inherit'
                    sx={{ width: '100%', opacity: 0.6 }}
                    onClick={() => addItem(
                        <Button
                            variant='outlined'
                            color='info'
                            sx={{ width: '100%' }}
                            data-type='Button'
                        >
                            Кнопка
                        </Button>
                    )}
                >
                    Кнопка
                </Button>
            </Box>,
            <Box key='IconButton' sx={{display:'flex',flexDirection:'row',mb:1}}>
                <IconButton>
                    <Settings sx={{color:'gray',fontSize:18}} />
                </IconButton>
                <Button
                    variant='outlined'
                    color='inherit'
                    sx={{ width: '100%', opacity: 0.6 }}
                    onClick={() => {
                        addItem(
                            <IconButton 
                                color="warning"
                                data-type='IconButton'
                            >
                                <Settings />
                            </IconButton>
                        )
                    }}
                >
                    <Menu />
                </Button>
            </Box>
        ]),
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
                sx={{px:0.2}}
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
export default function ({ addComponentToLayout, useDump, useEditProps }: Props) {
    const select = useHookstate(infoState.select);
    const [currentContentData, setCurrent] = React.useState<ContentData>();
    const [curSubpanel, setSubPanel] = React.useState<'props'|'base'|'flex'|'text'>('props');
    const [currentToolPanel, setCurrentToolPanel] = React.useState('component');
    const [currentTool, setCurrentTool] = React.useState('button');

    const menuItems = [
        { id: "items", label: "Главная", icon: <Extension /> },
        { id: "component", label: "Главная", icon: <Settings /> },
    ];
    const endItems = [
        { id: "save", label: "Настройки", icon: <Save /> },
        { id: "exit", label: "Выход", icon: <Logout /> }
    ];
    React.useEffect(() => {
        const content = select.content.get({ noproxy: true });

        if (content) {
            if (content.props['data-id']) setCurrent({
                id: content.props['data-id'],
                type: content.props['data-type']
            });
            else console.warn('🚨 У контента отсутствует data-id');
        }
    }, [select.content]);


    const changeNavigation = (item) => {
        if (item.id === 'items') setCurrentToolPanel('items');
        else if (item.id === 'component') setCurrentToolPanel('component');
        else if(item.id === 'save') useDump();
    }
    const changeEditor =(newDataProps)=> {
        console.log('change props: ', newDataProps);
        useEditProps(select.content.get({ noproxy: true }), newDataProps)
    }
    const renderProps = () => {
        if (currentToolPanel === 'items') {
            return useElements(currentTool, setCurrentTool, addComponentToLayout);
        }
        else if(currentToolPanel === 'component') {
            return useComponent(select.content, changeEditor, curSubpanel, setSubPanel);
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
            width={260}
            onChangeNavigation={changeNavigation}
            start={ start }
        >
            <Box sx={{ mt: 1, mx: 1 }}>
                { children }
            </Box>
        </LeftSideBarAndTool>
    );
}
