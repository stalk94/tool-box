import { Button } from '@mui/material';
import React from 'react';

export default function Cell() {
    return (
        <>
            <Button
                startIcon={undefined}
                endIcon={undefined}
                style={{}}
                variant="outlined"
                color="error"
                fullWidth
                data-type="Button"
                onClick={() =>
                    sharedEmmiter.emit('event', {
                        id: 1747448022712,
                        type: 'click'
                    })
                }
            >
                Button
            </Button>
        </>
    );
}
