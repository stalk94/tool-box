import React from "react";
import { IconButton } from '@mui/material';
import type { Meta, StoryObj } from "@storybook/react";
import Buttons, { colors } from "../components/button";
import { Delete, Done, Favorite, Send, Settings, Close, Add } from '@mui/icons-material';
const Button = Buttons.Button;


const icons = {
    Delete: <Delete/>, 
    Done: <Done />, 
    Favorite: <Favorite/>, 
    Send: <Send/>, 
    Settings: <Settings/>, 
    Close: <Close/>, 
    Add: <Add/>
}
const meta: Meta = {
    title: 'Buttons',
    component: Button,
    parameters: {
        layout: "centered",
    },
    argTypes: {
        icon: {
            control: "select",
            options: ['none', ...Object.keys(icons)],
        }
    }
}
export default meta;


const Templates =(args)=> {
    return(
        <div>
            <div style={{marginBottom:'2%'}}>
                { colors.map((color, index)=>
                    <Button style={{margin:'5px'}} key={index} variant='contained' color={color} icon={icons[args.icon]}>
                        { color }
                    </Button>
                )}
                <Button disabled style={{margin:'5px'}} variant='contained' color='error' icon={icons[args.icon]}>
                    disabled
                </Button>
            </div>
            <div style={{marginBottom:'2%'}}>
                { colors.map((color, index)=>
                    <Button style={{margin:'5px'}} key={index} variant='outlined' color={color} icon={icons[args.icon]}>
                        { color }
                    </Button>
                )}
                <Button disabled style={{margin:'5px'}} variant='outlined' color='error' icon={icons[args.icon]}>
                    disabled
                </Button>
            </div>
            <div style={{marginBottom:'2%'}}>
                { colors.map((color, index)=>
                    <Button style={{margin:'5px'}} key={index} variant='text' color={color} icon={icons[args.icon]}>
                        { color }
                    </Button>
                )}
                <Button disabled style={{margin:'5px'}} variant='text' color='error' icon={icons[args.icon]}>
                    disabled
                </Button>
            </div>
            <div style={{marginBottom:'2%'}}>
                { Object.values(icons).map((elem, index)=> 
                    <IconButton key={index}
                        style={{margin:'5px'}} 
                        color="success"
                    >
                        { elem }
                    </IconButton>
                )}
            </div>
        </div>
    );
}


type Story = StoryObj;
export const PageButtons: Story = {
    args: {
        icon: 'none'
    },
    render: (props)=> <Templates {...props} />
}