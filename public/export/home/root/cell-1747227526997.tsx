import { Tab, Tabs } from '@mui/material';
import React from 'react';
import One from './tabsSlots/one';

export function TabNavigation() {
    const [curent, setCurent] = React.useState(0);
    const slots = [<One />, <div>not content</div>, <div>not content</div>];

    return (
        <div style={{ width: '100%', display: 'block' }}>
            <Tabs
                value={curent}
                onChange={(event: React.SyntheticEvent, newValue: number) => {
                    setCurent(newValue);
                }}
                variant="scrollable"
                scrollButtons={true}
                allowScrollButtonsMobile={true}
                textColor={undefined}
                aria-label="tabs"
            >
                <Tab key={0} label={'one'} />

                <Tab key={1} label={'two'} />

                <Tab key={2} label={'three'} />
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
