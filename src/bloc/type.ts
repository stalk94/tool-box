import { Layout } from "react-grid-layout";
import { RegistreTypeComponent } from './config/type';
import React from 'react'
import EventEmitter from "../app/emiter";


export interface Events {
    htmlRender: (data: { str: string; view:any })=> void
    jsonRender: (data: { call: (newJson: any)=> void })=> void
    leftBarChange: (data: any)=> void
    onSelectCell: (cellId: string|number)=> void
    // добавить новый layout grid (ячейку)
    addCell: ()=> void
}
export interface EventsShared {
    [key: string]: (data: any)=> void
    //вызовет у всех компонентов в ячейках функцию рендера в литерал
    degidratation: (data: { call: (code: string)=> void, data: any})=> void
}
declare global {
    var EVENT: EventEmitter<Events>;
    var sharedEmmiter: EventEmitter<EventsShared>;
}


// все компоненты исходные используемые в редакторе и вне
export type ProxyComponentName = RegistreTypeComponent;
export type DataEmiters = 'onChange' | 'onClick' | 'onSelect';

// ---------------- styles  -----------------
export type InputStyles = {
    form?: {
        borderStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset' | 'none'
        borderColor?: string | 'none'
        background?: string | 'none'
    }
    placeholder?: React.CSSProperties
    label?: React.CSSProperties
    icon?: React.CSSProperties
}


//------------------------------------------
export type ComponentProps = {
    'data-id': number
    'data-type': ProxyComponentName
    /** если генерит события, то будет список labels emiters */
    'data-pubs' ?: DataEmiters[]
    /** на кого подписан */
    'data-subs' ?: string | number[]
    children ?: string | any
    style ?: React.CSSProperties
    styles?: InputStyles | any
    [key: string]: any
}
/** 
 * Компонент в редакторе (в ячейках)
 * все дочерние компоненты установленные редактором 
 */
export type Component = React.ReactElement & {
    props: ComponentProps
    type: {
        functions?: {}
        parent?: string
    }
    _store?: {
        index: number
    }
}
/** серриализованный вид */
export type ComponentSerrialize = {
    id: number
    /** id ячейки */
    parent: string
    functions?: {
        [key: string]: string
    }
    props: ComponentProps
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
    type: 'props'|'styles'|'flex'|'text'
    onChange: (data: Record<string, any>)=> void
}
export type LeftToolPanelProps = {
    addComponentToLayout: (elem: React.ReactNode) => void
    useDump: () => void
}
