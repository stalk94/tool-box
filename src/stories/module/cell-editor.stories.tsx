import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import Card from '../../components/carts/base';
import GridEditor from '../../components/tools/grid-editor';
import { Button } from '@mui/material';


const meta: Meta<typeof Card> = {
    title: 'Module',
    component: Card,
}

export default meta;



// сделать сохранения
const Templates =(args)=> {
    const testItems = [
        {
            label: 'none'
        },
        {
            label: 'button test',
            render:()=> <Button>
                test
            </Button>
        },
        {
            label: 'button test2',
            render:()=> <Button variant='outlined'>
                test2
            </Button>
        },
        {
            label: 'base card',
            render:()=> <div style={{height:'100%',width:'100%'}}>
                    <Card/>
                    <Card/>
                    <Card/>
                    <Card/>
                </div>
        },
    ];


    return(
        <div style={{width: '100%', height: '100%'}}>
            <GridEditor 
                components={testItems}
            />
        </div>
    );
}



export const Grid: StoryObj<typeof Card> = {
    args: {
        
    },
    render: Templates
}