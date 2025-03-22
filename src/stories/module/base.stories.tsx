import React from 'react';
import { Home, Settings, Menu, Logout, VerifiedUser, CloudCircle, Info, AccountBox } from "@mui/icons-material";
import type { Meta, StoryObj } from '@storybook/react';
import { AlertProvider, useAlert } from '../../components/alert';
import TopBar from '../../components/nav-bars/top-nav';
import SideBarAndToolPanel from '../../components/nav-bars/tool-left';
import { Box, IconButton } from '@mui/material';



const meta: Meta<typeof AlertProvider> = {
    title: 'Module',
    component: SideBarAndToolPanel,
    // tags: ["autodocs"],
    argTypes: {
       
    },
}


const Templates =(args)=> {
    const navLinksTest = [
            { label: "Главная", icon: <Home />, comand: (v) => console.log(v) },
            { label: "Услуги", icon: <Settings />,
                children: [
                    { label: "Услуга 1", icon: <Home />, comand: (v) => console.log(v) },
                    { label: "Услуга 2", comand: (v) => console.log(v) },
                    { label: "Услуга 3", comand: (v) => console.log(v) },
                ]
            },
            { label: "Услуги-2",
                children: [
                    { label: "Услуга 1", icon: <Home />, comand: (v) => console.log(v) },
                    { label: "Услуга 2", comand: (v) => console.log(v) },
                    { label: "Услуга 3", comand: (v) => console.log(v) },
                ]
            },
            { label: "Услуги-3", icon: <Settings />,
                children: [
                    { label: "Услуга 1", icon: <Home />, comand: (v) => console.log(v) },
                    { label: "Услуга 2", comand: (v) => console.log(v) },
                    { label: "Услуга 3", comand: (v) => console.log(v) },
                ]
            },
            { label: "Контакты", icon: <Info />, comand: (v) => console.log(v) },
            { label: "Конец", icon: <Info />,
                children: [
                    { label: "Услуга 1", icon: <Home />, comand: (v) => console.log(v) },
                    { label: "Услуга 2", comand: (v) => console.log(v) },
                    { label: "Услуга 3", comand: (v) => console.log(v) },
                ] }
    ];
    const menuItems = [
        { id: "1", label: "Меню", icon: <Menu />, children: [
            { id: "1:1", label: "Вложенный 1", icon: <Home /> },
            { id: "1:2", label: "Вложенный 2", icon: <Settings /> },
        ] },
        { divider: true },
        { id: "3", label: "Главная", icon: <Home /> },
        { id: "4", label: "Главная", icon: <CloudCircle /> },
        { id: "5", label: "Выход", icon: <VerifiedUser/> },
        
    ];
    const endItems = [
        { id: "7", label: "Выход", icon: <Settings /> },
        { id: "8", label: "Выход", icon: <Logout /> }
    ];

    const renderLeftTopNavigation =()=> (
        <Box
            component="img"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Meta-Logo.png/2560px-Meta-Logo.png" // Замените на ваш логотип
            alt="Logo"
            sx={{
                maxWidth: '100%',
                maxHeight: '50px',
                objectFit: 'contain',
                borderRadius: '3px'
            }}
        />
    );
    const renderRightTopNavigation =()=> (
        <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            sx={{ ml: 1 }}
        >
            <AccountBox />
        </IconButton>
    );
    const handlerChangeNavigation =(item)=> {
        console.log('left navigation', item)
    }
    const handlerChangeTopNavigation =(item)=> {
        console.log('top navigation', item)
    }
 

    return(
        <div style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <AlertProvider>
                <TopBar
                    items={navLinksTest}
                    end={renderRightTopNavigation()}
                    start={renderLeftTopNavigation()}
                    //onChange={handlerChangeTopNavigation}   // слушателя нет, только comand
                />

                <SideBarAndToolPanel
                    sx={{ height: '100%' }}
                    schemaNavBar={{
                        items: menuItems,
                        end: endItems
                    }}
                    onChangeNavigation={handlerChangeNavigation}
                    {...args}
                >
                    { args.toolPanelopen }
                </SideBarAndToolPanel>
            </AlertProvider>
        </div>
    );
}



type Story = StoryObj<typeof TopBar>;
export default meta;
export const Base: Story = {
    args: {
        toolPanelopen: false
    },
    render: (props)=> <Templates {...props} />
}