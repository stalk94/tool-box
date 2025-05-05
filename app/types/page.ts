export const BREAKPOINT_WIDTH = { lg: 1200, md: 960, sm: 600, xs: 460 } as const;


export type PageComponent = {
    props: {
        /** из какого scope блок привязанный */
        'data-block-scope': string  
        /** имя блока */
		'data-block-name': string 
        [key: string]: any
        'data-id': number | string
        'data-type': 'div'
        'data-variant'?: 'lg' | 'md' | 'sm'
        style: React.CSSProperties
    }
}
export type LayoutPage = {
    i: number
    content: PageComponent
}



/**
 * layout - это лист 
 */
export type DataRenderPage = {
	meta: {
		name: string
		title: string
	}
	variants: {
		lg: {
			layout: LayoutPage[]
			width: 1200
		}
		md: {
			layout: LayoutPage[]
			width: 960
		}
		sm: {
			layout: LayoutPage[],
			width: 600
		}
        xs: {
            layout: LayoutPage[],
			width: 460
        }
    }
}


export type RenderPageProps = {
    data: DataRenderPage
    marginCell: [number, number]
}