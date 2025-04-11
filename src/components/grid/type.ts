import { Responsive, WidthProvider, Layouts, Layout } from "react-grid-layout";


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
export type ContentFromCell = {
    props: {
        "data-type": string,
        "data-offset"?: { x: number; y: number },
        [key: string]: any
    }
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