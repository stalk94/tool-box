import { hookstate } from '@hookstate/core';
import { localstored } from '@hookstate/localstored';
import { ComponentSerrialize, LayoutCustom } from './type';


let contextState: ReturnType<typeof hookstate> | null = null;
let renderStateInstance: ReturnType<typeof hookstate<LayoutCustom[]>> | null = null;
let cellsContentInstance: ReturnType<typeof hookstate<Record<string, ComponentSerrialize[]>>> | null = null;
let infoStateInstance: ReturnType<typeof hookstate<any>> | null = null;



export function useEditorContext() {
    if (typeof window === 'undefined') return null;

    if (!contextState) {
        contextState = hookstate(
            {
                meta: {
                    scope: 'test',
                    name: 'test-block'
                },
                mod: 'block',
                dragEnabled: true,
                linkMode: undefined,
                layout: [],
                size: { width: 1000, height: 600, breackpoint: 'lg' },
                currentCell: undefined,
            },
            localstored({ key: 'CONTEXT', engine: localStorage })
        );
    }

    return contextState;
}

export function useRenderState() {
    if (typeof window === 'undefined') return null;

    if (!renderStateInstance) {
        renderStateInstance = hookstate<LayoutCustom[]>([]);
    }

    return renderStateInstance;
}

export function useCellsContent() {
    if (typeof window === 'undefined') return null;

    if (!cellsContentInstance) {
        cellsContentInstance = hookstate<Record<string, ComponentSerrialize[]>>(
            {},
            localstored({ key: 'cellsContent', engine: localStorage })
        );
    }

    return cellsContentInstance;
}

export function useInfoState() {
    if (typeof window === 'undefined') return null;

    if (!infoStateInstance) {
        infoStateInstance = hookstate({
            container: {
                width: 0,
                height: 0
            },
            select: {
                cell: undefined,
                content: undefined,
                panel: {
                    lastAddedType: ''
                },
            },
            inspector: {
                lastData: {},
                task: []
            },
            project: {},
            contentAllRefs: undefined
        });
    }

    return infoStateInstance;
}
