import { Layout } from "react-grid-layout";
import { RegistreTypeComponent } from './config/type';
import React from 'react'
import EventEmitter from "../app/emiter";



//////////////////////////////////////////////////////////////////////////
//                  GLOBAL DECLARE
//////////////////////////////////////////////////////////////////////////
export interface Events {
    [key: string]: (data: any)=> void
    htmlRender: (data: { str: string; view:any })=> void
    jsonRender: (data: { call: (newJson: any)=> void })=> void
    leftBarChange: (data: any)=> void
    onSelectCell: (cellId: string|number)=> void
    // добавить новый layout grid (ячейку)
    addCell: ()=> void
    addGridContext: (data: SlotDataBus)=> void
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
    'data-slot'?: boolean | string | number
    apiPath?: string
    children ?: string | any
    style ?: React.CSSProperties
    styles?: any
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
    parent: string | number
    props: ComponentProps
}
export type DataRegisterComponent = {
    Component: React.FC;
    props: ComponentProps;
}

//////////////////////////////////////////////////////////////////////////////
//                        
//////////////////////////////////////////////////////////////////////////////
export type LayoutCustom = Layout & {
    /** массив компонентов */
    content?: ComponentSerrialize[]
    /** стилизация ячейки */
    props?: {
        style?: React.CSSProperties
        classNames?: string
    }
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
    isCell?: boolean
}
export type LeftToolPanelProps = {
    useDump: () => void
    desserealize: (component: ComponentSerrialize) => void
}


/////////////////////////////////////////////////////////////////////////////
//          Data Formats
/////////////////////////////////////////////////////////////////////////////
export type BlocData = {
    content: Record<string, ComponentSerrialize[]>
    layout: LayoutCustom[]
    meta: {
        scope: string
        name: string
        updatedAt: number
    }
    size: {
        breackpoint: 'lg' | 'md' | 'xs' | 'lm'
        width: number
        height: number
    }
}
export type ScopeData = {
    name: string 
    data: BlocData
}
/////////////////////////////////////////////////////////////////////////////
//          вложенный контекст (+ виртуализация)
////////////////////////////////////////////////////////////////////////////
export type DataNested = { 
    content: Record<string, ComponentSerrialize[]>
    layout: LayoutCustom[]
    size: { 
        width: number
        height: number 
    } 
}
export type NestedContext = { 
    useBackToEditorBase: (data: DataNested)=> void
    data: DataNested
    nestedComponentsList: Record<ProxyComponentName, {}>        //! это список render components доступных
    onChange: (newDataGrid: DataNested)=> void 
    headles?: boolean                                           // only headles render mod
    onReadyLiteral?: (code: string) => void                     // only headles render mod
}
export type SlotDataBus = {
    nestedComponentsList: Record<ProxyComponentName, true>
    data: DataNested
    idParent: number
    idSlot: number | string
}
export type ContextSlotProps = {
    nestedComponentsList: Record<ProxyComponentName, true>
    data: DataNested
    idParent: number
    idSlot: number | string
    type?: 'Frame' | 'Tabs' | 'Accordion'
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