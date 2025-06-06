import React from 'react';
import Slider, { Settings } from 'react-slick';
import { Typography, IconButton, Button, Box, Grid2 } from '@mui/material';
import { ArrowForwardIos, ArrowBackIos } from '@mui/icons-material';
import "slick-carousel/slick/slick.css";
import { CarouselProps } from './Vertical';


const CustomPrevArrow: React.FC<any> = ({ onClick }) => (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton
            onClick={() => onClick('prew')}
            sx={{
                zIndex: 1,
            }}
        >
            <ArrowBackIos />
        </IconButton>
    </Box>
);
const CustomNextArrow: React.FC<any> = ({ onClick }) => (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton
            onClick={() => onClick('next')}
            sx={{
                zIndex: 1,
            }}
        >
            <ArrowForwardIos />
        </IconButton>
    </Box>
);


/**
 * поместить можно любой контент он сам там растянет как надо
 * ! высоту выставлять осторожно (может выйти за пределы контейнера родителя и все переломать)
 * @example
 * settings: {
 *      autoplay: true,      // автопрокрутку включить
 *      slidesToShow: 3,     // сколько слайдов в области видимости (чанк)
 *      slidesToScroll: 1    // по сколько слайдов пролистываем за раз
 * }
 */
export default function({ items, settings, height }: CarouselProps) {
    const [currentSlide, setCurrentSlide] = React.useState(0);
    const [touchStart, setTouchStart] = React.useState({ x: 0, y: 0 });
    const [touchEnd, setTouchEnd] = React.useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = React.useState(false);
    const [startPos, setStartPos] = React.useState({ x: 0, y: 0 });
    const sliderRef = React.useRef<Slider>(null);


    const settingsDefault: Settings = {
        ref: sliderRef,
        infinite: true,
        speed: 500,
        autoplay: false,
        slidesToShow: 3,                // сколько слайдов по умолчанию в поле видимости
        slidesToScroll: 1,
        variableWidth: false,           // Отключаем переменную ширину
        adaptiveHeight: false,        // Отключаем адаптивную высоту
        beforeChange: (current, next) => {
           //console.log('beforeChange', current, next);
        },
        afterChange: (current) => {
            //console.log('afterChange', current);
            setCurrentSlide(current); // Обновляем текущий слайд
        },
        ...settings,
        swipe: false,       // ! Отключаем стандартное свайп-движение
        arrows: false,      // ! выпелено
        draggable: false,   // ! стандартное багованное поведение выпилено к чертовой матери
        vertical: false,    // ! только горизонтальный режим
    };
    const isVertical = settingsDefault.vertical === true;


    const handleClick = (type: 'prew'|'next') => {
        if(type === 'next') sliderRef.current.slickNext();
        else sliderRef.current.slickPrev();
    }
    // Эмуляция мышиного свайпа для ПК
    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartPos({
            x: e.clientX,
            y: e.clientY
        });
    }
    const handleMouseMove = (e) => {
        if (!isDragging) return;
        
        const diff = isVertical 
            ? startPos.y - e.clientY // Вертикальное смещение
            : startPos.x - e.clientX; // Горизонтальное смещение
        
        if (Math.abs(diff) > 30) {
            if (diff > 0) {
                sliderRef.current.slickNext();
            } else {
                sliderRef.current.slickPrev();
            }
            setIsDragging(false);
        }
    }
    const handleMouseUp = () => {
        setIsDragging(false);
    }
    // Обработчики для свайпов на сенсорных устройствах
    const handleTouchStart = (e) => {
        setTouchStart({
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        });
    }
    const handleTouchEnd = (e) => {
        setTouchEnd({
            x: e.changedTouches[0].clientX,
            y: e.changedTouches[0].clientY
        });

        // Определяем разницу в координатах
        const diffX = touchStart.x - touchEnd.x;
        const diffY = touchStart.y - touchEnd.y;

        // Вычисляем, какое смещение больше - по X или по Y
        const isHorizontalSwipe = Math.abs(diffX) > Math.abs(diffY);

        // Проверяем, соответствует ли свайп ориентации слайдера
        if (isVertical && !isHorizontalSwipe) {
            // Для вертикального слайдера используем разницу по Y
            if (diffY > 50) {
                // Свайп вверх (к следующему слайду)
                sliderRef.current.slickNext();
            } else if (diffY < -50) {
                // Свайп вниз (к предыдущему слайду)
                sliderRef.current.slickPrev();
            }
        } 
        else if (!isVertical && isHorizontalSwipe) {
            // Для горизонтального слайдера используем разницу по X
            if (diffX > 50) {
                // Свайп влево (к следующему слайду)
                sliderRef.current.slickNext();
            } else if (diffX < -50) {
                // Свайп вправо (к предыдущему слайду)
                sliderRef.current.slickPrev();
            }
        }
    }

    // Эффект для синхронизации слайдов
    React.useEffect(() => {
        if (sliderRef.current) {
            sliderRef.current.slickGoTo(currentSlide);
        }
    }, [currentSlide]);
 

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
                height: height,
                alignItems: 'center',
            }}
        >

            <CustomPrevArrow onClick={handleClick}/>

            <Box
                sx={{
                    width: 'calc(100% - 82px)', // Оставляем место для кнопок
                    height: '100%',
                }}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                <Slider {...settingsDefault}>
                    { items.map((slide, index) => (
                        <Box
                            key={index}
                            className="slide-item"
                            sx={{
                                display: 'flex !important', // Переопределяем инлайн-стили Slick
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: height ?? 100, // Используем фиксированную высоту
                                //border: '1px solid red',
                                overflow: 'hidden',
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                { slide }
                            </Box>
                        </Box>
                    ))}
                </Slider>
            </Box>

            <CustomNextArrow onClick={handleClick} />

        </Box>
    );
}