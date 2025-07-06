import { EditorContextType } from './context';
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
    blockSettings: (data: { type: 'header' | 'footer' })=> void
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
export type Breakpoint = 'lg' | 'md' | 'sm' | 'xs';


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
    'data-parent': string
    'data-group'?: any
    responsive?: boolean
    isArea?: boolean
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
//          type editor components                    
//////////////////////////////////////////////////////////////////////////////
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
    desserealize?: (component: ComponentSerrialize) => void
}
export type PropsSimpleList = {
    defaultValue?: 'number'
    size?: 'medium' | 'small' | 'large'
    src?: 'string'
    max?: 'number'
    [key: string] : any
}
export type SortableItemProps = { 
    id: number
    children: ComponentSerrialize
    cellId: string 
    isArea?: boolean            // только для nested context
    onSelectCell: ()=> void
}
export type MiniRenderSlotProps = {
    type?: 'Frame' | 'Area'
    layouts: LayoutCustom[] | BlocData
    size: {
        width: number 
        height: number 
    }
    anyRender?: React.ReactElement
    cellsContent: Record<string, ComponentSerrialize[]>
    onReadyLiteral?: (code: string | Structur )=> void
}

/////////////////////////////////////////////////////////////////////////////
//          Data Formats
/////////////////////////////////////////////////////////////////////////////
export type LayoutOptionBlockData = {
    url?: string
}
export type LayoutCustom = Layout & {
    /** массив компонентов */
    content?: ComponentSerrialize[] | ComponentSerrialize[][]
    /** стилизация ячейки */
    props?: {
        type: 'standart' | 'form' | ''
        'data-group'?: string
        options: LayoutOptionBlockData
        elevation?: number
        style?: React.CSSProperties
        classNames?: string
        nested?: {
            orientation: 'vertical' | 'horizontal'
            sizes: number[]
        }
    }
}
export type LayoutSystem = LayoutCustom & {
    type?: 'system'
    i: `system-${number}`
}
export type LayoutsBreackpoints = {
    lg: LayoutCustom[]
    md: LayoutCustom[]
    sm: LayoutCustom[]
    xs: LayoutCustom[]
}
export type PageMeta = {
    project: string
    scope: string
    name: string
    updatedAt: number
}
export type PageData = {
    /** список всех cell и serialize data component в них */
    content: Record<string, ComponentSerrialize[]>
    /** сетки */
    layouts: LayoutsBreackpoints
    meta: PageMeta
    size: {
        breackpoint: 'lg' | 'md' | 'xs' | 'sm'
        width: number
        height: number
    }
}
export type ScopeData = {
    [key: string]: {
        [key: string]: PageData
    }
}
export type BlockCategory = 'any' | 'favorite'
export type BlockData = {
    meta: {
        author: string | 'system'
        name: string
        category: BlockCategory
        preview: string
    }
    layouts: {
        lg: LayoutCustom,
        md: LayoutCustom,
        sm: LayoutCustom,
        xs: LayoutCustom
    }
    content: ComponentSerrialize[]
}
export type Story = {
    ctx: EditorContextType,
    cells: Record<string, ComponentSerrialize[]>
}

/////////////////////////////////////////////////////////////////////////////
//          вложенный контекст (+ виртуализация)
////////////////////////////////////////////////////////////////////////////
export type Guides = {
    x: number[]
    y: number[]
}
export type DataNested = { 
    content: Record<string, ComponentSerrialize[]>
    layout: LayoutCustom[]
    guides?: Guides
    size: { 
        width: number
        height: number 
    } 
}
export type NestedContext = { 
    isArea?: boolean
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
    isArea?: boolean
}
export type ContextSlotProps = {
    nestedComponentsList: Record<ProxyComponentName, true>
    data: DataNested
    idParent: number
    idSlot: number | string
    type?: 'Frame' | 'Tabs' | 'Accordion' | 'Area'
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

////////////////////////////////////////////////////////////////////////////////
//            RENDER
//////////////////////////////////////////////////////////////////////////////// 
export type RenderPageData = {
    header?: PageData
    body: PageData
    footer?: PageData
    html?: string
    meta: {
        title?: string
        description?: string
        path: string
    }
}

export type ProjectConfig = {
    theme: any
    style: string
    home: RenderPageData
    pages: {
        [key: string]: RenderPageData
    }
}