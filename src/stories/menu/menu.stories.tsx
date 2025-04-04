import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import MenuBase from '../../components/popup/base';
import { AccountBox, Home, Settings, Info } from "@mui/icons-material";
import { Button } from '@mui/material';



const meta: Meta<typeof MenuBase> = {
    title: 'Menu',
    component: MenuBase,
    // tags: ["autodocs"],
    argTypes: {
       
    },
}



const Templates =(args)=> {
    const navLinksTest = [
        { id:'1', label: "Главная", icon: <Home />, comand: (v) => console.log(v) },
        { id:'2', label: "Услуги", icon: <Settings />,
            children: [
                { id:'2:1', label: "Услуга 1", comand: (v) => console.log(v) },
                { id:'2:2', label: "Услуга 2", comand: (v) => console.log(v) },
                { id:'2:3', label: "Услуга 3", comand: (v) => console.log(v) },
            ]
        },
        { divider: true },
        { id: '3', label: "Услуги-2",
            children: [
                { id: '3:1', label: "Услуга 1", icon: <Home />, comand: (v) => console.log(v) },
                { id: '3:2', label: "Услуга 2", comand: (v) => console.log(v) },
                { id: '3:3', label: "Услуга 3", comand: (v) => console.log(v) },
            ]
        },
    ];
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const [items, setItems] = React.useState(navLinksTest);

    
    const handlerOnSelect =(item)=> {
        const newElems = navLinksTest.map((elem)=> {
            if(elem.id === item.id) elem.select = true;
                
            if(elem.children) {
                elem.children = elem.children.map((elem)=> {
                    if(elem.id === item.id) elem.select = true;
                    return elem;
                });
            }

            return elem;
        });

        setItems(newElems);
    }
    React.useEffect(()=> {
        if(args.open) buttonRef.current.click();
    }, [args]);
 

    return(
        <div style={{margin:'20% 40%'}}>
            <MenuBase {...args} items={items} onSelect={handlerOnSelect}>
                <Button ref={buttonRef} variant='outlined'>
                    open
                </Button>
            </MenuBase>
        </div>
    );
}



type Story = StoryObj<typeof MenuBase>;
export default meta;
export const Base: Story = {
    args: {
        open: true
    },
    render: (props)=> <Templates {...props} />
}