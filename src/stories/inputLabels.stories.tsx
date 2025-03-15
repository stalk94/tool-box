import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { LabelText, LabelPassword, LabelColor, LabelEmail, LabelPhone } from '../components/inputs';


const meta: Meta<typeof LabelText> = {
    title: 'InputsLabel',
    component: LabelText,
    argTypes: {
        position: {
            control: "select",
            options: [undefined, "column", "left", "right"],
        }
    },
}
export default meta;

const Templates =(args)=> {
    
    return(
        <div style={{margin:'20%'}}>
            <LabelText
                onChange={console.log}
                {...args}
            >
                
            </LabelText>
            <LabelPassword
                onChange={console.log}
                {...args}
            />
            <LabelColor
                onChange={console.log}
                {...args}
            />
            <LabelEmail
                onChange={console.log}
                {...args}
            />
            <LabelPhone
                onChange={console.log}
                {...args}
            />
        </div>
    );
}


type Story = StoryObj<typeof Inputs.Input>;
export const Base: Story = {
    args: {
        position: 'column',
        placeholder: 'min 10 simbol',
        label: 'Test:'
    },
    render: (props)=> <Templates {...props} />
}