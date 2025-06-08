import { CarouselVertical } from '@lib/index';
import React from 'react';

export function CarouselVerticalWrap() {
    const items = [
        { type: 'image', src: 'https://picsum.photos/seed/1/600/400' },
        {
            type: 'image',
            src: '/uploads/vc-1749310314466-1.png?v=1749331176276'
        },
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
                position: 'relative',
                height: 100
            }}
        >
            <CarouselVertical
                items={items}
                style={{}}
                height={100}
                data-parent="cell-1747227527273"
                slidesToShow={3}
                slidesToScroll={1}
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
