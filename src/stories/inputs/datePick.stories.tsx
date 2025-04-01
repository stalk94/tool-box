import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import DatePickerCustom from '../../components/input/date';
import { colors } from "../../components/button";


const meta: Meta<typeof DatePickerCustom> = {
    title: 'Inputs',
    component: DatePickerCustom,
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
    const [value, setValue] = React.useState(args.value);
  
    const useChange =(value: any)=> {
        console.log(value);
        setValue(value);
    }

    return(
        <div style={{margin:'20%'}}>
            <DatePickerCustom
                onChange={useChange}
                isTimePicker={args.isTimePicker}
                value={value}
                { ...args }
            />
        </div>
    );
}


type Story = StoryObj<typeof DatePickerCustom>;
export const DateOrTimePicker: Story = {
    args: {
        value: '23:06',
        error: false,
        disabled: false,
        isTimePicker: true,
    },
    render: (props)=> <Templates {...props} />
}