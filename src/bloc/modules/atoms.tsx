import { Add } from '@mui/icons-material';
import { Button, Typography, Avatar } from '@mui/material';
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