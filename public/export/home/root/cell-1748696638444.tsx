import { PromoBanner } from '@lib/index';
import React from 'react';

export function PromoBannerWrap() {
    const items = [
        {
            images: [
                'https://placehold.co/600x400/353636/gray?text=Promoimage&font=roboto'
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
                position: 'relative',
                width: '100%'
            }}
        >
            <PromoBanner
                items={items}
                actionAreaEnabled={true}
                style={{ height: 315, width: '100%' }}
                button={{
                    variant: 'outlined',
                    color: 'primary',
                    children: 'go to'
                }}
                width="100%"
                data-type="PromoBanner"
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
