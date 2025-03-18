import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Home, Settings, Menu, Logout, VerifiedUser, CloudCircle } from "@mui/icons-material";
import SideBarAndToolPanel from '../../components/nav-bars/tool-left';
import { Divider, Box } from '@mui/material';




const meta: Meta<typeof SideBarAndToolPanel> = {
    title: 'Panels',
    component: SideBarAndToolPanel,
    argTypes: {
       type: {
            control: "select",
            options: ['box', 'drawer'],
       }
    },
}
export default meta;

const Templates =(args)=> {
    const selectedPanel = 'xro';
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
            { id: "2:1", label: "Вложенный 3", icon: <Home /> },
            { id: "2:2", label: "Вложенный 4", icon: <Settings /> },
        ] },
        { id: "3", label: "Главная", icon: <Home /> },
        { divider: true },
        { id: "5", label: "Выход", icon: <VerifiedUser/> },
    ];
    const endItems = [
        { id: "7", label: "Выход", icon: <Settings /> },
        { id: "8", label: "Выход", icon: <Logout /> }
    ];
    const childtools = [
        <h3>Инструменты для</h3>,
        <p>Дополнительные инструменты для выбранного пункта меню.</p>,
        <h3>Инструменты для</h3>,
        <p>Дополнительные инструменты для выбранного пункта меню.</p>,
        <h3>Инструменты для {selectedPanel}</h3>,
        <p>Дополнительные инструменты для выбранного пункта меню.</p>,
        <h3>Инструменты для {selectedPanel}</h3>,
        <p>Дополнительные инструменты для выбранного пункта меню.</p>,
        <h3>Инструменты для {selectedPanel}</h3>,
        <p>Дополнительные инструменты для выбранного пункта меню.</p>,
        <h3>Инструменты для {selectedPanel}</h3>,
        <p>Дополнительные инструменты для выбранного пункта меню.</p>,
        <h3>Инструменты для {selectedPanel}</h3>,
        <p>Дополнительные инструменты для выбранного пункта меню.</p>,
        <h3>Инструменты для {selectedPanel}</h3>,
        <p>Дополнительные инструменты для выбранного пункта меню.</p>,
        <h3>Инструменты для {selectedPanel}</h3>,
        <p>Дополнительные инструменты для выбранного пункта меню.</p>,
        <h3>Инструменты для {selectedPanel}</h3>,
        <p>Дополнительные инструменты для выбранного пункта меню.</p>
    ];

    
    return(
        <Box sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <div>top</div>
            
            <SideBarAndToolPanel
                schemaNavBar={{
                    items: args.max ? [...menuItems, ...dop] : menuItems,
                    end: args.ends && endItems
                }}
                onChangeNavigation={console.log}
                {...args}
            >
                { args.max ? childtools : childtools.slice(0, 6) }
            </SideBarAndToolPanel>

            <div>bottom</div>
            <div>bottom</div>
            <div>bottom</div>
        </Box>
    );
}


type Story = StoryObj<typeof SideBarAndToolPanel>;
export const LeftNavigationAndTool: Story = {
    args: {
        collapsed: true,
        type: 'box',
        ends: true,
        max: false
    },
    render: (props)=> <Templates {...props} />
}