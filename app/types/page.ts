import { Layout } from "react-grid-layout";



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
export type LayoutPage = Layout & {
    x: 0
    w: 12
    content: PageComponent
}

type LgSize = {
    width: 1200,
    heigh: number
}
type MdSize = {
    width: 960,
    heigh: number
}
type SmSize = {
    width: 480,
    heigh: number
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
			layout: LayoutPage[],
			size: LgSize
		}
		md: {
			layout: LayoutPage[],
			size: MdSize
		}
		sm: {
			layout: LayoutPage[],
			size: SmSize
		}
    }
}

export type RenderPageProps = {
    data: DataRenderPage
    marginCell: [number, number]
}