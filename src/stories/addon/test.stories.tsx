import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import Icons from '../../components/tools/icons';
//import Button from '@mui/material/Button/Button.js';
import { Button, ButtonProps } from "@mui/material";

const meta: Meta<typeof Icons> = {
    title: 'Test',
    component: Icons,
    //tags: ["autodocs"],
}

export default meta;





const Templates =(args)=> {


    return(
        <div>
            <Icons {...args}/>
        </div>
    );
}



export const Icon: StoryObj<typeof Icons> = {
    args: {
        color: 'orange'
    },
    render: (props)=> <Templates {...props} />
}