import React from 'react';
import CustomFrame from './frames/CustomFrame';

export default function Cell() {
    return (
        <>
            <div
                style={{
                    width: '100%',
                    display: 'block'
                }}
            >
                <CustomFrame />
            </div>
        </>
    );
}
