import { Box, Button, Chip } from '@mui/material';
import { Accordion } from '@lib/index';
import React from 'react';
import SlotGrid_1 from './acordeonSlots/SlotGrid_1';

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
                    headerStyle={{
                        fontSize: '12',
                        paddingLeft: '7'
                    }}
                    items={[
                        {
                            title: '・title-0',
                            content: <div>not content</div>
                        },
                        {
                            title: '・title-1',
                            content: <SlotGrid_1 />
                        }
                    ]}
                />
            </div>
        </>
    );
}
