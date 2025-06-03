import React from 'react';
import { createStore } from 'statekit-lite';

/////////////////////////////////////////////////////////////////////////////////////////////////////
interface GuidesRenderProps {
    guides: {
        x: { get: (noProxy: boolean) => number[]; set: (fn: (prev: number[]) => number[]) => void };
        y: { get: (noProxy: boolean) => number[]; set: (fn: (prev: number[]) => number[]) => void };
    };
    scroll: number;
    axis: 'x' | 'y';
    length?: number; // по умолчанию 100vh / 100vw
    color?: string;
    containerRef: React.RefObject<HTMLElement>;
}
type RulerProps = {
    containerRef: React.RefObject<HTMLDivElement>
    step?: number
    guides?: any
}
const mockGuidesSlice = createStore({
    x: [],
    y: [20]
});

/////////////////////////////////////////////////////////////////////////////////////////////////////


const GuidesRender = ({ guides, scroll, axis, length, color='cyan', containerRef }: GuidesRenderProps) => {
    const dragState = React.useRef<{
        index: number;
        offset: number;
    } | null>(null);

    const isX = axis === 'x';
    const posKey = isX ? 'x' : 'y';
    const points = guides[posKey].use();

    const onMouseDown = (e: React.MouseEvent, index: number) => {
        e.preventDefault();
        e.stopPropagation();

        const client = isX ? e.clientX : e.clientY;
        const containerRect = containerRef.current!.getBoundingClientRect();
        const containerOffset = isX ? containerRect.left : containerRect.top;

        const offset = client - containerOffset - points[index];

        dragState.current = { index, offset };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    }
    const onMouseMove = (e: MouseEvent) => {
        if (!dragState.current) return;

        const client = isX ? e.clientX : e.clientY;
        const containerRect = containerRef.current!.getBoundingClientRect();
        const containerOffset = isX ? containerRect.left : containerRect.top;

        const newPos = client - containerOffset - dragState.current.offset;

        guides[posKey].set((prev) => {
            const updated = [...prev];
            updated[dragState.current!.index] = Math.max(0, newPos);
            return updated;
        });
    }
    const onMouseUp = () => {
        dragState.current = null;
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
    }


    return (
        <>
            {points.map((pos, index) => (
                <div
                    key={`${axis}-${pos}`}
                    onMouseDown={(e) => onMouseDown(e, index)}
                    style={{
                        position: 'absolute',
                        [isX ? 'left' : 'top']: pos - 4, // центрируем 9px зону на линии
                        [isX ? 'top' : 'left']: isX ? 0 : 10,
                        [isX ? 'height' : 'width']: length ?? '100%',
                        [isX ? 'width' : 'height']: 9,
                        zIndex: 9999,
                        pointerEvents: 'auto',
                        cursor: isX ? 'ew-resize' : 'ns-resize',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <div
                        style={{
                            background: color,
                            [isX ? 'width' : 'height']: 1,
                            [isX ? 'height' : 'width']: '100%',
                            opacity: 1,
                            pointerEvents: 'none',
                        }}
                    />
                </div>
            ))}
        </>
    );
}

export function RulerX({ containerRef, step = 50, guides }: RulerProps) {
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
        <>
            <GuidesRender
                axis="x"
                guides={guides ?? mockGuidesSlice}
                scroll={scrollLeft}
                containerRef={containerRef}
            />
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
        </>
    );
}
export function RulerY({ containerRef, step = 50, guides }: RulerProps) {
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
        <>
            <GuidesRender
                axis="y"
                guides={guides ?? mockGuidesSlice}
                scroll={scrollTop}
                containerRef={containerRef}
            />
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
        </>
    );
}