import React from 'react';



export function RulerX({ containerRef, step = 50 }) {
    const [scrollLeft, setScrollLeft] = React.useState(0);
    const [containerWidth, setContainerWidth] = React.useState(0);

    React.useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const onScroll = () => setScrollLeft(el.scrollLeft);
        const onResize = () => setContainerWidth(el.clientWidth);

        el.addEventListener('scroll', onScroll);
        const observer = new ResizeObserver(onResize);
        observer.observe(el);

        // init
        setScrollLeft(el.scrollLeft);
        setContainerWidth(el.clientWidth);

        return () => {
            el.removeEventListener('scroll', onScroll);
            observer.disconnect();
        };
    }, [containerRef]);

    const first = Math.floor(scrollLeft / step) * step;
    const count = Math.ceil(containerWidth / step) + 4;

    return (
        <div
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: 10,
                background: '#222',
                zIndex: 10,
                display: 'flex',
                pointerEvents: 'none',
                overflow: 'hidden',
                transform: `translateX(${-scrollLeft % step}px)`
            }}
        >
            {Array.from({ length: count }).map((_, i) => {
                const val = first + i * step;
                return (
                    <div
                        key={val}
                        style={{
                            width: step,
                            textAlign: 'center',
                            color: '#aaa',
                            fontSize: 8,
                            flexShrink: 0,
                        }}
                    >
                        {val}
                    </div>
                );
            })}
        </div>
    );
}

export function RulerY({ containerRef, step = 50 }) {
    const [scrollTop, setScrollTop] = React.useState(0);
    const [containerHeight, setContainerHeight] = React.useState(0);

    React.useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const onScroll = () => setScrollTop(el.scrollTop);
        const onResize = () => setContainerHeight(el.clientHeight);

        el.addEventListener('scroll', onScroll);
        const observer = new ResizeObserver(onResize);
        observer.observe(el);

        // init
        setScrollTop(el.scrollTop);
        setContainerHeight(el.clientHeight);

        return () => {
            el.removeEventListener('scroll', onScroll);
            observer.disconnect();
        };
    }, [containerRef]);

    const first = Math.floor(scrollTop / step) * step;
    const count = Math.ceil(containerHeight / step) + 2;

    return (
        <div
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: 25,
                height: '100%',
                background: '#222',
                display: 'flex',
                flexDirection: 'column',
                transform: `translateY(${-scrollTop % step}px)`
            }}
        >
            {Array.from({ length: count }).map((_, i) => {
                const val = first + i * step;
                return (
                    <div
                        key={val}
                        style={{
                            height: step,
                            textAlign: 'right',
                            paddingRight: 2,
                            color: '#aaa',
                            fontSize: 8,
                            flexShrink: 0,
                        }}
                    >
                        {val}
                    </div>
                );
            })}
        </div>
    );
}