import {
    Avatar,
    Button,
    Chip,
    Divider,
    Rating,
    Typography
} from '@mui/material';
import React from 'react';

export default function Cell() {
    return (
        <>
            <Avatar
                sx={{
                    width: 55,
                    height: 55,
                    bgColor: 'gray'
                }}
                src={'https://mui.com/static/images/avatar/3.jpg'}
                style={{
                    width: 'fit-content'
                }}
                data-parent="cell-1747227526997"
                data-type="Avatar"
                variant="circular"
            >
                <svg
                    class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1umw9bq-MuiSvgIcon-root"
                    focusable="false"
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    data-testid="CommentIcon"
                >
                    <path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4zM18 14H6v-2h12zm0-3H6V9h12zm0-3H6V6h12z"></path>
                </svg>
            </Avatar>

            <div
                style={{
                    width: 'fit-content'
                }}
            >
                <Rating
                    precision={1}
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
                    icon={
                        <svg
                            class="MuiSvgIcon-root MuiSvgIcon-fontSizeInherit css-1ckov0h-MuiSvgIcon-root"
                            focusable="false"
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            data-testid="FavoriteIcon"
                        >
                            <path d="m12 21.35-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54z"></path>
                        </svg>
                    }
                    emptyIcon={
                        <svg
                            class="MuiSvgIcon-root MuiSvgIcon-fontSizeInherit css-1ckov0h-MuiSvgIcon-root"
                            focusable="false"
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            data-testid="FavoriteBorderIcon"
                        >
                            <path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3m-4.4 15.55-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05"></path>
                        </svg>
                    }
                    data-parent="cell-1747227526997"
                    size="medium"
                    data-type="Rating"
                />
            </div>

            <Chip
                component="a"
                onClick={console.log}
                onDelete={console.log} // сделает возможность удаления
                clickable={false} // кликабельность
                label={'chip 22rr'}
                icon={
                    <svg
                        class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1umw9bq-MuiSvgIcon-root"
                        focusable="false"
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        data-testid="HomeIcon"
                    >
                        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path>
                    </svg>
                }
                data-parent="cell-1747227526997"
                variant=""
                size="small"
                color=""
                style={{}}
                data-type="Chip"
            />

            <Divider
                flexItem
                orientation={'horizontal'}
                variant={'fullWidth'}
                style={{
                    paddingTop: false,
                    width: '100%'
                }}
                sx={{
                    borderStyle: 'solid',
                    borderColor: null
                }}
            >
                <Typography variant="subtitle2">text</Typography>
            </Divider>

            <Button
                startIcon={undefined}
                endIcon={undefined}
                style={{}}
                sx={{
                    whiteSpace: 'nowrap'
                }}
                data-parent="cell-1747227526997"
                variant="outlined"
                color="success"
                fullWidth
                data-type="Button"
                onClick={() =>
                    sharedEmmiter.emit('event', {
                        id: 1749140334962,
                        type: 'click'
                    })
                }
            >
                Button
            </Button>
        </>
    );
}
