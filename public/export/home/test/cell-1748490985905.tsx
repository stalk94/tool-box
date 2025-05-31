import { Avatar } from '@mui/material';
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
                        width: 52,
                        height: 52,
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
                    width: 'fit-content'
                }}
            >
                <Avatar
                    sx={{
                        width: 52,
                        height: 52,
                        bgColor: 'gray'
                    }}
                    src={'/uploads/img-1748534081965.jpg?1748534169640'}
                    style={{}}
                    data-type="Avatar"
                >
                    undefined
                </Avatar>
            </div>
        </>
    );
}
