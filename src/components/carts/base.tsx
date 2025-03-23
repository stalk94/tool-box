import React from 'react'
import Card, { CardProps } from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Avatar, Button, CardActionArea, CardActions, CardHeader, IconButton, Typography } from '@mui/material';
import { alpha, darken, lighten, styled, useTheme } from '@mui/system';
import { iconsList } from '../tools/icons';


type Props = {
    children?: [],
    footer?: [],
}



export default function SimpleCard({ children, footer, ...props }: CardProps & Props) {
    const getIcon =(name: string, color?: string)=> {
        const IconComponent = iconsList[name];

        if(IconComponent) return(
            <IconButton 
                sx={{ 
                    color,
                    '&:hover': {
                        //color: lighten(color, 0.25),
                        mixBlendMode: 'screen'
                    }
                }} 
                aria-label={name}
            >
                <IconComponent />
            </IconButton>
        );
    }
    const getHeaderData =()=> {
        return(
            <CardHeader { ...{
                avatar: [
                    <Avatar sx={{ bgcolor: '#f05c5c' }} aria-label="action">
                        R
                    </Avatar>
                ],
                title:"Shrimp and Chorizo Paella",
                subheader: "September 14, 2016",
                action: [
                    getIcon('Favorite', '#f05c5c'), 
                    getIcon('Delete')
                ]
            }}
            />
        );
    }
    const getBody =()=> {
        return(
            <CardContent>
                <Typography variant="body2" color="text.secondary">
                    This impressive paella is a perfect party dish and a fun meal to cook
                    together with your guests. Add 1 cup of frozen peas along with the mussels,
                    if you like.
                </Typography>
            </CardContent>
        );
    }
    
    
    return (
        <Card elevation={1}
            { ...props }
            sx={{ 
                backgroundColor: (theme)=> alpha(theme.palette.background.navBar, 0.1), 
                borderRadius: '5px',
                border: '1px solid',
                borderColor: 'action.active',
                boxShadow: '0 3px 4px rgba(0, 0, 0, 0.2)',
                ...props.sx
            }}
        >

            { !children && getHeaderData() }
            { !children && getBody() }
            
            <CardActions 
                sx={{ 
                    //borderTop: '1px dotted gray' 
                }}
            >
                { footer ??
                    <Button size="small" color="primary">
                        Share
                    </Button>
                }
            </CardActions>
        </Card>
    );
}