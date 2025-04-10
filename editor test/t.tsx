import React, { useState, useEffect, useRef } from 'react';
import { Typography } from '@mui/material';
import { useNode } from '@craftjs/core';

export const TypographyComponent = ({ children = 'Заголовок', variant = 'h4', ...props }) => {
    const { connectors: { connect, drag } } = useNode();

    return (
        <Typography
            ref={ref => ref && connect(drag(ref))}
            variant={variant}
            {...props}
        >
            { children }
        </Typography>
    );
};

TypographyComponent.craft = {
    displayName: 'MUI Typography',
    props: {
        children: 'Заголовок',
        variant: 'h4',
    },
}