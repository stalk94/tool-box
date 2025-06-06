import { CarouselVertical } from '@lib/index';
import React from 'react';

export function CarouselVerticalWrap() {
    const items = [
        {
            type: 'image',
            src: '/uploads/vc-1747753800232-0.png?v=1748969014443'
        },
        { type: 'video', src: 'https://www.w3schools.com/html/mov_bbb.mp4' },
        {
            type: 'image',
            src: '/uploads/vc-1747753800232-2.png?v=1748458010463'
        },
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
                position: 'relative',
                height: 515
            }}
        >
            <CarouselVertical
                items={items}
                style={{}}
                height={515}
                slidesToShow={3}
                slidesToScroll={1}
                autoplay
                autoplayDelay={4000}
                data-type="VerticalCarousel"
            />
        </div>
    );
}

export default function Cell() {
    return (
        <>
            <CarouselVerticalWrap />
        </>
    );
}
