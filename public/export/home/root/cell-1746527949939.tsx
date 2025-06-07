import React from 'react';
import AreaFrame from './canvas/AreaFrame';

export default function Cell() {
    return (
        <>
            <div
                style={{
                    width: 466,
                    height: 415,
                    position: 'relative'
                }}
            >
                <AreaFrame />
            </div>
        </>
    );
}
