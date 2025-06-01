import { List } from '@lib/index';
import { Button } from '@mui/material';
import React from 'react';

export function ListWrap() {
    const items = [
        {
            startIcon: (
                <svg
                    class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1umw9bq-MuiSvgIcon-root"
                    focusable="false"
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    data-testid="HomeIcon"
                >
                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path>
                </svg>
            ),
            primary: <span>home</span>,
            secondary: undefined
        }
    ];

    return (
        <div style={{ width: '100%' }}>
            <List onClick={undefined} items={items} />
        </div>
    );
}

export default function Cell() {
    return (
        <>
            <ListWrap />

            <Button
                startIcon={undefined}
                endIcon={undefined}
                style={{}}
                sx={{
                    whiteSpace: 'nowrap'
                }}
                variant="outlined"
                color="primary"
                fullWidth
                data-type="Button"
                onClick={() =>
                    sharedEmmiter.emit('event', {
                        id: 1748709902998,
                        type: 'click'
                    })
                }
            >
                Button
            </Button>
        </>
    );
}
