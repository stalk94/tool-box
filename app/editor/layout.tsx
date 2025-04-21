'use client';
import React from 'react';



export default function EditorLayout({ children }) {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                height: '100%'
            }}
        >
            { children }
        </div>
    );
}