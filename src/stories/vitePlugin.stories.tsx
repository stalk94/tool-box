import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@mui/material';
import { writeFile } from '../app/plugins';


const meta: Meta<typeof Button> = {
    title: 'Test',
    component: Button,
    // tags: ["autodocs"],
    argTypes: {
       
    },
}


const Templates =(args)=> {
 
    return(
        <div>
            <Button
                onClick={()=> {
                    writeFile('src/_theme/cfg', 'test.txt', 'Hello xro from Storybook!')
                        .then(console.log)
                        .catch(console.error);
                }}
            >
                write
            </Button>
        </div>
    );
}



type Story = StoryObj<typeof Button>;
export default meta;
export const WritePlugin: Story = {
    args: {
        
    },
    render: (props)=> <Templates {...props} />
}