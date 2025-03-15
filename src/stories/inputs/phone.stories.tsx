import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Inputs from '../../components/input';
import Buttons from "../../components/button";


const meta: Meta<typeof Inputs.PhoneInput> = {
    title: 'Inputs',
    component: Inputs.PhoneInput,
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
            <Inputs.PhoneInput
                onChange={console.log}
                { ...args }
            />
        </div>
    );
}


type Story = StoryObj<typeof Inputs.PhoneInput>;
export const Phone: Story = {
    args: {
        

    },
    render: (props)=> <Templates {...props} />
}