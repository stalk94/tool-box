import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import FileLoader from '../../components/input/file-loader';



const meta: Meta<typeof FileLoader> = {
    title: 'Inputs',
    component: FileLoader,
    argTypes: {
        position: {
            control: "select",
            options: ['end', 'start']
        },
        borderStyle: {
            control: "select",
            options: ['dashed', 'solid', 'dotted']
        },
        variant: {
            control: 'select',
            options: ['popup', 'modal']
        }
    },
}
export default meta;


const Templates =(args)=> {
  
    return(
        <div style={{margin:'20%'}}>
            <FileLoader

            />
        </div>
    );
}


type Story = StoryObj<typeof FileLoader>;
export const FileLoad: Story = {
    args: {
        
    },
    render: (props)=> <Templates {...props} />
}