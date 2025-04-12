import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import EditorGrid from '../../bloc/App';



const meta: Meta<typeof EditorGrid> = {
    title: 'Module',
    component: EditorGrid,
}

export default meta;



// сделать сохранения
const Templates =(args)=> {


    return(
        <div 
            style={{
                height: '100%',
            }}
        >
            <EditorGrid
                {...args}
            />
        </div>
    );
}



export const Editor: StoryObj<typeof EditorGrid> = {
    args: {
        height: 60
    },
    render: Templates
}