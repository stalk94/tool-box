import { Avatar, Button, Rating, Typography } from '@mui/material';
import { List } from '@lib/index';
import React from 'react';

export function ListWrap() {
    const items = [
        {
            startIcon: (
                <svg
                    class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1umw9bq-MuiSvgIcon-root"
                    focusable="false"
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    data-testid="CloseIcon"
                >
                    <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
                </svg>
            ),
            primary: (
                <div style={{ textAlign: 'left' }}>
                    primar
                    <span style={{ color: 'rgba(0, 57, 255, 1)' }}>ydd</span>
                </div>
            ),
            secondary: undefined
        },
        {
            startIcon: (
                <svg
                    class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1umw9bq-MuiSvgIcon-root"
                    focusable="false"
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    data-testid="NotificationsIcon"
                >
                    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2m6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1z"></path>
                </svg>
            ),
            primary: (
                <div style={{ textAlign: 'left' }}>
                    <span style={{ fontFamily: 'Montserrat' }}>primarytt</span>
                </div>
            ),
            secondary: undefined
        },
        {
            startIcon: (
                <svg
                    class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1umw9bq-MuiSvgIcon-root"
                    focusable="false"
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    data-testid="HomeIcon"
                >
                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path>
                </svg>
            ),
            primary: <div>primarytt</div>,
            secondary: undefined
        }
    ];

    return (
        <div style={{ width: '100%' }}>
            <List onClick={undefined} items={items} />
        </div>
    );
}

export default function Cell() {
    return (
        <>
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
                    width: '100%'
                }}
            >
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
            </div>

            <div
                style={{
                    width: '100%'
                }}
            >
                <Rating
                    sx={{
                        '& .MuiRating-iconFilled': {
                            color: 'rgb(255, 99, 107)'
                        },
                        '& .MuiRating-iconHover': {
                            color: '#ff3d47'
                        }
                    }}
                    onChange={(e, value) => {
                        fetch('api/test', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                rating: value
                            })
                        });
                    }}
                    size="medium"
                    data-type="Rating"
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
                    fontSize: '17px',
                    fontFamily: 'Roboto',
                    textAlign: 'none'
                }}
                style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    marginLeft: '4%'
                }}
                variant="h6"
                data-type="Typography"
            >
                Список
            </Typography>

            <ListWrap />
        </>
    );
}
