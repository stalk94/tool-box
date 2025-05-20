import {
    Avatar,
    Box,
    Button,
    Card,
    CardActions,
    CardHeader,
    CardMedia,
    Chip,
    Rating,
    Typography
} from '@mui/material';
import { DateInput, TextInput } from '@lib/index';
import { StarBorder } from '@mui/icons-material';
import React from 'react';

export default function Cell() {
    return (
        <>
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
                    labelSx={{
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
                    labelSx={{
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
                    marginLeft: '10%',
                    marginRight: '10%',
                    height: false
                }}
                elevation={8}
            >
                <CardHeader
                    avatar={<StarBorder />}
                    title={
                        <span
                            style={{
                                color: 'rgba(99, 196, 153, 1)'
                            }}
                        >
                            <em>
                                <span
                                    style={{
                                        fontSize: '1.5rem'
                                    }}
                                >
                                    <span
                                        style={{
                                            fontFamily:
                                                'Roboto Condensed", Arial, sans-serif'
                                        }}
                                    >
                                        Detail
                                    </span>
                                </span>
                            </em>
                        </span>
                    }
                    subheader={
                        <span>
                            <span
                                style={{
                                    fontSize: '0.875rem'
                                }}
                            >
                                <span
                                    style={{
                                        fontFamily:
                                            'Roboto Condensed", Arial, sans-serif'
                                    }}
                                >
                                    style
                                </span>
                            </span>
                        </span>
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
                    height={'200'}
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
        </>
    );
}
