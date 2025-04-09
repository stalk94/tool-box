import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import GridCart from '../../components/carts/Block';


const meta: Meta<typeof GridCart> = {
    title: 'Cards',
    component: GridCart,
    argTypes: {
       
    }
}

export default meta;



const Templates =(args)=> {
    const [v, setV] = React.useState([0, 1]);


    return(
        <div 
            style={{
                padding:'10%',
                height:'100%',
                paddingLeft: '10%'
            }}
        >
            <GridCart {...args}>
                <div>{v[0]}</div>
                <div>{v[1]}</div>
                <div>2</div>
            </GridCart>
        </div>
    );
}



export const Block: StoryObj<typeof GridCart> = {
    args: {
        variant: '12x6x6',
        isMobail: true,
        elevation: 0
    },
    render: Templates
}