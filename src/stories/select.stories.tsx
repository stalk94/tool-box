import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Selects from '../components/select';
import Buttons from "../components/button";
import { colors } from "../components/button";
import { VisibilityOff, Visibility } from '@mui/icons-material';




const meta: Meta<typeof Selects.Select> = {
    title: 'Inputs',
    component: Selects.Select,
    argTypes: {
        variant: {
            control: "select",
            options: ["fullWidth", "inset", "middle"],
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
            <Selects.Select
                onChange={console.log}
                {...args}
            >
                
            </Selects.Select>
        </div>
    );
}


type Story = StoryObj<typeof Selects.Select>;
export const Select: Story = {
    args: {
        disabled: false,
        error: false,
        variant: 'middle',
        label: '',
        borderStyle: 'solid',
        items: [{value:'1', label:'test'},{value:'2', label:'test2'},{value:'3', label:'test3'}]
    },
    render: (props)=> <Templates {...props} />
}