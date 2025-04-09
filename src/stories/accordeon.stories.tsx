import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Accordion from '../components/accordion';


const meta: Meta<typeof Accordion> = {
    title: 'Accordion',
    component: Accordion,
    // tags: ["autodocs"],
    argTypes: {
       
    },
}



const Templates =(args)=> {
 
    return(
        <Accordion
            items={[
                { 
                    header: 'header-1', 
                    content: <div>content</div> 
                },
                { 
                    header: 'header-2', 
                    content: <div>content</div> 
                }
            ]}
            activeIndexs={[0]}
        />
    );
}



type Story = StoryObj<typeof Accordion>;
export default meta;
export const Base: Story = {
    args: {
        
    },
    render: (props)=> <Templates {...props} />
}