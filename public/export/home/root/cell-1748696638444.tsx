import { CarouselHorizontal } from '@lib/index';
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
                data-parent="cell-1748696638444"
                slidesToScroll={1}
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

            <CarouselHorizontalWrap />
        </>
    );
}
