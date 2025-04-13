import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Text from '../../components/input/text';


const types = [
    "text", "number", "email", "password", "tel", "url",
    "date", "week", "time", "month", "datetime-local", 
    "button", "checkbox", "color", "file", "hidden", "image",
    , "radio", "range", "reset", "search", "submit"
];


const meta: Meta<typeof Text> = {
    title: 'Inputs',
    component: Text,
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
            <Text
                onChange={console.log}
                {...args}
            >
                
            </Text>
        </div>
    );
}


type Story = StoryObj<typeof Text>;
export const Base: Story = {
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