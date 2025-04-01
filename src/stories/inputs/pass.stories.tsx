import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Inputs from '../../components/input/input';
import Buttons from "../../components/button";


const meta: Meta<typeof Inputs.PasswordInput> = {
    title: 'Inputs',
    component: Inputs.PasswordInput,
    argTypes: {
        variant: {
            control: "select",
            options: [undefined, "fullWidth", "inset", "middle"],
        }
    },
}
export default meta;


const Templates =(args)=> {
    let value;

    return(
        <div style={{margin:'20%'}}>
            <Inputs.PasswordInput
                {...args}
                sx={{
                    background: "#00000000"
                }}
                onChange={console.log}
            >
                
            </Inputs.PasswordInput>
        </div>
    );
}


type Story = StoryObj<typeof Inputs.PasswordInput>;
export const Password: Story = {
    args: {
        placeholder: 'Password',
        variant: undefined
    },
    render: (props)=> <Templates {...props} />
}