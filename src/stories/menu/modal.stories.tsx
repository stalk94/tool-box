import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@mui/material';
import Dialog from '../../components/modal';


const meta: Meta<typeof ialog> = {
    title: 'Menu',
    component: Dialog,
    // tags: ["autodocs"],
    argTypes: {
       
    },
}



const Templates =(args)=> {
    const [open, setOpen] = React.useState(args.open);

    return(
        <div style={{margin:'20% 40%'}}>
            <Button onClick={()=> setOpen(true)} variant='outlined'>
                open
            </Button>

            <Dialog 
                {...args}
                open={open}
                setOpen={setOpen}
            >

            </Dialog>
        </div>
    );
}



type Story = StoryObj<typeof Dialog>;
export default meta;
export const Modal: Story = {
    args: {
        open: true
    },
    render: (props)=> <Templates {...props} />
}