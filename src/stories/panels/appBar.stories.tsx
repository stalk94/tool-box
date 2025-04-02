import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import AppBar from '../../components/app-bar/Preview';
import { IconButton } from '@mui/material';
import { AccountBox, Home, Settings, Info } from "@mui/icons-material";
import { Box } from '@mui/material';


const meta: Meta<typeof AppBar> = {
    title: 'Panels',
    component: AppBar,
    argTypes: {
       
    },
}
export default meta;

const Templates =(args)=> {
    const navLinksTest = [
        { id: 'home', label: "Главная", icon: <Home />, comand: (v) => console.log(v) },
        { id: 'services', label: "Услуги", icon: <Settings />,
            children: [
                { label: "Услуга 1", icon: <Home />, comand: (v) => console.log(v) },
                { label: "Услуга 2", comand: (v) => console.log(v) },
                { label: "Услуга 3", comand: (v) => console.log(v) },
            ]
        },
        { id: 'services2', label: "Услуги-2",
            children: [
                { id: '1', label: "Услуга 1", icon: <Home />, comand: (v) => console.log(v) },
                { id: '2', label: "Услуга 2", comand: (v) => console.log(v) },
                { id: '3', label: "Услуга 3", comand: (v) => console.log(v) },
            ]
        },
        { id: 'services3', label: "Услуги-3", icon: <Settings />,
            children: [
                { id: '1', label: "Услуга 1", icon: <Home />, comand: (v) => console.log(v) },
                { id: '2', label: "Услуга 2", comand: (v) => console.log(v) },
                { id: '3', label: "Услуга 3", comand: (v) => console.log(v) },
            ]
        },
        { id: 'contacts', label: "Контакты", icon: <Info />, comand: (v) => console.log(v) },
        { id: 'end', label: "Конец", icon: <Info />,
            children: [
                { id: '1', label: "Вложенный 1", icon: <Home />, comand: (v) => console.log(v) },
                { id: '2', label: "Вложенный 2", icon: <Info />, comand: (v) => console.log(v) },
                { id: '3', label: "Вложенный 3", comand: (v) => console.log(v) },
            ] }
    ];
    const left =()=> (
        <Box
            component="img"
            src="https://arenadata.tech/wp-content/uploads/2024/10/logo-white-short.png" // Замените на ваш логотип
            alt="Logo"
            sx={{
                maxWidth: '100%',
                maxHeight: '50px',
                padding: '5px',
                objectFit: 'contain',
                borderRadius: '3px'
            }}
        />
    );
    const right =()=> (
        <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            sx={{ ml: 1 }}
        >
            <AccountBox />
        </IconButton>
    );


    return(
        <div style={{margin:0, padding:0}}>
            <AppBar
                linkItems={navLinksTest}
            >
                
            </AppBar>
        </div>
    );
}


type Story = StoryObj<typeof AppBar>;
export const AppBars: Story = {
    args: {
        start: true,
        end: true
    },
    render: (props)=> <Templates {...props} />
}