import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@mui/material';
import { useNode } from '@craftjs/core';



export const ButtonComponent = ({ children, ...props }) => {
    const { connectors: { connect, drag } } = useNode();

    return (
        <Button
            ref={ref => ref && connect(drag(ref))}
            variant="contained"
            {...props}
        >
            { children ?? 'Кнопка' }
        </Button>
    );
};

ButtonComponent.craft = {
    displayName: 'MUI Button',
    props: {
        children: 'Нажми меня',
    },
}