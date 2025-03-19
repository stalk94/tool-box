import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import Button from '@mui/material/Button';



const meta: Meta<typeof Button> = {
    title: 'Buttons',
    component: Button,
}

export default meta;


const Templates =(args)=> {
    
    return(
        <Button style={{margin:'5px'}} {...args}>

        </Button>
    );
}



export const Base: StoryObj<typeof Button> = {
    args: {
        disabled: false,
        children: 'test button',
        variant: 'outlined',
        color: 'secondary'
    }
}