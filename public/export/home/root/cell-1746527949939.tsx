import {
    Avatar,
    BottomNavigation,
    BottomNavigationAction,
    Button,
    Paper,
    Typography
} from '@mui/material';
import { DateInput, TextInput } from '@lib/index';
import { Add, Home } from '@mui/icons-material';
import React from 'react';

export function BottomNavigationWrap() {
    const [curent, setCurent] = React.useState(0);
    const items = [
        { id: 'BottomNavigation-0', icon: <Home />, label: 'home' },
        { id: 'BottomNavigation-1', icon: <Add />, label: 'add' },
        { id: 'BottomNavigation-2', icon: <Add />, label: 'test' }
    ];

    const handleChange = (e: React.SyntheticEvent, newValue: number) => {
        setCurent(newValue);
    };

    return (
        <Paper
            style={{
                width: '100%',
                position: 'sticky',
                bottom: 0,
                border: '1px'
            }}
            elevation={1}
            data-type="BottomNav"
        >
            <BottomNavigation
                style={{}}
                showLabels={false}
                value={curent}
                onChange={handleChange}
            >
                {items &&
                    items.map((elem, index: number) => (
                        <BottomNavigationAction
                            key={index}
                            label={
                                false && (
                                    <span style={{ fontSize: 16 }}>
                                        {elem.label}
                                    </span>
                                )
                            }
                            icon={elem.icon ? elem.icon : undefined}
                            sx={{
                                '& .MuiSvgIcon-root': {
                                    fontSize: 24
                                }
                            }}
                        />
                    ))}
            </BottomNavigation>
        </Paper>
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
                color="error"
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

            <Button
                startIcon={undefined}
                endIcon={undefined}
                style={{}}
                variant="outlined"
                color="success"
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

            <BottomNavigationWrap />
        </>
    );
}
