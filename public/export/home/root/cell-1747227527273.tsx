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
                            title: (
                                <Box
                                    sx={{
                                        ml: 1.5
                                    }}
                                >
                                    ・test-1
                                </Box>
                            ),
                            content: (
                                <Box
                                    sx={{
                                        m: 3
                                    }}
                                >
                                    content
                                </Box>
                            )
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
                            content: (
                                <Box
                                    sx={{
                                        m: 3
                                    }}
                                >
                                    content
                                </Box>
                            )
                        },
                        {
                            title: (
                                <Box
                                    sx={{
                                        ml: 1.5
                                    }}
                                >
                                    ・test-2
                                </Box>
                            ),
                            content: (
                                <Box
                                    sx={{
                                        m: 3
                                    }}
                                >
                                    content
                                </Box>
                            )
                        },
                        {
                            title: (
                                <Box
                                    sx={{
                                        ml: 1.5
                                    }}
                                >
                                    ・test-3
                                </Box>
                            ),
                            content: (
                                <Box
                                    sx={{
                                        m: 3
                                    }}
                                >
                                    content
                                </Box>
                            )
                        }
                    ]}
                />
            </div>
        </>
    );
}
