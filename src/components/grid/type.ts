import { Responsive, WidthProvider, Layouts, Layout } from "react-grid-layout";


export type LayoutCustom = Layout & {
    /** id рендер элемента */
    content?: string
}

export type GridEditorProps = {
    setLayout: (old: Layout[])=> void
    layout: LayoutCustom[]
    renderItems: React.ReactNode[]
    tools: React.ReactNode
}