import React from 'react';
import CardContent from '@mui/material/CardContent';
import { Avatar, Button,  IconButton, Typography, useTheme, TypographyProps } from '@mui/material';
import Card, { Props } from './base';
import { Header, MediaImage } from './atomize';



export default function ({ ...props }: Props) {
    return(
        <Card {...props}
            children={[
                <Header key='header'
                    avatar={
                        <Avatar sx={{ bgcolor: '#f05c5c' }} aria-label="action">
                            R
                        </Avatar>
                    }
                    title='Shrimp and Chorizo Paella'
                    subheader='September 14, 2016'
                    action={
                        <Button>
                            x
                        </Button>
                    }
                />,
                <MediaImage key='img'
                    height={props.imageHeight}
                    src={props.imageSrc}
                />,
                <CardContent key='content'>
                    <Typography 
                        variant={props.variant} 
                        color={props.color ?? "text.secondary"}
                    >
                        { props.text }
                    </Typography>
                </CardContent>
            ]}
        />
    );
}

/** 
 *  footer={[
                <Button key='btn1' size="small" variant='outlined' color="info">
                    small
                </Button>,
                <Button key='btn2' size="medium" variant='contained' color="success">
                    medium
                </Button>,
                <Button key='btn3' size="large" color="secondary">
                    large
                </Button>
            ]}
 */