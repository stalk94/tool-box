import { CarouselHorizontal } from '@lib/index';
import React from 'react';

export function CarouselHorizontalWrap() {
    const items = [
        {
            type: 'video',
            src: '/uploads/hc-1747753796861-0.mp4?v=1747928464797'
        },
        {
            type: 'video',
            src: '/uploads/hc-1747753796861-1.mp4?v=1747922095312'
        },
        {
            type: 'image',
            src: '/uploads/hc-1747753796861-2.png?v=1747928468917'
        },
        {
            type: 'video',
            src: '/uploads/hc-1747753796861-3.mp4?v=1747919174305'
        },
        {
            type: 'image',
            src: '/uploads/hc-1747753796861-4.png?v=1747919152340'
        },
        {
            type: 'image',
            src: '/uploads/hc-1747753796861-5.png?v=1747919776830'
        }
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
        </>
    );
}
