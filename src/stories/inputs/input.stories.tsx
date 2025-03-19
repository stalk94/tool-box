import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Inputs from '../../components/input/input';
import { colors } from "../../components/button";


const types = [
    "text", "number", "email", "password", "tel", "url",
    "date", "week", "time", "month", "datetime-local", 
    "button", "checkbox", "color", "file", "hidden", "image",
    , "radio", "range", "reset", "search", "submit"
];


const meta: Meta<typeof Inputs.Input> = {
    title: 'Inputs',
    component: Inputs.Input,
    argTypes: {
        variant: {
            control: "select",
            options: [undefined, "fullWidth", "inset", "middle"],
        },
        color: {
            control: "select",
            options: colors
        },
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
            <Inputs.Input
                onChange={console.log}
                {...args}
            >
                
            </Inputs.Input>
        </div>
    );
}


type Story = StoryObj<typeof Inputs.Input>;
export const Base: Story = {
    args: {
        disabled: false,
        error: false,
        multiline: false,
        rows: 4,
        borderStyle: 'solid',
        variant: undefined,
        type: 'number',
        color: 'info',
        placeholder: 'Test placeholder'
    },
    render: (props)=> <Templates {...props} />
}