import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Form from '../../components/form/Form';
import Icons, { Equalizer, Calculate, AccountBox } from "@mui/icons-material";



const meta: Meta<typeof Form> = {
    title: 'Form',
    component: Form,
    argTypes: {
        
    },
}
export default meta;



const Templates =(args)=> {
    const sx =  {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: '100%', 
        opacity: 0.7,
        mb: 1.5,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    }
    
    
    // * position - повторяется, icon можно инструмент сделать сопоставления
    return(
        <div style={{margin: '30%', marginTop:'10%'}}>
            <Form
                loading={false}
                onChange={console.log}
                scheme={[
                    { type: 'text', id: 'test', placeholder: 'placeholder', label: 'test', position: 'column', left: <AccountBox/> },
                    { type: 'number', id: 'test2', label: 'test', position: 'column', left: <Calculate/> },
                    { type: 'color', id: 'test3', label: 'test', position: 'column' },
                    { type: 'select', id: 'test4', label: 'test', position: 'column',
                        items: [
                            { id:'1', label:'test' },
                            { id:'2', label:'test2' },
                            { id:'3', label:'test3', items: [
                                {id:'3:1', label:'tester'},
                                {id:'3:2', label:'testr2'}
                            ]},
                        ]
                    },
                    { type: 'toggle', id: 'test7', label: 'test', position: 'column',
                        items: [
                            { id:'1', label:'test' },
                            { id:'2', label:'test2' },
                            { id:'3', label:'test3' },
                        ]
                    },
                    { type: 'slider', id: 'test5', label: 'test', position: 'column' },
                    { type: 'switch', id: 'test6', label: 'Включить свет', position: 'column' },
                    { type: 'checkbox', id: 'test8', label: 'Принять' },
                ]}
            />
        </div>
    );
}


type Story = StoryObj<typeof Form>;
export const FormBase: Story = {
    args: {
       
    },
    render: (props)=> <Templates {...props} />
}