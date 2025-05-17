import { hookstate, State } from '@hookstate/core';
import { localstored } from '@hookstate/localstored';
import { ComponentSerrialize, LayoutCustom, SlotDataBus, Component, ScopeData } from './type';
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
    mod: 'block' | 'grid' | 'preview' | 'storage' | 'slot';     //?? 'slot', 'storage' 
    dragEnabled: boolean;
    linkMode: string | undefined;
    layout: LayoutCustom[];
    size: {
        width: number;
        height: number;
        breackpoint: string;
    }
    inspector: {
        lastData: any
        colapsed: boolean
        isAbsolute: boolean
        position: {x:number, y:number}
    }
    currentCell?: string;
    curentNestedContext?: {
        parentComponentId: number | string
        
    },
}
export type InfoStateType = {
    container: {
        width: number
        height: number
    }
    select: {
        cell?: string;
        content?: Component
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
        lastData: any
        task: any[];
    };
    project: Record<string, ScopeData>
    contentAllRefs?: any;
    activeEditorTipTop: Editor
}
export type NestedContextStateType = {
    isEnable: boolean,
    currentData: SlotDataBus
}
export type StorageStateType = {
    [key: string]: []
}


let contextState: State<EditorContextType> | null = null;
let nestedContextState: State<EditorContextType> | null = null;
let storageState: State<StorageStateType> | null = null;
let renderStateInstance: State<LayoutCustom[]> | null = null;
let cellsContentInstance: State<Record<string, ComponentSerrialize[]>> | null = null;
let infoStateInstance: State<InfoStateType> | null = null;

export function useEditorContext(): State<EditorContextType> | null {
    if (typeof window === 'undefined') return null;

    if (!contextState) {
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
                // LINK - EXPEREMENTAL вложенный контекст компонента поддерживаюший вложенную сетку
                curentNestedContext: undefined,
                inspector: {
                    lastData: {},
                    colapsed: false,
                    isAbsolute: false,
                    position: {
                        x: window.innerWidth-400,
                        y: 50
                    }
                },
            },
            localstored({ 
                key: 'CONTEXT', 
                engine: localStorage 
            })
        );
    }

    return contextState;
}

export function useNestedContext(): State<NestedContextStateType> | null {
    if (typeof window === 'undefined') return null;

    if (!nestedContextState) {
        nestedContextState = hookstate<NestedContextStateType>(
            {
                isEnable: false
            }
        );
    }

    return nestedContextState;
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
            {}
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
