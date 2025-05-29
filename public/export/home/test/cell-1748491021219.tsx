import { Button, Typography } from '@mui/material';
import React from 'react';

export default function Cell() {
    return (
        <>
            <Typography
                sx={{
                    width: '100%',
                    display: 'block',
                    fontSize: '45px',
                    fontFamily: 'Roboto',
                    color: 'rgba(2, 2, 2, 1)'
                }}
                style={{
                    display: 'flex',
                    fontWeight: 'bold',
                    marginTop: '8%',
                    marginLeft: '1%'
                }}
                variant="h5"
                data-type="Typography"
            >
                Компания Метпромснаб
            </Typography>

            <Typography
                sx={{
                    width: '100%',
                    display: 'block',
                    fontSize: '18px',
                    color: 'rgba(11, 10, 10, 1)'
                }}
                style={{
                    display: 'flex',
                    marginLeft: '3%',
                    marginTop: '7%'
                }}
                variant="h5"
                data-type="Typography"
            >
                Московская компания специализируемся на производстве и продаже
                товаров для систем вентиляции и ревизионных люков. С 2004 года
                мы уверенно занимаем лидирующие позиции в отрасли. В нашем
                интернет-магазине вы найдёте широкий ассортимент продукции с
                возможностью доставки по всей стране.
            </Typography>

            <Button
                startIcon={undefined}
                endIcon={undefined}
                style={{
                    marginLeft: '10%',
                    marginRight: '44%',
                    marginTop: '6%'
                }}
                sx={{
                    whiteSpace: 'nowrap'
                }}
                variant="contained"
                color="error"
                fullWidth
                data-type="Button"
                onClick={() =>
                    sharedEmmiter.emit('event', {
                        id: 1748491440733,
                        type: 'click'
                    })
                }
            >
                Button
            </Button>
        </>
    );
}
