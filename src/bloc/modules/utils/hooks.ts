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
export const useCellContext = ( componentId: string, includeSelf: boolean = true ): CellContext => {
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