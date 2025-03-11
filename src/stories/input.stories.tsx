import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Inputs from '../components/input';
import Buttons from "../components/buttons";
import { colors } from "../components/buttons";
import { VisibilityOff, Visibility } from '@mui/icons-material';

const types = [
    "text", "number", "email", "password", "tel", "url",
    "date", "week", "time", "month", "datetime-local", 
    "button", "checkbox", "color", "file", "hidden", "image",
    , "radio", "range", "reset", "search", "submit"
];


const meta: Meta<typeof Inputs.Input> = {
    title: 'Inputs',
    component: Inputs.Base,
    argTypes: {
        variant: {
            control: "select",
            options: ["fullWidth", "inset", "middle"],
        },
        color: {
            control: "select",
            options: colors
        },
        type: {
            control: "select",
            options: types
        },
        size: {
            control: "select",
            options: ['small', 'medium']
        },
        position: {
            control: "select",
            options: ['end', 'start']
        }
    },
}
export default meta;

const Templates =(args)=> {
    const [showPassword, setShowPassword] = React.useState(false);
    const render =()=> {
        return (
            <Buttons.IconButton 
                onClick={()=> setShowPassword(!showPassword)} 
                color="default" 
                sx={{ p: '10px', opacity:0.5 }}
            >
                {showPassword ? <VisibilityOff /> : <Visibility />}
            </Buttons.IconButton>
        );
    }
    
    return(
        <div style={{margin:'20%'}}>
            <Inputs.Base
                {...args}
            >
                { render() }
            </Inputs.Base>
        </div>
    );
}


type Story = StoryObj<typeof Inputs.Input>;
export const Base: Story = {
    args: {
        disabled: false,
        success: true,
        error: false,
        multiline: false,
        rows: 4,
        variant: 'fullWidth',
        type: 'text',
        color: 'info',
        placeholder: 'test',
        position: 'start'
    },
    render: (props)=> <Templates {...props} />
}