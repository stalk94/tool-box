import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Inputs from '../../components/input/input';



const meta: Meta<typeof Inputs.ColorPicker> = {
    title: 'Inputs',
    component: Inputs.ColorPicker,
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
            <Inputs.ColorPicker
                { ...args }
            />
        </div>
    );
}


type Story = StoryObj<typeof Inputs.ColorPicker>;
export const ColorPicker: Story = {
    args: {
        placeholder: 'Color',
        left: true
    },
    render: (props)=> <Templates {...props} />
}