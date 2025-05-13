import React from 'react';

export default function Cell() {
    return (
        <>
            <div
                style={{
                    width: '100%',
                    justifyContent: 'flex-start',
                    fontStyle: 'normal',
                    textAlign: 'left',
                    fontFamily: 'Roboto'
                }}
            >
                <span>
                    <span style={{ fontSize: '1rem' }}>
                        <span
                            style={{
                                fontFamily:
                                    'Roboto Condensed", Arial, sans-serif'
                            }}
                        >
                            Title{' '}
                        </span>
                    </span>
                </span>
                <span style={{ color: 'rgba(226, 51, 51, 1)' }}>
                    <span style={{ fontSize: '1rem' }}>
                        <span
                            style={{
                                fontFamily:
                                    'Roboto Condensed", Arial, sans-serif'
                            }}
                        >
                            yyy
                        </span>
                    </span>
                </span>
            </div>
        </>
    );
}
