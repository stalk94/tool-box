import React from 'react';
import { Button, Box, ButtonGroup, Typography, IconButton } from '@mui/material';
import { MediaImage } from '../carts/atomize';
import Card from '../carts/base';
import { FiberManualRecord, AdjustOutlined } from '@mui/icons-material';


type Props = {
    items: {
        title: string
        buttonText: string
        description: string
        images: string[]
    }[]
}
const testData = [
    {
        title: 'ЧЕРДАЧНАЯ ЛЕСТНИЦА ECON',
        buttonText: "ПОДРОБНЕЕ",
        description: 'Лучшее решение для вашего дома!',
        images: [
            "https://i.pinimg.com/736x/c7/28/d8/c728d805149bad291e3cbc307d544e38.jpg",
            "https://lesenka-market.ru/upload/iblock/ca2/5rmqmnanoek18isp3oyi1u5ixkkgmrze.jpeg",
            'https://titanremont.ru/assets/img/fornews/konsolnaya-lestnica.jpg',
            'https://lestnicy-minsk.by/upload/medialibrary/0e8/0e8bcb456f274f4457870a058929f340.jpg',
            "https://lesenka-market.ru/upload/iblock/ca2/5rmqmnanoek18isp3oyi1u5ixkkgmrze.jpeg",
            'https://titanremont.ru/assets/img/fornews/konsolnaya-lestnica.jpg',
            'https://titanremont.ru/assets/img/fornews/konsolnaya-lestnica.jpg',
            'https://lestnicy-minsk.by/upload/medialibrary/0e8/0e8bcb456f274f4457870a058929f340.jpg',
            "https://lesenka-market.ru/upload/iblock/ca2/5rmqmnanoek18isp3oyi1u5ixkkgmrze.jpeg",
        ]
    },
    {
        title: 'СТИЛЬНЫЙ ДИЗАЙН',
        buttonText: "ПОДРОБНЕЕ",
        description: 'Идеально впишется в интерьер!',
        images: [
            "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg",
            "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg",
        ]
    },
    {},{}
];

// todo: доделать
const IconGroop = ({ active, setActive, count }) => {
    const fill = (active: number) => {
        const result = [];
        if(count > 4) count = 4;

        for (let i = 0; i < count; i++) {
            result.push(
                <IconButton
                    key={i} 
                    onClick={()=> setActive(i)}
                >
                    { i === active 
                        ? <AdjustOutlined sx={{fontSize:'14px',color:'#c11619'}} />
                        : <FiberManualRecord sx={{fontSize:'12px'}} />
                    }
                </IconButton>
            );
        }

        return result;
    }

    return(
        <ButtonGroup>
            { fill(active) }
        </ButtonGroup>
    );
}
const PhotoColage = ({ images }) => {
    return (
        <Box
            sx={{
                width: "100%",
                height:  {
                    xs: '20%',
                    sm: "100%",
                },
                display: "flex",
                flexDirection: { 
                    xs: "row",
                    sm: "row",
                    md: "column" 
                }, // В ряд на мобильных, в колонку на больших
                flexWrap: "wrap", // Картинки переносятся, если их много
                justifyContent: { 
                    xs: "center", 
                    md: "flex-start" 
                },
                alignItems: "center",
                gap: {
                    xs: 0.5,
                    md: 1
                },
                mt: {
                    xs: 0,
                    md: 6
                },
                maxHeight: "100%", // Ограничение высоты
                overflow: "hidden", // Не вылазить за пределы
                maxWidth: "100%", // Ограничение по ширине для контейнера
            }}
        >
            {images.map((src, index) => index !== 0 &&(
                <Box
                    key={index}
                    component="img"
                    src={src}
                    alt={`photo-${index}`}
                    sx={{
                        width: "25%", // Зависит от контейнера
                        aspectRatio: "1 / 1",
                        borderRadius: "50%",
                        objectFit: "cover",
                        boxShadow: "0px 4px 6px rgba(0,0,0,0.2)",
                        alignSelf: { md: index % 2 === 0 ? "flex-start" : "flex-end" },
                        transition: "transform 0.3s",
                        "&:hover": { transform: "scale(1.1)" },
                        border: '2px solid gray',
                        maxHeight: {
                            xs: '40px',
                            sm: '60px',
                            md: "120px",
                        },
                        maxWidth: {
                            xs: '40px',
                            sm: '60px',
                            md: "120px",
                        }
                    }}
                />
            ))}
        </Box>
    );
}
const Description = ({ data, navigationSlot }) => {
    return(
        <Box
            sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: {
                    xs: "column",
                    md: 'row'
                },
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: 'column',
                    justifyContent: "center",
                    alignItems: "start",
                    textAlign: "center",
                    p: 2
                }}
            >
                <Typography
                    color="text.primary"
                    sx={{
                        textAlign: "left",
                        fontSize: {
                            xs: "1.5rem", // Для мобильных устройств
                            sm: "2rem",   // Для маленьких экранов
                            md: "2.5rem", // Для средних и больших экранов
                        }
                    }}
                    variant='h4'
                >
                    { data.title }
                </Typography>
                <Typography
                    color="text.secondary"
                    sx={{
                        textAlign: "left",
                        mt: 1
                    }}
                >
                    { data.description }
                </Typography>
                <Button
                    variant='outlined'
                    sx={{
                        mt: 3
                    }}
                >
                    { data.buttonText }
                </Button>

                <Box
                    sx={{
                        mt: 6
                    }}
                >
                    { navigationSlot }
                </Box>
            </Box>

            <PhotoColage
                images={data.images}
            />
        </Box>
    );
}


export default function PromoSlider ({ items }: Props) {
    const [active, setActive] = React.useState(0);


    return (
        <Card actionAreaEnabled>
            <React.Fragment>
                <MediaImage 
                    src={(items ?? testData)[active].images[0]} 
                />
                <Box 
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: {
                            sm: "100%"
                        },
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                        p: 2,
                    }}
                >
                    <Description
                        data={(items ?? testData)[active]}
                        navigationSlot={
                            <IconGroop
                                active={active}
                                setActive={setActive}
                                count={(items ?? testData).length}
                            />
                        }
                    />
                </Box>
            </React.Fragment>
        </Card>
    );
}