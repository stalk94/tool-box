import React from 'react';
import { cellsContent } from '../../context';

type CellContext = {
    cellId: string | null;
    componentIndex: number | null;
    components: any[];
    cellRect: DOMRect | null;
    cellRef: HTMLElement | null;
}


/**
 * Возвращает информацию о ячейке, в которой находится компонент
 * @param componentId ID компонента (`data-id`)
 * @param includeSelf включать ли сам компонент в список окружения
 */
const useCellContext = ( componentId: string, includeSelf: boolean = true ): CellContext => {
    const [cellId, setCellId] = React.useState<string | null>(null);
    const [componentIndex, setComponentIndex] = React.useState<number | null>(null);
    const [cellRef, setCellRef] = React.useState<HTMLElement | null>(null);
    const [cellRect, setCellRect] = React.useState<DOMRect | null>(null);
    const [components, setComponents] = React.useState<any[]>([]);

    
    React.useEffect(() => {
        const cells = cellsContent.get({ noproxy: true });

        for (const [id, comps] of Object.entries(cells)) {
            const index = comps.findIndex((comp) => comp?.props?.['data-id'] === componentId);
            if (index !== -1) {
                setCellId(id);
                setComponentIndex(index);

                const filtered = includeSelf
                    ? comps
                    : comps.filter((comp) => comp?.props?.['data-id'] !== componentId);

                setComponents(filtered);
                break;
            }
        }
    }, [componentId, includeSelf]);
    React.useEffect(() => {
        if (!cellId) return;

        const el = document.querySelector(`[data-id="${cellId}"]`) as HTMLElement | null;
        if (!el) return;

        setCellRef(el);
        setCellRect(el.getBoundingClientRect());

        const resizeObserver = new ResizeObserver(() => {
            setCellRect(el.getBoundingClientRect());
        });

        resizeObserver.observe(el);
        return () => resizeObserver.disconnect();
    }, [cellId]);


    return {
        cellId,
        componentIndex,
        components,
        cellRect,
        cellRef
    };
}

/**
 * информация по размерам которые занимает компонент
 * @param componentId D компонента (`data-id`)
 * @returns 
 */
export const useComponentSize = (componentId: string) => {
    const { cellRef, components, componentIndex } = useCellContext(componentId, true);
    const [size, setSize] = React.useState({ width: 0, height: 0 });

    React.useEffect(() => {
        if (!cellRef || componentIndex === null) return;

        const calcSize = () => {
            const siblingsBefore = components.slice(0, componentIndex);

            const usedHeight = siblingsBefore.reduce((acc, comp) => {
                const id = comp.props['data-id'];
                const el = document.querySelector(`[data-id="${id}"]`) as HTMLElement;
                return acc + (el?.offsetHeight || 0);
            }, 0);

            const cellRect = cellRef.getBoundingClientRect();
            const availableHeight = cellRect.height - usedHeight;
            //const width = cellRect.width;

            const usedWidth = siblingsBefore.reduce((acc, comp) => {
                const id = comp?.props?.['data-id'];
                const el = document.querySelector(`[data-id="${id}"]`) as HTMLElement;
                return acc + (el?.offsetWidth || 0);
            }, 0);
            
            const availableWidth = cellRect.width - usedWidth;
            //console.log(availableWidth)

            setSize({
                width: Math.max(0, availableWidth),
                height: Math.max(0, availableHeight),
            });
        };

        calcSize();
        const resizeObserver = new ResizeObserver(calcSize);
        resizeObserver.observe(cellRef);

        return () => resizeObserver.disconnect();
    }, [cellRef, componentIndex, components]);

    return size; // { width, height }
}


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