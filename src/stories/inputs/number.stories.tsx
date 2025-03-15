import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Inputs from '../../components/input';
import { colors } from "../../components/button";




const meta: Meta<typeof Inputs.NumberInput> = {
    title: 'Inputs',
    component: Inputs.Base,
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
            <Inputs.NumberInput
                onChange={console.log}
                {...args}
            >
                
            </Inputs.NumberInput>
        </div>
    );
}


type Story = StoryObj<typeof Inputs.NumberInput>;
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