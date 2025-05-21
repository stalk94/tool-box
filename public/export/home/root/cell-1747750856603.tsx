import { CarouselHorizontal } from '@lib/index';
import { Button } from '@mui/material';
import React from 'react';

export function CarouselHorizontalWrap() {
    const items = [
        { type: 'image', src: 'https://picsum.photos/seed/1/600/400' },
        { type: 'video', src: 'https://www.w3schools.com/html/mov_bbb.mp4' },
        { type: 'image', src: 'https://picsum.photos/seed/1/300/400' },
        { type: 'image', src: 'https://picsum.photos/seed/1/600/400' },
        { type: 'video', src: 'https://www.w3schools.com/html/mov_bbb.mp4' },
        { type: 'image', src: 'https://picsum.photos/seed/1/800/400' }
    ];

    return (
        <div
            style={{
                display: 'block',
                width: '100%',
                overflow: 'hidden',
                position: 'relative'
            }}
        >
            <CarouselHorizontal
                items={items}
                style={{}}
                slidesToShow={3}
                slidesToScroll={1}
                autoplay
                autoplayDelay={4000}
                width="100%"
                data-type="HorizontCarousel"
            />
        </div>
    );
}

export default function Cell() {
    return (
        <>
            <CarouselHorizontalWrap />

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
                        id: 1747771693460,
                        type: 'click'
                    })
                }
            >
                Button
            </Button>
        </>
    );
}
