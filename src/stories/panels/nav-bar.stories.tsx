import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import NavBar from '../../components/nav-bars/top-nav';
import { IconButton } from '@mui/material';
import { AccountBox, Home, Settings, Info } from "@mui/icons-material";
import { Box } from '@mui/material';


const meta: Meta<typeof NavBar> = {
    title: 'Panels',
    component: NavBar,
    argTypes: {
       
    },
}
export default meta;

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
            <NavBar
                items={navLinksTest}
                end={args.end && right()}
                start={args.start && left()}
                onChange={console.log}
            >
                
            </NavBar>
        </div>
    );
}


type Story = StoryObj<typeof NavBar>;
export const Navbar: Story = {
    args: {
        start: true,
        end: true
    },
    render: (props)=> <Templates {...props} />
}