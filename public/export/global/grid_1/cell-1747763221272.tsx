import React from 'react';
import AreaFrame from './canvas/AreaFrame';

export default function Cell() {
    return (
        <>
            <div
                style={{
                    width: 653,
                    height: 590,
                    position: 'relative'
                }}
            >
                <AreaFrame />
            </div>
        </>
    );
}
