import { useEffect, useRef, useState } from 'react';



export function useContainerSize<T extends HTMLElement>() {
    const ref = useRef<T>(null);
    const [width, setWidth] = useState<number>(0);
    const [height, setHeight] = useState<number>(0);

    useEffect(() => {
        if (!ref.current) return;

        const observer = new ResizeObserver(([entry]) => {
            setWidth(entry.contentRect.width);
            setHeight(entry.contentRect.height);
        });

        observer.observe(ref.current);

        return () => observer.disconnect();
    }, []);

    return [ref, width, height] as const;
}