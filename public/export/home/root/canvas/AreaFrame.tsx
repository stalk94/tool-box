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
                    id: 1749159596566,
                    type: 'click'
                })
            }
        >
            Button
        </Button>
    );
}

export default function AreaCanvas() {
    return (
        <>
            <ButtonWrap />
        </>
    );
}
