import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Typography } from '@mui/material';



const meta: Meta<typeof Typography> = {
    title: 'Text',
    component: Typography,
    // tags: ["autodocs"],
    argTypes: {
       
    },
}


const Templates =(args)=> {
 
    return(
        <div style={{margin: '30px'}}>
            <Typography
                variant='h2'
            >
                h2 - Заголовок
            </Typography>
            <Typography
                variant='h4'
            >
                h4 - Заголовок
            </Typography>
            <Typography
                variant='body1'
            >
                body1 (primery)
            </Typography>
            <Typography
                variant='subtitle1'
            >
                subtitle1
            </Typography>
            <Typography
                variant='body2'
            >
                body2 (secondary)
            </Typography>
            <Typography
                variant='subtitle2'
            >
                subtitle2
            </Typography>
            <Typography
                variant='caption'
            >
                caption (мелкие пояснения) *inline
            </Typography>
        </div>
    );
}



type Story = StoryObj<typeof Typography>;
export default meta;
export const Text: Story = {
    args: {
        
    },
    render: (props)=> <Templates {...props} />
}