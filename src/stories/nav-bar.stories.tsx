import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import NavBar from '../components/nav-bars/index';
import { IconButton } from '@mui/material';
import { AccountBox } from "@mui/icons-material";
import { Box } from '@mui/material';


const meta: Meta<typeof NavBar> = {
    title: 'Mains',
    component: NavBar,
    argTypes: {
       
    },
}
export default meta;

const Templates =(args)=> {
    const left =()=> (
        <Box
            component="img"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Meta-Logo.png/2560px-Meta-Logo.png" // Замените на ваш логотип
            alt="Logo"
            sx={{
                maxWidth: '100%',
                maxHeight: '50px',
                objectFit: 'contain',
                borderRadius: '3px'
            }}
        />
    );
    const right =()=> (
        <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            sx={{ ml: 1 }}
        >
            <AccountBox />
        </IconButton>
    );


    return(
        <div style={{margin:0, padding:0}}>
            <NavBar
                end={args.end && right()}
                start={args.start && left()}
                onChange={console.log}
            >
                
            </NavBar>
        </div>
    );
}


type Story = StoryObj<typeof NavBar>;
export const Navbar: Story = {
    args: {
        start: true,
        end: true
    },
    render: (props)=> <Templates {...props} />
}