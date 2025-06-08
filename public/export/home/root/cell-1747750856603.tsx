import { Box, Button, Chip } from '@mui/material';
import { Accordion } from '@lib/index';
import React from 'react';
import SlotGrid_0 from './acordeonSlots/SlotGrid_0';
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
                    headerStyle={{}}
                    items={[
                        {
                            title: '・title-0',
                            content: <SlotGrid_0 />
                        },
                        {
                            title: '・titleg-1',
                            content: <SlotGrid_1 />
                        },
                        {
                            title: '・title-2678',
                            content: <div>not content</div>
                        }
                    ]}
                />
            </div>
        </>
    );
}
