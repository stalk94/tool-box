import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Input from '../../components/input/number';




const meta: Meta<typeof Input> = {
    title: 'Inputs',
    component: Input,
    argTypes: {
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
            <Input
                onChange={console.log}
                {...args}
            >
                
            </Input>
        </div>
    );
}


type Story = StoryObj<typeof Input>;
export const Number: Story = {
    args: {
        disabled: false,
        error: false,
        borderStyle: 'solid',
        placeholder: 'test',
    },
    render: (props)=> <Templates {...props} />
}