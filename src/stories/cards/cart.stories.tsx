import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import CardContent from '@mui/material/CardContent';
import { Avatar, Button,  IconButton, Typography, useTheme, TypographyProps } from '@mui/material';
import Card from '../../components/carts/base';
import { Header, MediaImage } from '../../components/carts/atomize';


const typographyColors: TypographyProps['color'][] = [
    'inherit',
    'primary',
    'secondary',
    'error',
    'info',
    'success',
    'warning',
    'text.primary',
    'text.secondary',
    'text.disabled',
];
const typographyVariants: TypographyProps['variant'][] = [
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'subtitle1',
    'subtitle2',
    'body1',
    'body2',
    'caption',
    'button',
    'overline',
    'inherit',
];
const meta: Meta<typeof Card> = {
    title: 'Cards',
    component: Card,
    argTypes: {
        color: {
            control: 'select',
            options: [...typographyColors],
            description: 'Варианты цветов текста. Можно передать цвет напрямую',
        },
        variant: {
            control: 'select',
            options: [...typographyVariants],
            description: 'Варианты типов текста',
        }
    }
}

export default meta;



const Templates =(args)=> {
    
    return(
        <div style={{
            padding:'10%',
            height:'100%',
            paddingLeft: '10%'
        }}
        >
            <Card {...args} 
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
                        height={args.imageHeight}
                        src={args.imageSrc}
                    />,
                    <CardContent key='content'>
                        <Typography variant={args.variant} color={args.color ?? "text.secondary"}>
                            { args.text }
                        </Typography>
                    </CardContent>
                ]}
                
                footer={[
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
            />
        </div>
    );
}



export const Simple: StoryObj<typeof Card> = {
    args: {
        text: 'This impressive paella is a perfect party dish and a fun meal to coo together with your guests. Add 1 cup of frozen peas along with the mussels,if you like.',
        color: 'text.secondary',
        variant: 'body2',
        imageHeight: 300,
        imageSrc: 'https://www.industrialempathy.com/img/remote/ZiClJf-1920w.jpg',
        actionAreaEnabled: false
    },
    render: Templates
}