import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import Card from '../../components/carts/base';
import EditorGrid from '../../components/grid/render';
import Form from '../../components/form';
import { Button } from '@mui/material';
import Icons, { Equalizer, Calculate, AccountBox } from "@mui/icons-material";


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
                width: '100%', 
                height: '100%',
                display: 'flex',
                
            }}
        >
            <EditorGrid
                
            />
        </div>
    );
}



export const Editor: StoryObj<typeof EditorGrid> = {
    args: {
        
    },
    render: Templates
}