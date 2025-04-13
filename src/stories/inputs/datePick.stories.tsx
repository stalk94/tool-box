import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import DatePickerCustom from '../../components/input/date';



const meta: Meta<typeof DatePickerCustom> = {
    title: 'Inputs',
    component: DatePickerCustom,
    argTypes: {
        position: {
            control: "select",
            options: ['end', 'start']
        },
        borderStyle: {
            control: "select",
            options: ['dashed', 'solid', 'dotted']
        },
        type: {
            control: 'select',
            options: ['time', 'data']
        },
        variant: {
            control: 'select',
            options: ['modal', 'popup']
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
        type: 'date',
        variant: 'popup'
    },
    render: (props)=> <Templates {...props} />
}