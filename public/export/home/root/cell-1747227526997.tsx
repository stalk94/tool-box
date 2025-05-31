import {
    Avatar,
    Button,
    Chip,
    Divider,
    Rating,
    Typography
} from '@mui/material';
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
                    data-testid="SettingsIcon"
                >
                    <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6"></path>
                </svg>
            ),
            primary: <div>тест</div>,
            secondary: <span>secondary</span>
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
            <div
                style={{
                    width: 'fit-content'
                }}
            >
                <Avatar
                    sx={{
                        width: 55,
                        height: 55,
                        bgColor: 'gray'
                    }}
                    src={'https://mui.com/static/images/avatar/3.jpg'}
                    style={{}}
                    data-type="Avatar"
                    variant="circular"
                >
                    undefined
                </Avatar>
            </div>

            <Chip
                component="a"
                onClick={console.log}
                onDelete={console.log} // сделает возможность удаления
                clickable={false} // кликабельность
                label={'chip'}
                variant=""
                size="small"
                color=""
                style={{}}
                data-type="Chip"
            />

            <Button
                startIcon={undefined}
                endIcon={undefined}
                style={{}}
                sx={{
                    whiteSpace: 'nowrap'
                }}
                variant="outlined"
                color="secondary"
                data-type="Button"
                onClick={() =>
                    sharedEmmiter.emit('event', {
                        id: 1748468972253,
                        type: 'click'
                    })
                }
            >
                Button
            </Button>

            <div
                style={{
                    width: 'fit-content'
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
                    precision={1}
                    data-type="Rating"
                />
            </div>

            <Divider
                flexItem
                orientation={'horizontal'}
                variant={'fullWidth'}
                style={{
                    paddingTop: false,
                    width: '100%'
                }}
            >
                <Typography variant="subtitle2">menu</Typography>
            </Divider>

            <ListWrap />
        </>
    );
}
