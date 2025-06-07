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

            <Chip
                component="a"
                onClick={console.log}
                onDelete={console.log} // сделает возможность удаления
                clickable={false} // кликабельность
                label={'chip 22'}
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
                color="primary"
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
