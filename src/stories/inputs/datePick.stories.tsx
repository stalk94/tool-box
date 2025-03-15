import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Inputs from '../../components/input';



const meta: Meta<typeof Inputs.DatePickerCustom> = {
    title: 'Inputs',
    component: Inputs.DatePickerCustom,
    argTypes: {
        variant: {
            control: "select",
            options: [undefined, "fullWidth", "inset", "middle"],
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
            <Inputs.DatePickerCustom
                onChange={useChange}
                isTimePicker={args.isTimePicker}
                value={value}
            />
        </div>
    );
}


type Story = StoryObj<typeof Inputs.DatePickerCustom>;
export const DateOrTimePicker: Story = {
    args: {
        value: '23:06',
        error: false,
        isTimePicker: true,
        variant: undefined
    },
    render: (props)=> <Templates {...props} />
}