import React from 'react';
import { Box, Typography, TypographyOwnProps } from '@mui/material';

type MarqueeTextProps = TypographyOwnProps & {

}


/**
 * Бегушая строка текст
 */
export const MarqueeText: React.FC = ({ children, variant, ...props }: MarqueeTextProps) => {
    return (
        <Box
            sx={{
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                position: 'relative',
                width: '100%',
            }}
        >
            <Typography
                { ...props }
                variant={variant ?? "body1"}
                component="div"
                sx={{
                    display: 'inline-block',
                    animation: 'marquee 4s linear infinite',
                    //fontFamily: '"Roboto Condensed", Arial, sans-serif',
                    ...props.sx
                }}
            >
                { children ?? 'Это пример бегущей строки с использованием Material-UI.' }
            </Typography>
            <style>
                {`
                    @keyframes marquee {
                        from {
                            transform: translateX(0%);
                        }
                        to {
                            transform: translateX(-100%);
                        }
                    }
                `}
            </style>
        </Box>
    );
}