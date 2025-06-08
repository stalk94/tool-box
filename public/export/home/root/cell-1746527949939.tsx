import { Tab, Tabs } from '@mui/material';
import React from 'react';
import ONE from './tabsSlots/ONE';
import ВВВВ3 from './tabsSlots/ВВВВ3';

export function TabNavigation() {
    const [curent, setCurent] = React.useState(0);
    const slots = [<ONE />, <div>not content</div>, <ВВВВ3 />];

    return (
        <div
            style={{
                width: '100%',
                height: 415,
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
                orientation={vertical}
                variant={standard}
                scrollButtons={true}
                allowScrollButtonsMobile={true}
                aria-label="tabs"
                sx={{
                    maxWidth: false ? '100%' : '30%',
                    '& .MuiTabs-indicator': {
                        backgroundColor: #f44336
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
                        color: #ce93d8,
                        '&.Mui-selected': {
                            color: #f44336
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
                        color: #ce93d8,
                        '&.Mui-selected': {
                            color: #f44336
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
                        color: #ce93d8,
                        '&.Mui-selected': {
                            color: #f44336
                        }
                    }}
                    key={2}
                    label={'ВВВВ3'}
                />
            </Tabs>
            <div>{slots[curent]}</div>
        </div>
    );
}

export function TabNavigation() {
    const [curent, setCurent] = React.useState(0);
    const slots = [<ONE />, <div>not content</div>, <ВВВВ3 />];

    return (
        <div
            style={{
                width: '100%',
                height: 415,
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
                orientation={vertical}
                variant={standard}
                scrollButtons={true}
                allowScrollButtonsMobile={true}
                aria-label="tabs"
                sx={{
                    maxWidth: false ? '100%' : '30%',
                    '& .MuiTabs-indicator': {
                        backgroundColor: #f44336
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
                        color: #ce93d8,
                        '&.Mui-selected': {
                            color: #f44336
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
                        color: #ce93d8,
                        '&.Mui-selected': {
                            color: #f44336
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
                        color: #ce93d8,
                        '&.Mui-selected': {
                            color: #f44336
                        }
                    }}
                    key={2}
                    label={'ВВВВ3'}
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

            <TabNavigation />
        </>
    );
}
