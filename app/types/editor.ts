import { LayoutCustom, Component, ComponentSerrialize } from '@bloc/type';


export type DataRenderLayout = LayoutCustom & {
    /** "cell-1745177681237" */
    i: string
}

export interface DataRenderGrid {
    layout: DataRenderLayout[]
    content: Record<string, ComponentSerrialize[]>
    size: {
        width: number
        height: number
    }
    meta: {
        /** имя рабочей области */
		scope: string
        /** имя данное в редакторе блоков */
		name: string
		updatedAt: number
        /** картинка превью из редактора  */
		preview: string
	}
}


export type RenderGridProps = {
    data: DataRenderGrid
    height?: number 
    marginCell: [number, number]
}
