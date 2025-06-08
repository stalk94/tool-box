import { Tab, Tabs } from '@mui/material';
import React from 'react';
import ONE from './tabsSlots/ONE';
import THREE3 from './tabsSlots/THREE3';

export function TabNavigation() {
    const [curent, setCurent] = React.useState(0);
    const slots = [<ONE />, <div>not content</div>, <THREE3 />];

    return (
        <div
            style={{
                width: '100%',
                height: 100,
                display: 'flex',
                flexDirection: 'row',
                flexGrow: 1,
                flexShrink: 1,
                flexBasis: 0,
                minWidth: 0,
                minHeight: 0
            }}
        >
            <Tabs
                value={curent}
                onChange={(event: React.SyntheticEvent, newValue: number) => {
                    setCurent(newValue);
                }}
                orientation={'vertical'}
                variant={'standard'}
                scrollButtons={true}
                allowScrollButtonsMobile={true}
                aria-label="tabs"
                sx={{
                    maxWidth: '30%',
                    '& .MuiTabs-indicator': {
                        backgroundColor: '#f44336'
                    }
                }}
            >
                <Tab
                    sx={{
                        margin: 'auto',
                        textAlign: 'center',
                        whiteSpace: 'normal',
                        wordBreak: 'keep-all',
                        overflowWrap: 'normal',
                        color: '#ce93d8',
                        '&.Mui-selected': {
                            color: '#f44336'
                        }
                    }}
                    key={0}
                    label={'ONE'}
                />

                <Tab
                    sx={{
                        margin: 'auto',
                        textAlign: 'center',
                        whiteSpace: 'normal',
                        wordBreak: 'keep-all',
                        overflowWrap: 'normal',
                        color: '#ce93d8',
                        '&.Mui-selected': {
                            color: '#f44336'
                        }
                    }}
                    key={1}
                    label={'TWO'}
                />

                <Tab
                    sx={{
                        margin: 'auto',
                        textAlign: 'center',
                        whiteSpace: 'normal',
                        wordBreak: 'keep-all',
                        overflowWrap: 'normal',
                        color: '#ce93d8',
                        '&.Mui-selected': {
                            color: '#f44336'
                        }
                    }}
                    key={2}
                    label={'THREE3'}
                />
            </Tabs>
            <div>{slots[curent]}</div>
        </div>
    );
}

export default function Cell() {
    return (
        <>
            <TabNavigation />
        </>
    );
}
