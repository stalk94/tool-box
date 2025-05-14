import { Box, Button, Chip, Tab, Tabs } from '@mui/material';
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
                    headerStyle={{
                        paddingLeft: '19'
                    }}
                    items={[
                        {
                            title: '・tesgt-1',
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

            <Button
                startIcon={undefined}
                endIcon={undefined}
                style={{}}
                variant="outlined"
                color="primary"
                fullWidth
                data-type="Button"
                onClick={() =>
                    sharedEmmiter.emit('event', {
                        id: 1747181280409,
                        type: 'click'
                    })
                }
            >
                Button
            </Button>

            <div
                style={{
                    width: '100%',
                    display: 'block'
                }}
            >
                <Tabs
                    value={0}
                    onChange={(
                        event: React.SyntheticEvent,
                        newValue: number
                    ) => {
                        console.log(newValue);
                    }}
                    variant="scrollable"
                    scrollButtons={true}
                    allowScrollButtonsMobile={true}
                    textColor={undefined}
                    aria-label="tabs"
                >
                    <Tab key={0} label={'one'} />

                    <Tab key={1} label={'two'} />

                    <Tab key={2} label={'THREE'} />
                </Tabs>
            </div>
        </>
    );
}
