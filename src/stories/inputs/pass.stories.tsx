import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import PasswordInput from '../../components/input/password';
import { colors } from "../../components/button";


const meta: Meta<typeof PasswordInput> = {
    title: 'Inputs',
    component: PasswordInput,
    argTypes: {
        color: {
            control: "select",
            options: colors
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
    let value;

    return(
        <div style={{margin:'20%'}}>
            <PasswordInput
                {...args}
                onChange={console.log}
            >
                
            </PasswordInput>
        </div>
    );
}


type Story = StoryObj<typeof PasswordInput>;
export const Password: Story = {
    args: {
        disabled: false,
        error: false,
        placeholder: 'Password'
    },
    render: (props)=> <Templates {...props} />
}