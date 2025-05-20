import {
    Box,
    Button,
    Card,
    CardActions,
    CardHeader,
    CardMedia,
    Chip,
    Rating
} from '@mui/material';
import { StarBorder } from '@mui/icons-material';
import React from 'react';

export default function Cell() {
    return (
        <>
            <Card
                component="div"
                sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '5px',
                    border: '1px solid',
                    borderColor: 'rgba(255, 255, 255, 0.15)',
                    display: 'flex',
                    flexDirection: 'column'
                }}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%'
                }}
                elevation={8}
            >
                <CardHeader
                    avatar={<StarBorder />}
                    title={
                        <div
                            dangerouslySetInnerHTML={{
                                __html: <p>title</p>
                            }}
                        />
                    }
                    subheader={
                        <div
                            dangerouslySetInnerHTML={{
                                __html: <p>subheader</p>
                            }}
                        />
                    }
                    action={
                        <Chip
                            icon={<StarBorder />}
                            size="small" // "small", "medium"
                            label="new"
                        />
                    }
                />

                <CardMedia
                    component="img"
                    src={'/placeholder.jpg'}
                    height={'auto'}
                    alt={'image'}
                />

                <div
                    style={{
                        marginTop: '3%',
                        marginLeft: 8,
                        marginBottom: 'auto',
                        overflow: 'auto'
                    }}
                >
                    <span
                        style={{
                            fontSize: '0.975rem'
                        }}
                    >
                        <span
                            style={{
                                fontFamily:
                                    'Roboto Condensed", Arial, sans-serif'
                            }}
                        >
                            В зависимости от того, что вы хотите построить,
                            представления узлов работают немного по-разному и
                            могут иметь свои очень специфические возможности
                        </span>
                    </span>
                </div>

                <CardActions
                    sx={{
                        width: '100%',
                        mb: 0.5
                    }}
                >
                    <Box
                        sx={{
                            p: 1
                        }}
                    >
                        <Rating
                            defaultValue={2}
                            precision={1}
                            size={'medium'} // 'medium', 'small', 'large'
                            max={5}
                            onChange={(e, v) => {
                                console.log(v);
                            }}
                        />
                    </Box>
                    <Box
                        sx={{
                            ml: 'auto'
                        }}
                    >
                        <Button
                            sx={{
                                m: 0.5
                            }}
                            variant="outlined"
                            size={'medium'} // 'medium', 'small', 'large'
                            onClick={() => {
                                console.log('click');
                            }}
                        >
                            add to cart
                        </Button>
                    </Box>
                </CardActions>
            </Card>
        </>
    );
}
