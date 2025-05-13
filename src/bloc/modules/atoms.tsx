import { Add } from '@mui/icons-material';
import { Button, Typography, Avatar, Box } from '@mui/material';
import Rating from '@mui/material/Rating';
import React from 'react';
import { toJSXProps } from './export/Inputs';


type SimpleComponentFn = (...args: any) => React.JSX.Element;
export interface SimpleComponent {
    id: string;
    name: string;
    description?: string;
    propsList: Record<string, any>;
    render: SimpleComponentFn;
    degidratation: (props: Record<string, any>)=> void
}




export const simpleComponents: Record<string, SimpleComponent> = {
    rating: {
        id: 'rating',
        name: 'Ratings',
        propsList: {
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
        degidratation: (props) => {
            return({
                imports: [
                    `import Rating from '@mui/material/Rating';`
                ],
                body: `
                    <Rating 
                        ${ toJSXProps(props) }
                    />
                `
            });
        }
    },
    avatar: {
        id: 'avatar',
        name: 'Аватар',
        propsList: {
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
        degidratation: (props) => {
            return({
                imports: [
                    `import Avatar from '@mui/material/Avatar';`
                ],
                body: `
                    <Avatar 
                        ${ toJSXProps(props) }
                    />
                `
            });
        }
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