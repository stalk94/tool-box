import { PromoBanner } from '@lib/index';
import React from 'react';

export function PromoBannerWrap() {
    const items = [
        {
            images: ['/uploads/pb-1747840618502-0.png?v=1747926095536'],
            title: <span>Title</span>,
            description: (
                <div>
                    custom editable{' '}
                    <span style={{ color: 'rgba(227, 24, 24, 1)' }}>
                        descriptidon{' '}
                    </span>
                    112
                </div>
            )
        },
        {
            images: ['/uploads/pb-1747840618502-1.png?v=1748479618872'],
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
                width: '100%',
                marginLeft: '0%'
            }}
        >
            <PromoBanner
                items={items}
                actionAreaEnabled={true}
                style={{ height: 290, width: '100%' }}
                button={{
                    variant: undefined,
                    color: undefined,
                    children: undefined
                }}
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
