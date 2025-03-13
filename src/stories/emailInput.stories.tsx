import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Inputs from '../components/input';
import Buttons from "../components/button";


const meta: Meta<typeof Inputs.PasswordInput> = {
    title: 'Inputs',
    component: Inputs.PasswordInput,
    argTypes: {
        variant: {
            control: "select",
            options: ["fullWidth", "inset", "middle"],
        }
    },
}
export default meta;


const Templates =(args)=> {
  
    return(
        <div style={{margin:'20%'}}>
            <Inputs.EmailInput
                onChange={console.log}
                { ...args }
            />
        </div>
    );
}


type Story = StoryObj<typeof Inputs.PasswordInput>;
export const Email: Story = {
    args: {
        error: true,

    },
    render: (props)=> <Templates {...props} />
}