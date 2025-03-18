import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Home, Settings, Menu, Logout, VerifiedUser, CloudCircle } from "@mui/icons-material";
import BaseLeftSideBar from '../../components/nav-bars/left-nav';
import { Divider, Box } from '@mui/material';
import Container from "@mui/material/Container";



const meta: Meta<typeof BaseLeftSideBar> = {
    title: 'Panels',
    component: BaseLeftSideBar,
    argTypes: {
       type: {
            control: "select",
            options: ['box', 'drawer'],
       }
    },
}
export default meta;

const Templates =(args)=> {
    const dop = [
        { id: "5", label: "Выход", icon: < CloudCircle /> },
        { id: "5", label: "Выход", icon: < Logout /> },
        { id: "5", label: "Выход", icon: < Logout /> },
        { id: "5", label: "Выход", icon: < Logout /> },
        { id: "5", label: "Выход", icon: < Logout /> },
        { id: "5", label: "Выход", icon: < Logout /> },
        { id: "5", label: "Выход", icon: < Logout /> },
        { id: "5", label: "Выход", icon: < Logout /> },
        { id: "5", label: "Выход", icon: < Logout /> },
        { id: "5", label: "Выход", icon: < Logout /> },
        { id: "5", label: "Выход", icon: < Logout /> },
        { id: "5", label: "Выход", icon: < Logout /> },
        { id: "5", label: "Выход", icon: < Logout /> },
        { id: "5", label: "Выход", icon: < Logout /> },
        { id: "5", label: "Выход", icon: < Logout /> },
        { id: "5", label: "Выход", icon: < Logout /> },
        { id: "5", label: "Выход", icon: < Logout /> },
        { id: "5", label: "Выход", icon: < CloudCircle /> },
    ];
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
        { divider: true },
        { id: "5", label: "Выход", icon: <VerifiedUser/>, comand:(v)=> console.log(v) },
    ];
    const endItems = [
        { id: "7", label: "Выход", icon: <Settings /> },
        { id: "8", label: "Выход", icon: <Logout /> }
    ];

    
    return(
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <div>top</div>
            <div>top</div>
            <BaseLeftSideBar
                items={args.max ? [...menuItems, ...dop] : menuItems}
                end={args.ends && endItems}
                onChange={console.log}
                {...args}
            >
                
            </BaseLeftSideBar>
            <div>bottom</div>
            <div>bottom</div>
            <div>bottom</div>
        </Box>
    );
}


type Story = StoryObj<typeof BaseLeftSideBar>;
export const LeftNavigation: Story = {
    args: {
        collapsed: true,
        type: 'box',
        ends: true,
        max: false
    },
    render: (props)=> <Templates {...props} />
}