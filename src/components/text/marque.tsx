import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, TypographyOwnProps } from '@mui/material';


export type MarqueeTextProps = TypographyOwnProps & {
    speed?: number;
    direction?: 'left' | 'right';
    children: string | React.ReactNode
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

/** 
 * адаптивный текст, если не помешается в строку то бегушая строка будет 
 */
export const MarqueeAdaptive: React.FC<MarqueeTextProps> = ({
    children, 
    speed = 50, 
    variant = 'body1', 
    direction = 'right', 
    ...props 
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const isMounted = useRef(false);
    const [shouldScroll, setShouldScroll] = useState(false);


    const scrollAnimation = (textWidth: number, speed: number) => {
        const duration = textWidth / speed; // px / (px/sec) = sec
        return `marquee ${duration}s`;
    }
    useEffect(() => {
        if(isMounted.current) {
            const checkOverflow = () => {
                if (containerRef.current && textRef.current) {
                    const isOverflowing = textRef.current.scrollWidth > containerRef.current.offsetWidth;
                    setShouldScroll(isOverflowing);
                }
            };

            checkOverflow();

            const resizeObserver = new ResizeObserver(checkOverflow);
            if (containerRef.current) resizeObserver.observe(containerRef.current);

            return () => resizeObserver.disconnect();
        }
        else isMounted.current = true;
    }, []);

    const keyframeName = direction === 'left' ? 'marquee-left' : 'marquee-right';
    const duration = (textRef.current?.scrollWidth || 0) / speed;

    return (
        <Box
            ref={containerRef}
            sx={{
                ...props.sx,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                position: 'relative',
                width: '100%',
            }}
        >
            <Typography
                ref={textRef}
                variant={variant}
                component="div"
                { ...props }
                sx={{
                    display: 'inline-block',
                    willChange: shouldScroll ? 'transform' : undefined,
                    animation: shouldScroll ? `${keyframeName} ${duration}s linear infinite` : 'none',
                    ...props.sx,
                }}
            >
                { children }
            </Typography>
            <style>
                {`
                    @keyframes marquee-left {
                        0% { transform: translateX(100%); }
                        100% { transform: translateX(-100%); }
                    }

                    @keyframes marquee-right {
                        0% { transform: translateX(-100%); }
                        100% { transform: translateX(100%); }
                    }
                `}
            </style>
        </Box>
    );
}