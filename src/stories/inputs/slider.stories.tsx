import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Slider from '../../components/input/slider';
import VolumeUp from '@mui/icons-material/VolumeUp';



const meta: Meta<typeof Slider> = {
    title: 'Inputs',
    component: Slider,
    argTypes: {
    },
}
export default meta;


const Templates =(args)=> {
    const marks = [
        {
            value: 0,
            label: '0°C',
        },
        {
            value: 20,
            label: '20°C',
        },
        {
            value: 37,
            label: '37°C',
        },
        {
            value: 100,
            label: '100°C',
        },
    ];
  

    return(
        <div style={{margin:'20%'}}>
            <Slider
                { ...args }
                start={args.start && <VolumeUp />}
                onChange={console.log}
                value={args.diapasone && [1, 20]}
                marks={args.mark && marks}
                step={args.markStep ? null : (args.step ?? 1)}
            />
        </div>
    );
}


type Story = StoryObj<typeof Slider>;
export const Sliders: Story = {
    args: {
        disabled: false,
        step: 1,
        mark: false,
        markStep: false,
        diapasone: false,
        start: true,
        end: true
    },
    render: (props)=> <Templates {...props} />
}