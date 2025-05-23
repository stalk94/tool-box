import { createSlice, PayloadAction, configureStore } from '@reduxjs/toolkit';
import type { ComponentSerrialize, LayoutCustom, Component } from '../type';
import type { Editor } from '@tiptap/react';


export type PropsSimpleList = {
    defaultValue?: 'number';
    size?: 'medium' | 'small' | 'large';
    src?: 'string';
    max?: 'number';
    [key: string]: any;
}
export interface EditorContextType {
    meta: {
        scope: string;
        name: string;
    };
    mod: 'block' | 'grid' | 'preview' | 'storage' | 'slot';
    dragEnabled: boolean;
    linkMode: string | undefined;
    layout: LayoutCustom[];
    size: {
        width: number;
        height: number;
        breackpoint: string;
    };
    inspector: {
        lastData: any;
        colapsed: boolean;
        isAbsolute: boolean;
        position: { x: number; y: number };
    };
    currentCell?: string;
    curentNestedContext?: {
        parentComponentId: number | string;
    };
}
export interface InfoStateType {
    componentMap: Record<string, any>;
    container: {
        width: number;
        height: number;
    };
    select: {
        cell?: string;
        content?: Component;
        slot: {
            id: string;
            props?: Record<string, any>;
            source: {
                propsList: PropsSimpleList;
                render: () => void;
                degidratation: (props: Record<string, any>) => void;
            };
        };
        panel: {
            lastAddedType: string;
        };
    };
    inspector: {
        lastData: any;
        task: any[];
    };
    project?: {
        content: Record<string, ComponentSerrialize[]>;
        layout: LayoutCustom[];
        size: {
            width: number;
            height: number;
        };
    };
    contentAllRefs?: any;
    activeEditorTipTop: Editor;
}
export interface StorageStateType {
    [key: string]: [];
}


const initialEditorState: EditorContextType = {
    meta: { scope: 'test', name: 'test-block' },
    mod: 'block',
    dragEnabled: true,
    linkMode: undefined,
    layout: [],
    size: { width: 1000, height: 600, breackpoint: 'lg' },
    currentCell: undefined,
    inspector: {
        lastData: {},
        colapsed: false,
        isAbsolute: false,
        position: { x: typeof window !== 'undefined' ? window.innerWidth - 400 : 600, y: 50 },
    },
};

export const editorSlice = createSlice({
    name: 'editor',
    initialState: initialEditorState,
    reducers: {
        setLayout(state, action: PayloadAction<LayoutCustom[]>) {
            state.layout = action.payload;
        },
        setMod(state, action: PayloadAction<EditorContextType['mod']>) {
            state.mod = action.payload;
        },
        setSize(state, action: PayloadAction<EditorContextType['size']>) {
            state.size = action.payload;
        },
        setCurrentCell(state, action: PayloadAction<string | undefined>) {
            state.currentCell = action.payload;
        },
        // и т.д. по нужным частям
    },
});

export const store = configureStore({
    reducer: {
        editor: editorSlice.reducer,
        // добавишь info и storage по той же схеме
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;