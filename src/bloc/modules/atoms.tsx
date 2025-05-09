import { Add } from '@mui/icons-material';
import { Button, Typography, Avatar, Box } from '@mui/material';
import Rating from '@mui/material/Rating';
import React from 'react';


type SimpleComponentFn = (...args: any) => React.JSX.Element;
export interface SimpleComponent {
    id: string;
    name: string;
    description?: string;
    props: Record<string, any>;
    render: SimpleComponentFn;
}




export const simpleComponents: Record<string, SimpleComponent> = {
    button: {
        id: 'button',
        name: 'Кнопка',
        props: {
            variant: ["text", "contained", "outlined"],
            size: ['medium', 'small', 'large'],
            onClick: '(e: React.MouseEvent<HTMLButtonElement, MouseEvent>)'
        },
        render: (props: Record<string, any>) => (
            <Button 
                variant="text" 
                size="small"
                {...props}
            />
        ),
    },
    rating: {
        id: 'rating',
        name: 'Ratings',
        props: {
            defaultValue: 'number',
            precision: 'number',
            max: 'number',
            size: ['medium', 'small', 'large'],
            onChange: '(value:number)'
        },
        render: (props: Record<string, any>) => (
            <Rating 
                defaultValue={2} 
                precision={1} 
                size={'medium'} 
                max={5}
                onChange={(e, v)=> props.onChange?.(v)}
                { ...props }
            />
        ),
    },
    avatar: {
        id: 'avatar',
        name: 'Аватар',
        props: {
            size: { width: 'number', height: 'number' },
            src: 'string',
            children: 'string',
            variant: ["circular", "rounded", "square"]
        },
        render: (props: Record<string, any>) => (
            <Avatar
                variant="circular"
                sx={{...props?.size}}
                {...props}
            />
        ),
    },
};

export const simpleCardFooter = {
    // для модуля комерции
    shop: {
        id: 'shop-footer',
        name: 'footer',
        propsList: {
            path: 'string',
            index: 'number',
            variant: ["text", "contained", "outlined"],
            size: ['medium', 'small', 'large'],
            max: 'number',
        },
        render: (props: Record<string, any>) => (
            <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', mb: 0.5 }}>
                <Box sx={{ p: 1 }}>
                    <Rating 
                        defaultValue={2} 
                        precision={1} 
                        size={props.size ?? 'medium'} 
                        max={props.max ?? 5}
                        onChange={(e, v)=> {
                            fetch('/api/component/card', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ rating: v, path: props.path})
                            })
                        }}
                    />
                </Box>
                <Box sx={{ ml: 'auto' }}>
                    <Button 
                        sx={{ m: 0.5 }} 
                        variant='outlined' 
                        size={props?.size}
                        onClick={()=> {
                            fetch('/api/component/card', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ addCart: props.index, path: props.path})
                            })
                        }}
                    >
                        add to cart
                    </Button>
                </Box>
            </Box>
        )
    },
}