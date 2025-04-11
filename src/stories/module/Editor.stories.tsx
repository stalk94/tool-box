import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import Card from '../../components/carts/base';
import EditorGrid from '../../components/grid/Render';
import Form from '../../components/form';
import { Button } from '@mui/material';
import Icons, { Equalizer, Calculate, AccountBox, Height } from "@mui/icons-material";


const meta: Meta<typeof EditorGrid> = {
    title: 'Module',
    component: EditorGrid,
}

export default meta;



// сделать сохранения
const Templates =(args)=> {


    return(
        <div 
            style={{
                height: '100%',
            }}
        >
            <EditorGrid
                {...args}
            />
        </div>
    );
}



export const Editor: StoryObj<typeof EditorGrid> = {
    args: {
        height: 60
    },
    render: Templates
}