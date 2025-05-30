import { IconButton } from '@mui/material';
import React from 'react';

export default function Cell() {
    return (
        <>
            <IconButton
                style={{}}
                onClick={() =>
                    sharedEmmiter.emit('event', {
                        id: 1748534707192,
                        type: 'click'
                    })
                }
                color="default"
                data-type="IconButton"
            >
                <svg
                    class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1umw9bq-MuiSvgIcon-root"
                    focusable="false"
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    data-testid="ArrowBackIcon"
                >
                    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20z"></path>
                </svg>
            </IconButton>
        </>
    );
}
