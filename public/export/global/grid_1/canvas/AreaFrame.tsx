import React from 'react';
import { Button } from '@mui/material';

export function ButtonWrap() {
    return (
        <Button
            startIcon={undefined}
            endIcon={undefined}
            style={{
                x: 0,
                y: 0,
                position: 'absolute',
                top: '0%',
                left: '0%',
                width: undefined,
                height: undefined,
                zIndex: 0
            }}
            sx={{ whiteSpace: 'nowrap' }}
            variant="outlined"
            color="primary"
            fullWidth
            data-type="Button"
            onClick={() =>
                sharedEmmiter.emit('event', {
                    id: 1748739904991,
                    type: 'click'
                })
            }
        >
            Button
        </Button>
    );
}

export function ButtonWrap_1() {
    return (
        <Button
            startIcon={undefined}
            endIcon={undefined}
            style={{
                x: 0,
                y: 52.9375,
                position: 'absolute',
                top: '8.897058823529411%',
                left: '0%',
                width: undefined,
                height: undefined,
                zIndex: 52.9375
            }}
            sx={{ whiteSpace: 'nowrap' }}
            variant="outlined"
            color="primary"
            fullWidth
            data-type="Button"
            onClick={() =>
                sharedEmmiter.emit('event', {
                    id: 1748739905834,
                    type: 'click'
                })
            }
        >
            Button
        </Button>
    );
}

export default function Test() {
    return (
        <>
            <ButtonWrap />
            <ButtonWrap_1 />
        </>
    );
}
