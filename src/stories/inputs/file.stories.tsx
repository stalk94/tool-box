import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import FileLoader, { SimpleFileLoader } from '../../components/input/file-loader';
import { Box } from '@mui/material';



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
            <SimpleFileLoader
                style={{marginTop: '15px'}}
                dragActiveClassName="drag-over"
                onUpload={(files) => console.log(files)}
            >
                <Box sx={{
                    width: 200,
                    height: 100,
                    border: '1px dashed grey',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 2,
                }}>
                    📂 Зона загрузки
                </Box>
            </SimpleFileLoader>
            <style>
                {`.drag-over {
                    border-color: blue !important;
                    background: rgba(0, 0, 255, 0.05);
                }`}
        </style>
        </div>
    );
}


type Story = StoryObj<typeof FileLoader>;
export const FileLoad: Story = {
    args: {
        
    },
    render: (props)=> <Templates {...props} />
}