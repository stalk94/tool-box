import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Main from '../components/main';




const meta: Meta<typeof Main> = {
    title: 'Mains',
    component: Main,
    argTypes: {
       
    },
}
export default meta;

const Templates =(args)=> {
    
    return(
        <div style={{margin:'20%'}}>
            <Main
                onChange={console.log}
                {...args}
            >
                
            </Main>
        </div>
    );
}


type Story = StoryObj<typeof Main>;
export const Base: Story = {
    args: {
        collapsed: true
    },
    render: (props)=> <Templates {...props} />
}