import React from 'react';
import useResizeObserver from '@react-hook/resize-observer';


type Size = { width: number; height: number, container: DOMRect };


export function useParentCellSize(ref: React.RefObject<HTMLElement>) {
    const [size, setSize] = React.useState({ width: 0, height: 0 });

    React.useEffect(() => {
        const node = ref.current;
        if (!node) return;

        let parentCell = node.closest('[data-id]');

        while (parentCell && parentCell.getAttribute('data-type') === 'Block') {
            parentCell = parentCell.parentElement?.closest('[data-id]');
        }

        if (!parentCell) return;

        const update = () => {
            const rect = parentCell!.getBoundingClientRect();
            setSize({ width: rect.width, height: rect.height });
        };

        update();
        const observer = new ResizeObserver(update);
        observer.observe(parentCell);

        return () => observer.disconnect();
    }, [ref]);

    return size;
}


export const useComponentSizeWithSiblings = (componentId: string): Size => {
    const [size, setSize] = React.useState<Size>({ width: 100, height: 100, container:{} });
    const containerRef = React.useRef<HTMLElement | null>(null);
    const componentRef = React.useRef<HTMLElement | null>(null);

    // Подключаем ResizeObserver к .react-grid-item
    useResizeObserver(containerRef, () => {
        calculateSize();
    });

   
    const calculateSize = () => {
        const container = containerRef.current;
        const current = componentRef.current;

        if (!container || !current) return;

        const all = Array.from(container.querySelectorAll('[data-id]')) as HTMLElement[];
        const index = all.findIndex((el) => el === current);
        if (index === -1) return;

        const siblingsBefore = all.slice(0, index);

        const usedHeight = siblingsBefore.reduce((sum, el) => sum + (el.offsetHeight || 0), 0);
        const usedWidth = siblingsBefore.reduce((sum, el) => sum + (el.offsetWidth || 0), 0);

        const containerRect = container.getBoundingClientRect();

        setSize({
            container: containerRect,
            width: Math.max(0, (containerRect.width - usedWidth) / globalThis.ZOOM),
            height: Math.max(0, (containerRect.height - usedHeight - 5) / globalThis.ZOOM),
        });
    };

    // Первый рендер
    React.useEffect(() => {
        let retries = 10;
        let timeout: any;

        const tryFind = () => {
            const current = document.querySelector(`[data-id="${componentId}"]`) as HTMLElement | null;
            const container = current?.closest('.react-grid-item') as HTMLElement | null;
            
            if (current && container) {
                componentRef.current = current;
                containerRef.current = container;
                calculateSize();

                const observer = new ResizeObserver(calculateSize);
                observer.observe(container);

                return () => observer.disconnect();
            }

            if (retries > 0) {
                retries--;
                timeout = setTimeout(tryFind, 100);
            }
        };

        tryFind();
        return () => clearTimeout(timeout);
    }, [componentId]);


    return size;
}
