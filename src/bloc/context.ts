import type { 
    ComponentSerrialize, LayoutCustom, LayoutsBreackpoints, 
    SlotDataBus, Component, ComponentProps, ScopeData, PageMeta
} from './type';
import { Editor } from '@tiptap/react';
import { createState, useLocalStorage } from 'statekit-react';
import { createStore as create } from 'statekit-lite';
import type { Palette } from '@mui/material/styles';


export type EditorContextType = {
    mod: 'block' | 'settings' | 'grid' | 'preview' | 'storage' | 'slot'
    lock: boolean
    dragEnabled: boolean
    layouts: LayoutsBreackpoints
    meta: PageMeta
    size: {
        width: number
        height: number
        /** текуший выбранный breackpoint */
        breackpoint: 'lg' | 'md' | 'sm' | 'xs'
    }
    settings: {
        gridCompact: boolean
        rowHeight: number
    }
    currentCell?: LayoutCustom
    curentNestedContext?: {
        parentComponentId: number | string
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
    panel: {
        stepSize: 1 | 2 | 5
        stepPosition:  1 | 2 | 5
    }
    story: {
        max: number
        future: any
        old: any
    }
}
type BufferStateType = {
    type: 'component' | 'cell'
    data: ComponentSerrialize
}

const isClient = typeof window !== 'undefined';


export const editorContext = createState('EDITOR', {
    mod: 'block',
    lock: false,
    dragEnabled: true,
    settings: {
        gridCompact: false,
        rowHeight: 20
    },
    meta: {
        scope: 'test',
        name: 'test-block',
    },
    layouts: {
        lg: [], 
        md: [], 
        sm: [], 
        xs: []
    },
    size: { 
        width: 1200, 
        height: 800, 
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


export const bufferSlice = create({
    
} as BufferStateType, {
    devtools: { name: 'buffer' }
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
    },
    panel: {
        stepSize: 1,
        stepPosition: 1,
    },
    story: {
        max: 50,
        future: [],
        old: []
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