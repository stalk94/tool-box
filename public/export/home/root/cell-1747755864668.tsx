import { PromoBanner } from '@lib/index';
import React from 'react';

export function PromoBannerWrap() {
    const items = [
        {
            images: [
                'https://placehold.co/600x400/353636/gray?text=Promoimage&font=roboto'
            ],
            title: <span>Title</span>,
            description: (
                <div>
                    custom editable{' '}
                    <span style={{ color: 'rgba(227, 24, 24, 1)' }}>
                        descriptidon{' '}
                    </span>
                    12
                </div>
            )
        },
        {
            images: [
                'https://placehold.co/600x400/353636/gray?text=PromoImage1&font=roboto'
            ],
            title: <span>Title</span>,
            description: <span>custom editable description</span>
        }
    ];

    return (
        <div
            style={{
                display: 'block',
                overflow: 'hidden',
                position: 'relative'
            }}
        >
            <PromoBanner
                items={items}
                actionAreaEnabled={true}
                style={{}}
                width="100%"
                data-type="PromoBanner"
                styles={{
                    dot: { size: '24', activeColor: 'rgba(30, 63, 222, 1)' }
                }}
            />
        </div>
    );
}

export default function Cell() {
    return (
        <>
            <PromoBannerWrap />
        </>
    );
}
