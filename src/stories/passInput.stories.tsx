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
    let value;

    return(
        <div style={{margin:'20%'}}>
            <Inputs.VerifyPaswordInput
                {...args}
                onChange={console.log}
            >
                
            </Inputs.VerifyPaswordInput>
        </div>
    );
}


type Story = StoryObj<typeof Inputs.PasswordInput>;
export const Password: Story = {
    args: {
        value: 1,
        placeholder: 'password',
        variant: 'middle'
    },
    render: (props)=> <Templates {...props} />
}