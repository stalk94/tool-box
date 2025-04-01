import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Input from '../../components/input/number';
import { colors } from "../../components/button";




const meta: Meta<typeof Input> = {
    title: 'Inputs',
    component: Input,
    argTypes: {
        variant: {
            control: "select",
            options: [undefined, "fullWidth", "inset", "middle"],
        },
        color: {
            control: "select",
            options: colors
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
            <Input
                sx={{
                    background: '#00000000'
                }}
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
        variant: undefined,
        placeholder: 'test',
    },
    render: (props)=> <Templates {...props} />
}