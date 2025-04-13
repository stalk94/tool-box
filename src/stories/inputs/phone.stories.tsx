import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { PhoneInput } from '../../components/input/input.any';


const meta: Meta<typeof PhoneInput> = {
    title: 'Inputs',
    component: PhoneInput,
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
  
    return(
        <div style={{margin:'20%'}}>
            <PhoneInput
                onChange={console.log}
                { ...args }
            />
        </div>
    );
}


type Story = StoryObj<typeof PhoneInput>;
export const Phone: Story = {
    args: {
        disabled: false,
        error: false,

    },
    render: (props)=> <Templates {...props} />
}