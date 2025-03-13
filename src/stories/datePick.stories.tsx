import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Inputs from '../components/input';
import Buttons from "../components/button";


const meta: Meta<typeof Inputs.DatePickerCustom> = {
    title: 'Inputs',
    component: Inputs.DatePickerCustom,
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
            <Inputs.DatePickerCustom
                onChange={console.log}
                { ...args }
            />
        </div>
    );
}


type Story = StoryObj<typeof Inputs.DatePickerCustom>;
export const DateOrTimePicker: Story = {
    args: {
        error: true,
        isTimePicker: true

    },
    render: (props)=> <Templates {...props} />
}