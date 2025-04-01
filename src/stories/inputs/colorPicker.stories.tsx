import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ColorPicker } from '../../components/input/input.any';
import { colors } from "../../components/button";


const meta: Meta<typeof ColorPicker> = {
    title: 'Inputs',
    component: ColorPicker,
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
  
    return(
        <div style={{margin:'20%'}}>
            <ColorPicker
                { ...args }
            />
        </div>
    );
}


type Story = StoryObj<typeof ColorPicker>;
export const ColorPick: Story = {
    args: {
        placeholder: 'Color',
        disabled: false,
        error: false,
    },
    render: (props)=> <Templates {...props} />
}