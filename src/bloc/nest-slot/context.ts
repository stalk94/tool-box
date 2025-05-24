import { ComponentSerrialize, LayoutCustom, ProxyComponentName, Component } from '../type';
import { Editor } from '@tiptap/react';
import { createState } from 'statekit-react';


export type PropsSimpleList = {
    defaultValue?: 'number'
    size?: 'medium' | 'small' | 'large'
    src?: 'string'
    max?: 'number'
    [key: string] : any
}
export type EditorContextType = {
    dragEnabled: boolean;
    mod: 'block' | 'grid' | 'preview' | 'storage' | 'slot';
    meta: {
        scope: string;
        name: string;
    }
    size: {
        width: number;
        height: number;
        breackpoint: string;
    }
    currentCell?: LayoutCustom
    layout: LayoutCustom[];
    inspector: {
        lastData: any
        colapsed: boolean
        isAbsolute: boolean
        position: {
            x: number, 
            y: number
        }
    }
    curentNestedContext?: {
        parentComponentId: number | string
        
    }
}
export type InfoStateType = {
    componentMap: Record<string, any>
    container: {
        width: number;
        height: number;
    }
    select: {
        cell?: Element;
        content?: Component;
        panel: {
            lastAddedType: string;
        };
    }
    inspector: {
        lastData: any;
        task: any[];
    }
    /** начальные данные, они могут изменится */
    project?: {
        content: Record<string, ComponentSerrialize[]>
        layout: LayoutCustom[]
        size: {
            width: number
            height: number
        }
    };
    contentAllRefs?: any;
    activeEditorTipTop: Editor
}



export const renderSlice = createState('render', [] as LayoutCustom[]);
export const cellsSlice = createState('cells', {} as Record<string, ComponentSerrialize[]>);

export const infoSlice = createState('info', {
    container: {
        width: 0,
        height: 0,
    },
    select: {
        cell: {

        },
        panel: {
            lastAddedType: '',
        },
    },
    project: {

    },
} as InfoStateType);

export const editorSlice = createState('editor', {
    mod: 'block',
    dragEnabled: true,
    currentCell: {
        
    },
    meta: {
        scope: 'test',
        name: 'test-block',
    },
    size: { 
        width: 1000, 
        height: 600, 
        breackpoint: 'lg' 
    },
    layout: [],
    inspector: {
        lastData: {},
        colapsed: false,
        isAbsolute: false,
        position: {
            x: window.innerWidth - 400,
            y: 50
        }
    }
} as EditorContextType);