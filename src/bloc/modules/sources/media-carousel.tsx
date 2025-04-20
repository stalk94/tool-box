import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import { useComponentSize } from '../utils/hooks';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';



export const MediaCarouselCustom = React.forwardRef((props: any, ref) => {
    const pointer = useRef({ startX: 0, dragging: false });
    const containerRef = useRef<HTMLDivElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [slideWidth, setSlideWidth] = useState(0);
    const x = useMotionValue(0);
    const {
        items = [],
        autoplay = false,
        autoplayDelay = 3000,
        loop = false,
        slidesToShow = 3,
        slidesToScroll = 1,
        'data-id': dataId,
        style = {},
        ...otherProps
    } = props;

    const { width, height } = useComponentSize(dataId);
    
    
    const goTo = (index: number) => {
        let safeIndex = index;

        if (!loop) {
            const maxSafe = Math.max(0, items.length - slidesToShow);

            if (safeIndex > maxSafe) {
                safeIndex = 0; // вернуться в начало при переполнении
            } 
            else {
                safeIndex = Math.max(0, Math.min(safeIndex, maxSafe));
            }
        } 
        else {
            safeIndex = (index + items.length) % items.length;
        }

        setCurrentIndex(safeIndex);
    }
    const onPointerDown = (e: React.PointerEvent) => {
        pointer.current.startX = e.clientX;
        pointer.current.dragging = true;
    }
    const onPointerMove = (e: React.PointerEvent) => {
        if (!pointer.current.dragging) return;
        const delta = e.clientX - pointer.current.startX;
        x.set(-currentIndex * slideWidth + delta);
    }
    const onPointerUp = (e: React.PointerEvent) => {
        if (!pointer.current.dragging) return;
        pointer.current.dragging = false;
        const delta = e.clientX - pointer.current.startX;

        if (Math.abs(delta) > slideWidth / 4) {
            goTo(currentIndex + (delta < 0 ? slidesToScroll : -slidesToScroll));
        } else {
            goTo(currentIndex);
        }
    }

    useEffect(() => {
        const update = () => {
            if (containerRef.current) {
                const fullWidth = containerRef.current.offsetWidth;
                const perSlide = fullWidth / slidesToShow;
                setSlideWidth(perSlide);
                animate(x, -currentIndex * perSlide, { type: 'spring', stiffness: 250 });
            }
        };
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, [currentIndex, width, slidesToShow]);
    useEffect(() => {
        if (!autoplay || items.length <= slidesToShow) return;

        const interval = setInterval(() => {
            const nextIndex = currentIndex + slidesToScroll;

            if (!loop && nextIndex > items.length - slidesToShow) {
                goTo(0); // вернуться в начало при достижении конца
            } 
            else goTo(nextIndex);
            
        }, autoplayDelay);

        return ()=> clearInterval(interval);
    }, [currentIndex, autoplay, autoplayDelay, items.length, slidesToShow, slidesToScroll, loop]);


    return (
        <div
            ref={ref}
            data-id={dataId}
            data-type="MediaCarousel"
            style={{
                overflow: 'hidden',
                width: '100%',
                height: height,
                position: 'relative',
                ...style,
            }}
            {...otherProps}
        >
            {items.length > slidesToShow && (
                <>
                    <button className="carousel-button left" onClick={() => goTo(currentIndex - slidesToScroll)}>
                        <ChevronLeft fontSize="inherit" />
                    </button>
                    <button className="carousel-button right" onClick={() => goTo(currentIndex + slidesToScroll)}>
                        <ChevronRight fontSize="inherit" />
                    </button>
                </>
            )}

            <div
                ref={containerRef}
                style={{ width: '100%', overflow: 'hidden' }}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerLeave={onPointerUp}
                onPointerCancel={onPointerUp}
            >
                <motion.div
                    style={{
                        display: 'flex',
                        x,
                        cursor: 'grab',
                        userSelect: 'none'
                    }}
                >
                    {items.map((item, i) => (
                        <div
                            key={i}
                            style={{
                                flex: `0 0 ${100 / slidesToShow}%`,
                                maxWidth: `${100 / slidesToShow}%`,
                                padding: 4,
                                boxSizing: 'border-box'
                            }}
                        >
                            {item.type === 'image' && (
                                <img src={item.src} style={{ width: '100%', height: height,}} />
                            )}
                            {item.type === 'video' && (
                                <video src={item.src} controls style={{ width: '100%', height: height, }} />
                            )}
                        </div>
                    ))}
                </motion.div>
            </div>

            <style>
                {`
                    .carousel-button {
                        position: absolute;
                        top: 50%;
                        transform: translateY(-50%);
                        z-index: 10;
                        background: rgba(0, 0, 0, 0.3);
                        border: none;
                        color: white;
                        font-size: 28px;
                        width: 36px;
                        height: 36px;
                        cursor: pointer;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
                        backdrop-filter: blur(4px);
                        transition: background 0.25s ease;
                    }
                    .carousel-button:hover {
                        background: rgba(0, 0, 0, 0.6);
                    }
                    .carousel-button.left {
                        left: 12px;
                    }
                    .carousel-button.right {
                        right: 12px;
                    }
                `}
            </style>
        </div>
    );
});