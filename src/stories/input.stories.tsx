import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Inputs from '../components/input';
import Buttons from "../components/button";
import { colors } from "../components/button";
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
    const [showPassword, setShowPassword] = React.useState(false);
    const left =()=> {
        return (
            <Buttons.IconButton 
                onClick={()=> setShowPassword(!showPassword)} 
                color="default" 
                sx={{ p: '10px' }}
            >
                {showPassword ? <VisibilityOff style={{color:'gray'}} /> : <Visibility style={{color:'gray'}}/>}
            </Buttons.IconButton>
        );
    }

    
    return(
        <div style={{margin:'20%'}}>
            <Inputs.Input
                left={left()}
                right={left()}
                onChange={console.log}
                {...args}
            >
                
            </Inputs.Input>
        </div>
    );
}


type Story = StoryObj<typeof Inputs.Input>;
export const BaseInput: Story = {
    args: {
        disabled: false,
        error: false,
        success: false,
        multiline: false,
        rows: 4,
        borderStyle: 'solid',
        variant: 'middle',
        type: 'number',
        color: 'info',
        placeholder: 'test',
        position: 'start'
    },
    render: (props)=> <Templates {...props} />
}