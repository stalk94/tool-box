import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import Card from '../../components/carts/base';
import GridEditor from '../../components/tools/grid-editor';
import Form from '../../components/form';
import { Button } from '@mui/material';
import Icons, { Equalizer, Calculate, AccountBox } from "@mui/icons-material";


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
            label: 'base card',
            render:()=> <div style={{height:'100%',width:'100%'}}>
                    <Card/>
                    <Card/>
                    <Card/>
                    <Card/>
                </div>
        },
        {
            label: 'form',
            render: ()=> (
                <div style={{height:'100%'}}>
                    <Form
                        loading={false}
                        onChange={console.log}
                        scheme={[
                            { type: 'text', id: 'test', placeholder: 'placeholder', label: 'test', position: 'column', left: <AccountBox /> },
                            { type: 'number', id: 'test2', label: 'test', position: 'column', left: <Calculate /> },
                            { type: 'color', id: 'test3', label: 'test', position: 'column' },
                            {
                                type: 'select', id: 'test4', label: 'test', position: 'column',
                                items: [
                                    { id: '1', label: 'test' },
                                    { id: '2', label: 'test2' },
                                    {
                                        id: '3', label: 'test3', children: [
                                            { id: '3:1', label: 'tester' },
                                            { id: '3:2', label: 'testr2' }
                                        ]
                                    },
                                ]
                            },
                            {
                                type: 'toggle', id: 'test7', label: 'test', position: 'column',
                                items: [
                                    { id: '1', label: 'test' },
                                    { id: '2', label: 'test2' },
                                    { id: '3', label: 'test3' },
                                ]
                            },
                            { type: 'slider', id: 'test5', label: 'test', position: 'column' },
                            { type: 'switch', id: 'test6', label: 'Включить свет', position: 'column' },
                            { type: 'checkbox', id: 'test8', label: 'Принять' },
                        ]}
                    />
                </div>
            )
        }
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