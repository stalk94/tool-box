import { Responsive, WidthProvider, Layouts, Layout } from "react-grid-layout";
import { DraggableData } from 'react-draggable';
import React from 'react'

// все компоненты исходные используемые в редакторе и вне
export type ProxyComponentName = 'Button' 
    | 'IconButton' 
    | 'Typography'


/** серриализованный вид */
export type ComponentSerrialize = {
    id: string
    /** id ячейки */
    parent: string
    functions?: {
        [key: string]: string
    }
    props: {
        "data-type": string,
        "data-offset"?: { x: number; y: number },
        [key: string]: any
    }
    
}

/** все дочерние компоненты установленные редактором */
export type Component = React.ReactElement & {
    _store: {
        index: number
    },
    props: {
        "data-id": number
        "data-type": ProxyComponentName
        "data-offset"?: { x: number; y: number }
        "data-relative-offset": { x: number; y: number }
        children?: string | any
        style?: React.CSSProperties
        [key: string]: any
    }
}


export type DraggbleElementProps = {
    component: Component
    index: number
    cellId: number
    useStop: (component: any, data: {x: number, y: number})=> void
}
export type LayoutCustom = Layout & {
    /** id рендер элемента */
    content?: string | ContentFromCell[]
}
export type GridEditorProps = {
    setLayout: (old: Layout[])=> void
    layout: LayoutCustom[]
    renderItems: React.ReactNode[]
    tools: React.ReactNode
}
export type ContentFromCell = Component;