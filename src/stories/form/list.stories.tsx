import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import BaseList from '../../components/list/base';
import { Box } from '@mui/material';
import { Search, RadioButtonChecked, Circle, Info, CheckCircle } from '@mui/icons-material';



const meta: Meta<typeof BaseList> = {
    title: 'form',
    component: BaseList,
    argTypes: {
        
    },
}
export default meta;



const Templates =(args)=> {
    const test = [{
            startIcon: <Circle />,
            primary: 'one',
            secondary: 'secondary',
        }, {
            startIcon: <Info />,
            primary: 'two',
            secondary: 'secondary',
    },{
            startIcon: <Circle />,
            primary: 'one',
            secondary: 'secondary',
        }, {
            startIcon: <Info />,
            primary: 'two',
            secondary: 'secondary',
    },{
            startIcon: <Circle />,
            primary: 'one',
            secondary: 'secondary',
        }, {
            startIcon: <Info />,
            primary: 'two',
            secondary: 'secondary',
    },{
            startIcon: <Circle />,
            primary: 'one',
            secondary: 'secondary',
        }, {
            startIcon: <Info />,
            primary: 'two',
            secondary: 'secondary',
    }];

    return(
        <div style={{margin: '30%', marginTop:'10%'}}>
            <Box sx={{border: '1px dashed gray'}}>
                <BaseList
                    onClick={console.log}
                    items={test}
                />
            </Box>
            <div>foot</div>
        </div>
    );
}



type Story = StoryObj<typeof BaseList>;
export const BaseLists: Story = {
    args: {
       
    },
    render: (props)=> <Templates {...props} />
}