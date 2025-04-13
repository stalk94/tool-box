import React from "react";
import { Button, IconButton } from '@mui/material';
import type { Meta, StoryObj } from "@storybook/react";
import { Delete, Done, Favorite, Send, Settings, Close, Add } from '@mui/icons-material';

const colors = ["secondary", "inherit", "primary", "success", "error", "info", "warning"];


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
        <div style={{width: '100%', height:'100%', display:'flex', flexDirection:'column'}}>
            <div style={{margin:'auto'}}>
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