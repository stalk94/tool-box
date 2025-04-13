import React from 'react';
import { IconButton } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react';
import Selects from '../../components/input/select';
import { VisibilityOff, Visibility } from '@mui/icons-material';




const meta: Meta<typeof Selects> = {
    title: 'Inputs',
    component: Selects,
    argTypes: {
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
    const render =()=> {
        return (
            <IconButton
                onClick={()=> setShowPassword(!showPassword)} 
                color="default" 
                sx={{ p: '10px', opacity:0.5 }}
            >
                {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
        );
    }
    
    return(
        <div style={{margin:'20%'}}>
            <Selects
                onChange={console.log}
                {...args}
            >
                
            </Selects>
        </div>
    );
}


type Story = StoryObj<typeof Selects>;
export const Select: Story = {
    args: {
        disabled: false,
        error: false,
        borderStyle: 'solid',
        placeholder: 'Select',
        items: [{id:'1', label:'test'},{id:'2', label:'test2'},{id:'3', label:'test3'}]
    },
    render: (props)=> <Templates {...props} />
}