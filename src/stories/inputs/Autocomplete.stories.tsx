import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import AutoText from '../../components/input/autocomplete';


const types = [
    "text", "number", "email", "password", "tel", "url",
    "date", "week", "time", "month", "datetime-local", 
    "button", "checkbox", "color", "file", "hidden", "image",
    , "radio", "range", "reset", "search", "submit"
];


const meta: Meta<typeof AutoText> = {
    title: 'Inputs',
    component: AutoText,
    argTypes: {
        type: {
            control: "select",
            options: types
        },
        position: {
            control: "select",
            options: ['end', 'start']
        },
        borderStyle: {
            control: "select",
            options: ['dashed', 'solid', 'dotted']
        }
    },
}
export default meta;

const Templates =(args)=> {
    
    return(
        <div style={{margin:'20%'}}>
            <AutoText
                onChange={console.log}
                {...args}
            >
                
            </AutoText>
        </div>
    );
}


type Story = StoryObj<typeof AutoText>;
export const Autocomplete: Story = {
    args: {
        disabled: false,
        error: false,
        multiline: false,
        rows: 4,
        borderStyle: 'solid',
        type: 'number',
        color: 'info',
        placeholder: 'Test placeholder'
    },
    render: (props)=> <Templates {...props} />
}