import { Avatar, Button, Tab, Tabs, Typography } from '@mui/material';
import { DateInput, TextInput } from '@lib/index';
import React from 'react';
import ONE2 from './tabsSlots/ONE2';
import TWO1 from './tabsSlots/TWO1';

export function TabNavigation() {
    const [curent, setCurent] = React.useState(0);
    const slots = [<ONE2 />, <TWO1 />, <div>not content</div>];

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
                <Tab key={0} label={'ONE2'} />

                <Tab key={1} label={'TWO1'} />

                <Tab key={2} label={'three'} />
            </Tabs>
            <div>{slots[curent]}</div>
        </div>
    );
}

export default function Cell() {
    return (
        <>
            <Avatar
                sx={{
                    width: 65,
                    height: 65,
                    bgColor: 'gray'
                }}
                src={'https://mui.com/static/images/avatar/3.jpg'}
                style={{}}
                data-type="Avatar"
            >
                undefined
            </Avatar>

            <Button
                startIcon={undefined}
                endIcon={undefined}
                style={{}}
                variant="outlined"
                color="primary"
                data-type="Button"
                onClick={() =>
                    sharedEmmiter.emit('event', {
                        id: 1747254467189,
                        type: 'click'
                    })
                }
            >
                Button
            </Button>

            <Typography
                sx={{
                    width: '100%',
                    display: 'block',
                    fontSize: 'undefinedpx'
                }}
                style={{
                    display: 'flex'
                }}
                variant="h5"
                data-type="Typography"
            >
                Заголовокhh
            </Typography>

            <div
                style={{
                    width: '100%',
                    display: 'block'
                }}
            >
                <DateInput
                    left={undefined}
                    style={{
                        fontSize: 14
                    }}
                    onChange={v => console.log(v)}
                    styles={{}}
                    label="label"
                    position="column"
                    type="time"
                    styles={{}}
                    data-type="Time"
                />
            </div>

            <div
                style={{
                    width: '100%',
                    display: 'block'
                }}
            >
                <TextInput
                    left={undefined}
                    style={{
                        fontSize: 14
                    }}
                    onChange={v => console.log(v)}
                    styles={{}}
                    label="label"
                    position="column"
                    placeholder="ввод"
                    divider="none"
                    data-type="TextInput"
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
                        id: 1747257380179,
                        type: 'click'
                    })
                }
            >
                Button
            </Button>

            <TabNavigation />
        </>
    );
}
