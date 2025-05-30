import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import ColorPicker, { ColorPickerCompact } from '../../components/input/color';



const meta: Meta<typeof ColorPicker> = {
    title: 'Inputs',
    component: ColorPicker,
    argTypes: {
        position: {
            control: "select",
            options: ['end', 'start']
        },
        borderStyle: {
            control: "select",
            options: ['dashed', 'solid', 'dotted']
        },
        variant: {
            control: 'select',
            options: ['popup', 'modal']
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
            <ColorPickerCompact
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
        showCopy: true,
        variant: 'popup'
    },
    render: (props)=> <Templates {...props} />
}