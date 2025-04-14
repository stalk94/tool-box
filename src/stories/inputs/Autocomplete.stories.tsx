import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import AutoText from '../../components/input/autocomplete';
import { Person } from '@mui/icons-material';


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
    const options = [
        { label: 'Apple', id: 'apple' },
        { label: 'Banana', id: 'banana' },
        { label: 'Orange', id: 'orange' },
    ]
    
    return(
        <div style={{margin:'20%'}}>
            <AutoText
                onChange={console.log}
                options={options}
                left={<Person />}
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
        rows: 4,
        borderStyle: 'solid',
        type: 'number',
        color: 'info',
        placeholder: 'Test placeholder'
    },
    render: (props)=> <Templates {...props} />
}