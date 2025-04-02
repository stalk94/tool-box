import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Promo from '../../components/carousel/promo';


const meta: Meta<typeof Promo> = {
    title: 'Carousel',
    component: Promo,
    // tags: ["autodocs"],
    argTypes: {
       
    },
}


const Templates =(args)=> {
 
    return(
        <div>
            <Promo />
        </div>
    );
}



type Story = StoryObj<typeof Promo>;
export default meta;
export const PromoBlok: Story = {
    args: {
        
    },
    render: (props)=> <Templates {...props} />
}