import { hookstate, State } from '@hookstate/core';
import { localstored } from '@hookstate/localstored';
import { ComponentSerrialize, LayoutCustom } from './type';
import { Editor } from '@tiptap/react';


export type PropsSimpleList = {
    defaultValue?: 'number'
    size?: 'medium' | 'small' | 'large'
    src?: 'string'
    max?: 'number'
    [key: string] : any
}
export type EditorContextType = {
    meta: {
        scope: string;
        name: string;
    };
    mod: 'block' | 'link' | 'grid' | 'storage' | 'slot';
    dragEnabled: boolean;
    linkMode: string | undefined;
    layout: LayoutCustom[];
    size: {
        width: number;
        height: number;
        breackpoint: string;
    };
    currentCell?: string;
}
export type InfoStateType = {
    container: {
        width: number;
        height: number;
    }
    select: {
        cell?: string;
        content?: string;
        slot: {
            id: string
            props?: Record<string, any>
            source: {
                propsList: PropsSimpleList
                render: ()=> void
                degidratation: (props: Record<string, any>)=> void
            }
        }
        panel: {
            lastAddedType: string;
        };
    }
    inspector: {
        lastData: any;
        task: any[];
    };
    project: Record<string, any>;
    contentAllRefs?: any;
    activeEditorTipTop: Editor
}
export type StorageStateType = {
    [key: string]: []
}


let contextState: State<EditorContextType> | null = null;
let storageState: State<StorageStateType> | null = null;
let renderStateInstance: State<LayoutCustom[]> | null = null;
let cellsContentInstance: State<Record<string, ComponentSerrialize[]>> | null = null;
let infoStateInstance: State<InfoStateType> | null = null;

export function useEditorContext(): State<EditorContextType> | null {
    if (typeof window === 'undefined') return null;

    if (!contextState) {
        console.log('contextState')
        contextState = hookstate<EditorContextType>(
            {
                meta: {
                    scope: 'test',
                    name: 'test-block',
                },
                mod: 'block',
                dragEnabled: true,
                linkMode: undefined,
                layout: [],
                size: { width: 1000, height: 600, breackpoint: 'lg' },
                currentCell: undefined,
            },
            localstored({ 
                key: 'CONTEXT', 
                engine: localStorage 
            })
        );
    }

    return contextState;
}

export function useRenderState(): State<LayoutCustom[]> | null {
    if (typeof window === 'undefined') return null;

    if (!renderStateInstance) {
        renderStateInstance = hookstate<LayoutCustom[]>([]);
    }

    return renderStateInstance;
}

export function useCellsContent(): State<Record<string, ComponentSerrialize[]>> | null {
    if (typeof window === 'undefined') return null;

    if (!cellsContentInstance) {
        cellsContentInstance = hookstate<Record<string, ComponentSerrialize[]>>(
            {},
            localstored({ key: 'cellsContent', engine: localStorage })
        );
    }

    return cellsContentInstance;
}

export function useInfoState(): State<InfoStateType> | null {
    if (typeof window === 'undefined') return null;

    if (!infoStateInstance) {
        infoStateInstance = hookstate<InfoStateType>({
            container: {
                width: 0,
                height: 0,
            },
            select: {
                cell: undefined,
                content: undefined,
                slot: undefined,
                panel: {
                    lastAddedType: '',
                },
            },
            inspector: {
                lastData: {},
                task: [],
            },
            project: {},
            contentAllRefs: undefined,
            activeEditorTipTop: undefined,
        });
    }

    return infoStateInstance;
}

export function useStorageContext(): State<StorageStateType> | null {
    if (typeof window === 'undefined') return null;

    if (!storageState) {
        storageState = hookstate<StorageStateType>({});
    }

    return storageState;
}
