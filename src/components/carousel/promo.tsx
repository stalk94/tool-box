import React from 'react';
import { Button, Box, ButtonGroup, Typography, IconButton, SxProps } from '@mui/material';
import { MediaImage } from '../carts/atomize';
import Card from '../carts/base';
import { FiberManualRecord, AdjustOutlined } from '@mui/icons-material';
import { Faker, ru, en } from '@faker-js/faker';
import { MarqueeText, MarqueeAdaptive } from '../text/marque';
import { useContainerWidth } from '../hooks/useContainerWidth';
const faker = new Faker({ locale: [ru, en] });


function generateTestData(count = 5) {
    return Array.from({ length: count }, () => ({
        title: faker.commerce.productName().toUpperCase(),
        buttonText: "ПОДРОБНЕЕ",
        description: faker.commerce.productDescription(),
        images: Array.from({ length: faker.number.int({ min: 4, max: 8 }) }, () =>
            `https://placehold.co/600x400/353636/gray?text=Promo image&font=roboto` 
        ),
    }));
}

export type PromoSliderProps = {
    items: {
        title: string
        buttonText: string
        description: string
        images: string[]
    }[]
    style?: SxProps
    styleDot?: {
        activeColor?: string 
        disableColor?: string 
    }
    styleText?: {
        title?: SxProps
        description?: SxProps
        button?: SxProps
    }
}


const IconGroop = ({ active, setActive, count, style }) => {
    const fill = (active: number) => {
        const result = [];
        if (count > 4) count = 4;

        for (let i = 0; i < count; i++) {
            result.push(
                <IconButton
                    key={i}
                    onClick={() => setActive(i)}
                >
                    {i === active
                        ? <AdjustOutlined sx={{ fontSize: '14px', color: style?.activeColor ?? '#c11619' }} />
                        : <FiberManualRecord sx={{ fontSize: '12px', color: style?.disableColor }} />
                    }
                </IconButton>
            );
        }

        return result;
    }

    return (
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
                height: {
                    xs: '20%',
                    sm: "100%",
                },
                display: "flex",
                flexDirection: {
                    xs: "row",
                    sm: "row",
                    md: "column"
                }, // В ряд на мобильных, в колонку на больших
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
                maxHeight: {
                    xs: '100px',
                    sm: '160px',
                    md: 'calc(100vh - 200px)' // не больше, чем экран
                },
                maxWidth: "100%", // Ограничение по ширине для контейнера
                overflow: "hidden", // Не вылазить за пределы
                flexWrap: "wrap", 
            }}
        >
            {images.map((src, index) => index !== 0 && (
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
const Description = ({ data, navigationSlot, style }) => {
    const [ref, width] = useContainerWidth<HTMLDivElement>();
    
    return (
        <Box
            ref={ref}
            sx={{
                position: "relative",
                height: "100%",
                width: "100%",
                display: "flex",
                flexDirection: 'row',
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
                    justifyContent: width < 600 ? 'start' : "center",
                    alignItems: "start",
                    textAlign: "center",
                    p: 2,
                    flexGrow: 1,
                }}
            >
                <MarqueeAdaptive
                    speed={60}
                    color="text.primary"
                    sx={{
                        textAlign: "left",
                         fontSize:  width < 600 ? "1.2rem" : {
                            xs: "1.2rem",
                            sm: "1.6rem",
                            md: "2.5rem",
                        },
                        fontWeight: 600,
                        wordBreak: "break-word",
                        lineHeight: 1.2,
                        maxWidth: "100%",
                        ...style?.title
                    }}
                    variant='h4'
                >
                    { data.title }
                </MarqueeAdaptive>
                <Typography
                    color="text.secondary"
                    sx={{
                        textAlign: "left",
                        mt: 2,
                        fontSize: width < 600 ? "0.8rem" : {
                            xs: "0.8rem",
                            sm: "1.4rem",
                            md: "2rem",
                            ...style?.description
                        }
                    }}
                >
                    { data.description }
                </Typography>
                <Button
                    variant='outlined'
                    sx={{
                        mt: 4,
                        ...style?.button
                    }}
                >
                    { data.buttonText }
                </Button>

                <Box
                    sx={{
                        position: "absolute",
                        bottom: width < 600 ? 0 :{
                            xs: 0,
                            md: 24,
                        },
                        left: "50%",
                        transform: "translateX(-50%)"
                    }}
                >
                    { navigationSlot }
                </Box>
            </Box>

            {/* <PhotoColage images={data.images} /> */}
        </Box>
    );
}


export default function PromoSlider({ items, styleDot, styleText, style }: PromoSliderProps) {
    const [active, setActive] = React.useState(0);
    const testData = generateTestData();            // моковые данные активны если не передать items

    return (
        <Card 
            actionAreaEnabled
            sx={{ minHeight: 260, ...style }}
        >
            <React.Fragment>
                <MediaImage
                    sx={{minHeight: 260}}
                    src={(items ?? testData)[active].images[0]}
                />
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        minHeight: 260,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                        p: 2,
                    }}
                >
                    <Description
                        style={styleText}
                        data={(items ?? testData)[active]}
                        navigationSlot={
                            <IconGroop
                                style={styleDot}
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