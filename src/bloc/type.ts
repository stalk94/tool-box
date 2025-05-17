import { desserealize } from './utils/sanitize';
import { Layout } from "react-grid-layout";
import { RegistreTypeComponent } from './config/type';
import React from 'react'
import EventEmitter from "../app/emiter";
import { number } from 'prop-types';


//////////////////////////////////////////////////////////////////////////
//                  GLOBAL DECLARE
//////////////////////////////////////////////////////////////////////////
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


//////////////////////////////////////////////////////////////////////////
//                    COMPONENTS
//////////////////////////////////////////////////////////////////////////
export type ProxyComponentName = RegistreTypeComponent;


export type ComponentRegister = {
    type: string;
    component: React.FC<any>;
    defaultProps?: Record<string, any>;
    icon?: React.FC;
    category?: 'block' | 'interactive' | 'media' | 'complex' | 'misc';
    description?: string;
    nest?: ComponentRegisterNestMetaData 
}
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
export type Component = React.ReactElement & {
    props: ComponentProps
    onUpdate?: (newProps: any)=> void
    /** данные из прототипа компонента (регистра) */
    type: {
        parent?: string
    }
    _store?: {
        index: number
    }
}
export type ComponentSerrialize = {
    id: number
    /** id ячейки */
    parent: string
    props: ComponentProps
}


//////////////////////////////////////////////////////////////////////////////
//                        
//////////////////////////////////////////////////////////////////////////////
export type LayoutCustom = Layout & {
    /** id рендер элемента */
    content?: Component[]
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
    useDump: () => void
    desserealize: (component: ComponentSerrialize) => void
}


/////////////////////////////////////////////////////////////////////////////
//          Data Formats
/////////////////////////////////////////////////////////////////////////////
export type BlocData = {
    name: string
    data: {
        content: Record<string, ComponentSerrialize[]>
        layout: LayoutCustom[]
        meta: {
            scope: string
            name: string
            updatedAt: number
        }

        size: {
            width: number
            height: number
        }
    }
}
export type ScopeData = {
    name: string 
    data: BlocData[]
}


//////////////////////////////////////////////////////////////////////////////
//           DROP-DRAG ZONE              
//////////////////////////////////////////////////////////////////////////////
export type DraggbleElementProps = {
    component: Component
    index: number
    cellId: number
    useStop: (component: any, data: {x: number, y: number})=> void
    useDelete: (cellId: string | number, componentIndex: number)=> void
}
export type DropSlotProps = { 
    id: string
    dataTypesAccepts: ProxyComponentName[]
    children: React.ReactNode
    onAdd: (component: Component)=> void
}
export type ContextSlotProps = {
    nestedComponentsList: Record<ProxyComponentName, true>
    data: Record<string, ComponentSerrialize[]>
    size: {
        width: number
        height: number
    }
    idParent: number
    idSlot: number | string
}

// вложенный контекст
export type DataNested = { 
    content: Record<string, ComponentSerrialize[]>,
    size: { 
        width: number, 
        height: number 
    } 
}
export type SlotDataBus = {
    nestedComponentsList: Record<ProxyComponentName, true>
    data: DataNested
    idParent: number
    idSlot: number | string
}