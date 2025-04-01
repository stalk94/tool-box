import React from 'react';
import { Home, Settings, Menu, Logout, VerifiedUser, CloudCircle } from "@mui/icons-material";
import type { Meta, StoryObj } from '@storybook/react';
import { AlertProvider, useAlert } from '../../components/alert';
import AppBarPreview from '../../components/app-bar/Preview';
import SideBarAndToolPanel from '../../components/nav-bars/tool-left';



const meta: Meta<typeof AlertProvider> = {
    title: 'Module',
    component: SideBarAndToolPanel,
    // tags: ["autodocs"],
    argTypes: {
       
    },
}


const Templates =(args)=> {
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


    return(
        <div style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <AlertProvider>
                <AppBarPreview
                  
                />
                <SideBarAndToolPanel
                    sx={{ height: '100%' }}
                    schemaNavBar={{
                        items: menuItems,
                        end: endItems
                    }}
                    onChangeNavigation={console.log}
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