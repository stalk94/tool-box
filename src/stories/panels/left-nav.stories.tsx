import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Home, Settings, Menu, Logout } from "@mui/icons-material";
import LeftNav from '../../components/nav-bars/left-nav';
import { Divider } from '@mui/material';




const meta: Meta<typeof LeftNav> = {
    title: 'Panels',
    component: LeftNav,
    argTypes: {
       
    },
}
export default meta;

const Templates =(args)=> {
    const menuItems = [
        { id: "1", label: "Меню", icon: <Menu />, children: [
            { id: "1:1", label: "Вложенный 1", icon: <Home /> },
            { id: "1:2", label: "Вложенный 2", icon: <Settings /> },
        ] },
        { id: "2", label: "Меню2", icon: <Menu />, children: [
            { id: "2:1", label: "Вложенный 3", icon: <Home />, comand: (v) => console.log(v) },
            { id: "2:2", label: "Вложенный 4", icon: <Settings />, comand: (v) => console.log(v) },
        ] },
        { id: "3", label: "Главная", icon: <Home />, comand:(v)=> console.log(v) },
        { id: "4", label: "Настройки", icon: <Settings />, comand:(v)=> console.log(v) },
        { divider: true },
        { id: "5", label: "Выход", icon: < Logout />, comand:(v)=> console.log(v) },
    ];

    return(
        <div style={{margin:'20%'}}>
            <LeftNav
                items={menuItems}
                onChange={console.log}
                {...args}
            >
                
            </LeftNav>
        </div>
    );
}


type Story = StoryObj<typeof LeftNav>;
export const LeftNavigation: Story = {
    args: {
        collapsed: true
    },
    render: (props)=> <Templates {...props} />
}