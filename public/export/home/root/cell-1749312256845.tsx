import { PromoBanner } from '@lib/index';
import React from 'react';

export function PromoBannerWrap() {
    const items = [
        {
            images: ['/uploads/pb-1749312273072-0.png?v=1749331162669'],
            title: <div>Titlegg</div>,
            description: (
                <div>
                    custom edi
                    <span style={{ color: 'rgba(149, 97, 97, 1)' }}>
                        <em>tablffe</em>
                    </span>{' '}
                    descrieption
                </div>
            )
        },
        {
            images: ['/uploads/pb-1749312273072-1.jpg?v=1749331167741'],
            title: <span>Title</span>,
            description: <span>custom editable description</span>
        },
        {
            images: [
                'https://placehold.co/600x400/353636/gray?text=PromoImage2&font=roboto'
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
                style={{ height: 100, width: '100%' }}
                button={{
                    variant: 'outlined',
                    color: 'primary',
                    children: 'go to ttt'
                }}
                data-parent="cell-1749312256845"
                width="100%"
                data-type="PromoBanner"
            />
        </div>
    );
}

export function PromoBannerWrap() {
    const items = [
        {
            images: ['/uploads/pb-1749312273072-0.png?v=1749331162669'],
            title: <div>Titlegg</div>,
            description: (
                <div>
                    custom edi
                    <span style={{ color: 'rgba(149, 97, 97, 1)' }}>
                        <em>tablffe</em>
                    </span>{' '}
                    descrieption
                </div>
            )
        },
        {
            images: ['/uploads/pb-1749312273072-1.jpg?v=1749331167741'],
            title: <span>Title</span>,
            description: <span>custom editable description</span>
        },
        {
            images: [
                'https://placehold.co/600x400/353636/gray?text=PromoImage2&font=roboto'
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
                style={{ height: 100, width: '100%' }}
                button={{
                    variant: 'outlined',
                    color: 'primary',
                    children: 'go to ttt'
                }}
                data-parent="cell-1749312256845"
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

            <PromoBannerWrap />
        </>
    );
}
