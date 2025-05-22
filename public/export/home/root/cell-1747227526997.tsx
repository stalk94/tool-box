import { Box, Button, Chip } from '@mui/material';
import { Accordion } from '@lib/index';
import React from 'react';

export default function Cell() {
    return (
        <>
            <div
                style={{
                    width: '100%',
                    display: 'block'
                }}
            >
                <Accordion
                    activeIndexs={[]}
                    tabStyle={{}}
                    headerStyle={{}}
                    items={[
                        {
                            title: '・title-0',
                            content: <div>not content</div>
                        }
                    ]}
                />
            </div>
        </>
    );
}
