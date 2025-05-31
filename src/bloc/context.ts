import { ComponentSerrialize, LayoutCustom, SlotDataBus, Component, ComponentProps, ScopeData } from './type';
import { Editor } from '@tiptap/react';
import { createState, useLocalStorage } from 'statekit-react';
import { createStore as create } from 'statekit-lite';
import type { Palette } from '@mui/material/styles';


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
    mod: 'block' | 'settings' | 'grid' | 'preview' | 'storage' | 'slot';
    dragEnabled: boolean;
    layout: LayoutCustom[];
    size: {
        width: number
        height: number
        breackpoint: string
    }
    inspector: {
        lastData: any
        colapsed: boolean
        isAbsolute: boolean
        position: {
            x: number
            y: number
        }
    }
    buffer?: ComponentSerrialize,
    currentCell?: LayoutCustom
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
        cell?: Element;
        content?: ComponentSerrialize
        slot: {
            component: Component,
            index: number,
            parent: ComponentProps
        }
        panel: {
            lastAddedType: string;
        };
    }
    inspector: {
        lastData: any
        task: any[];
    };
    project: Record<string, ScopeData[]>
    contentAllRefs?: any;
    activeEditorTipTop: Editor
}
export type NestedContextStateType = {
    isEnable: boolean,
    currentData: SlotDataBus
}
export type SettingsContextStateType = {
    theme: {
        currentTheme: string
        currentGroop: keyof Palette
        pallete: Palette
    }
}


const isClient = typeof window !== 'undefined';

export const editorContext = createState('EDITOR', {
    mod: 'block',
    dragEnabled: true,
    meta: {
        scope: 'test',
        name: 'test-block',
    },
    layout: [],
    size: { 
        width: 1000, 
        height: 600, 
        breackpoint: 'lg' 
    },
    currentCell: {},
    inspector: {
        lastData: {},
        colapsed: false,
        isAbsolute: false,
        position: {
            x: 0,
            y: 50
        }
    },
} as EditorContextType, isClient ? [
    useLocalStorage({ restore: true })
] : []);


export const renderSlice = create([] as LayoutCustom[], {
    devtools: { name: 'render' },
    immer: true
});
export const cellsSlice = create({} as Record<string, ComponentSerrialize[]>, {
    devtools: { name: 'cells' },
    immer: true
});
export const settingsSlice = create({
    theme: {
        currentTheme: 'dark',
        currentGroop: 'input',
        pallete: {}
    }
} as SettingsContextStateType, {
    immer: true,
    persist: { key: 'settings' }
});


export const infoSlice = createState('infoGlobal', {
    container: {
        width: 0,
        height: 0,
    },
    select: {
        cell: {},
        content: {},
        slot: {},
        panel: {
            lastAddedType: '',
        },
    },
    project: {}
} as InfoStateType);


export const nestedContextSlice = createState('nestedContextGlobal', {
    isEnable: false
} as NestedContextStateType);