import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import CardContent from '@mui/material/CardContent';
import { alpha, darken, lighten, Avatar, Button, CardActionArea, CardActions, CardHeader, CardMedia, IconButton, Typography, useTheme } from '@mui/material';
import Card from '../components/carts/base';



const meta: Meta<typeof Card> = {
    title: 'Panels',
    component: Card,
}

export default meta;


const MediaImage = ({ src, height, width }) => (
    <CardMedia
        component="img"
        height={height}
        width={width}
        image={src ?? "https://material-ui.com/static/images/cards/paella.jpg"}
        alt={(src && src.match(/\/([^\/]+\.[a-zA-Z0-9]+)$/)[1]) ?? "image"}
    />
);
const Content = ({ children, flexDirection }) => {

    return(
        <CardContent sx={{ display: 'flex', flexDirection: flexDirection ?? 'column' }}>
            { children }
        </CardContent>
    );
}
const Header =({ avatar, title, subheader, action, bcg })=> {
    const theme = useTheme();
   
    const getColor =()=> {
        if(bcg === 'dark') return {
            bgcolor: darken(theme.palette.background.paper, 0.1)
        }
        else if(bcg === 'light') return {
            bgcolor: lighten(theme.palette.background.paper, 0.1)    
        }
        else if(bcg === 'alpha') return {
            bgcolor: alpha(theme.palette.background.paper, 0.1)
        }
    }

    return(
        <CardHeader 
            sx={getColor()}
            avatar={avatar}
            title={title}
            subheader={subheader}
            action={action}
        />
    );
}


const Templates =(args)=> {
    
    return(
        <div style={{
            padding:'10%',
            height:'100%',
            paddingLeft: '10%'
        }}
        >
            <Card {...args} 
                
            />
        </div>
    );
}



export const Cards: StoryObj<typeof Card> = {
    args: {
        disabled: false,
    },
    render: Templates
}