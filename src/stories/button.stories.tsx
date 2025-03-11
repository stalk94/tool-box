import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Buttons, {colors, variants} from '../components/buttons';
const Button = Buttons.Button;


const meta: Meta<typeof Button> = {
    title: 'Buttons',
    component: Button,
    argTypes: {
        color: {
            control: "select",
            options: colors,
        },
        variant: {
            control: "select",
            options: variants,
        },
        disabled: {
            control: "boolean",
        }
    },
}
export default meta;


const Templates =(args)=> {
    
    return(
        <Button style={{margin:'5px'}} {...args}>

        </Button>
    );
}


type Story = StoryObj<typeof Button>;
export const Base: Story = {
    args: {
        disabled: false,
        children: 'test button',
        variant: 'outlined',
        color: 'secondary'
    },
    render: (props)=> <Templates {...props} />
}