import { Avatar, Button, Typography } from '@mui/material';
import { DateInput, TextInput } from '@lib/index';
import React from 'react';

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
        </>
    );
}
