import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Responsive, WidthProvider, Layouts, Layout } from "react-grid-layout";
import { alpha, darken, lighten, Avatar, Button, Grid2 } from '@mui/material';
import Card from '../../components/carts/base';
import GridEditor, { StaticGrid } from '../../components/tools/new-grid-editor';



const meta: Meta<typeof Card> = {
    title: 'Module',
    component: Card,
}

export default meta;



// сделать сохранения
const Templates =(args)=> {
    const [layout, setLayout] = React.useState<Layout[]>([]);
    const testItems = [
        <div></div>,
        <Button>
            test
        </Button>,
        <Button variant='outlined'>
            test2
        </Button>,
    ];


    
    return(
        <GridEditor 
            layout={layout}
            setLayout={setLayout}
            renderItems={testItems}
        />
    );
}



export const Grid: StoryObj<typeof Card> = {
    args: {
        
    },
    render: Templates
}