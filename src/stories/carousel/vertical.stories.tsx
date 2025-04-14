import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import BaseV from '../../components/carousel/Vertical';
import { Box, Typography } from '@mui/material';
import Card from '../../components/carts/base';
import Form from '../../components/form/Form';


const meta: Meta<typeof BaseV> = {
    title: 'Carousel',
    component: BaseV,
    // tags: ["autodocs"],
    argTypes: {
       
    },
}


const Templates =(args)=> {
    const testData = [
        <Box sx={{ zoom: 1 }}>
            <Form
                loading={false}
                onChange={console.log}
                scheme={[
                    { type: 'text', id: 'test', placeholder: 'placeholder', label: 'test', position: 'column', },
                    { type: 'number', id: 'test2', label: 'test', position: 'column', },
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
        </Box>
        ,
        <img style={{ width: '100%', height: 'auto' }} src='https://picsum.photos/600/600' alt="Slide 1" /> ,
        <img style={{ width: '100%', height: 'auto' }} src='https://picsum.photos/300/300' alt="Slide 1" /> ,
        <div><Typography variant="h4">Slide 2</Typography></div>,
    ];


    return(
        <div style={{ height:'100%', display:'flex', flexDirection:'column'}}>
            <div style={{width: '100%'}}>
                подпорка верх
            </div>
            
            <Box sx={{ mx: '10%' }}>
                <BaseV
                    height={args.height}
                    settings={{ ...args }}
                    items={testData}
                />
            </Box>

            <div style={{width: '100%'}}>
                подпорка низ
            </div>
            <div style={{width: '100%'}}>
                подпорка низ
            </div>
            <div style={{width: '100%',  height: '500px'}}>
                подпорка низ
            </div>
            <div style={{width: '100%'}}>
                подпорка низ
            </div>
            <div style={{width: '100%'}}>
                подпорка низ end
            </div>
        </div>
    );
}



type Story = StoryObj<typeof BaseV>;
export default meta;
export const Vertical: Story = {
    args: {
        slidesToShow: 4,
        height: 500
    },
    render: (props)=> <Templates {...props} />
}