import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { EmailInput } from '../../components/input/input.any';



const meta: Meta<typeof EmailInput> = {
    title: 'Inputs',
    component: EmailInput,
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
            <EmailInput
                onChange={console.log}
                { ...args }
            />
        </div>
    );
}


type Story = StoryObj<typeof EmailInput>;
export const Email: Story = {
    args: {
        disabled: false,
        error: false,

    },
    render: (props)=> <Templates {...props} />
}