import { Responsive, WidthProvider, Layouts, Layout } from "react-grid-layout";
import React from 'react'


// все компоненты исходные используемые в редакторе и вне
export type ProxyComponentName = 'Button' 
    | 'IconButton' 
    | 'Typography'



export type DataEmiters = 'onChange' | 'onClick';
export type ComponentProps = {
    'data-id': number
    'data-type': ProxyComponentName
    /** если генерит события, то будет список labels emiters */
    'data-pubs' ?: DataEmiters[]
    /** на кого подписан */
    'data-subs' ?: string | number[]
    children ?: string | any
    style ?: React.CSSProperties
    [key: string]: any
}
/** 
 * Компонент в редакторе (в ячейках)
 * все дочерние компоненты установленные редактором 
 */
export type Component = React.ReactElement & {
    _store: {
        index: number
    }
    props: ComponentProps
    type: {
        functions?: {}
        parent?: string
    }
}
/** серриализованный вид */
export type ComponentSerrialize = {
    id: number | string
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



export type DraggbleElementProps = {
    component: Component
    index: number
    cellId: number
    useStop: (component: any, data: {x: number, y: number})=> void
    useDelete: (cellId: string | number, componentIndex: number)=> void
}
export type LayoutCustom = Layout & {
    /** id рендер элемента */
    content?: string | Component[]
}
export type GridEditorProps = {
    setLayout: (old: Layout[])=> void
    layout: LayoutCustom[]
    renderItems: React.ReactNode[]
    tools: React.ReactNode
}

export type PropsForm = {
    elemLink: any
    type: 'props'|'base'|'flex'|'text'
    onChange: (data: Record<string, any>)=> void
}