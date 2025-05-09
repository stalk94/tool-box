import React from 'react'
import Card, { CardProps } from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Avatar, Button, CardActionArea, CardActions, CardHeader, IconButton, Typography, Box } from '@mui/material';
import { iconsList } from '../tools/icons';
import { MediaImage, FlexContent, Header } from './atomize';


export type BaseCardProps = CardProps & {
    children?: React.ReactNode | [typeof MediaImage | typeof FlexContent| typeof Header ],
    /** делает карточку кликабельной как кнопка */
    actionAreaEnabled?: boolean
    footer?: [],
    elevation?: number
}



export default function SimpleCard({ children, footer, style, ...props }: BaseCardProps) {
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
        <Card 
            component="div"
            elevation={props?.elevation ?? 1}  
            sx={{ 
                backgroundColor: (theme)=> theme.palette.card.main, 
                borderRadius: '5px',
                border: '1px solid',
                borderColor: (theme)=> theme.palette.card.border,
                ...props.sx
            }}
            style={{...style}}
        >

            { !children && getHeaderData() }
            { !children && getBody() }

            { props.actionAreaEnabled
                ? <CardActionArea>
                    { children }

                    {footer &&
                        <CardActions
                            sx={{
                                
                            }}
                        >
                            { footer }
                        </CardActions>
                    }
                 </CardActionArea>
                : <React.Fragment>
                    { children }

                    {footer &&
                        <CardActions
                            sx={{
                                 
                            }}
                        >
                            { footer }
                        </CardActions>
                    }
                </React.Fragment>
            }
        </Card>
    );
}