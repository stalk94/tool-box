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
                    headerStyle={{}}
                    items={[
                        {
                            title: '・test-1',
                            content: <div>not content</div>
                        },
                        {
                            title: (
                                <Box
                                    sx={{
                                        ml: 1.5
                                    }}
                                >
                                    ・test-1
                                </Box>
                            ),
                            content: <SlotGrid_1 />
                        }
                    ]}
                />
            </div>
        </>
    );
}
