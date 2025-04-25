'use client'
import React from "react";
import { Responsive, WidthProvider, Layouts, Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import { useEditor } from './context';
import { RenderPageProps, LayoutPage, PageComponent } from '../../types/page';
import RenderBlock from '../RenderBlock';
import { DataRenderGrid } from '../../types/editor';


const ResponsiveGridLayout = WidthProvider(Responsive);
const marginDefault: [number, number] = [5, 5];
export const BREAKPOINT_WIDTH = { lg: 1200, md: 960, sm: 600, xs: 460 } as const;


// решить проблему с высотой блоков (ее можно получить из схемы)
// получить breacpoint key для блоков исходя из size их схемы
export default function WorkArea({ marginCell }: RenderPageProps) {
    const { curentPageData, curentPageName, curBreacpoint, setCurBreacpoint, selectBlockData, setSelectBlockData } = useEditor();
    const [layouts, setLayouts] = React.useState<Record<'lg' | 'md' | 'sm' | 'xs', LayoutPage[]>>({
        lg: [],
        md: [],
        sm: [],
        xs: []
    });
    

    const pixelsToH =(heightPx: number, rowHeight: number, marginY: number)=> {
        return Math.ceil((heightPx + marginY) / (rowHeight + marginY));
    }
    const getClosestLayout = (bp: string): LayoutPage[] => {
        const order: string[] = ['lg', 'md', 'sm', 'xs'];
        const start = order.indexOf(bp);

        for (let i = start; i >= 0; i--) {
            const layout = layouts[order[i] as keyof typeof layouts];
            if (layout && layout.length > 0) {
                return layout;
            }
        }

        // fallback: попробуем вверх по приоритету
        for (let i = start + 1; i < order.length; i++) {
            const layout = layouts[order[i] as keyof typeof layouts];
            if (layout && layout.length > 0) {
                return layout;
            }
        }

        return []; // вообще ничего нет
    }
    const createComponent = (layout: LayoutPage) => {
        const serrializeContent = layout.content;
        const scope = serrializeContent?.props?.['data-block-scope'];
        const nameBlock = serrializeContent?.props?.['data-block-name'];
        
        
        if (!scope || !nameBlock) return <div>Ошибка данных блока</div>;
        else return (
            <RenderBlock
                scope={scope}
                name={nameBlock}
            />
        );
    }
    const addBlockToPage = (data: DataRenderGrid) => {
        const variantLayout: { 
            layout: LayoutPage[],
            size: { width: number, height: number } 
        } = curentPageData.variants[curBreacpoint];

        if (!variantLayout) variantLayout[curBreacpoint] = {
            layout: undefined satisfies LayoutPage,
            size: { width: BREAKPOINT_WIDTH[curBreacpoint], height: '100%' }
        }
        
        const layout = curentPageData.variants[curBreacpoint].layout ?? [];
        const newId = `block-${Date.now()}`;
        const pxTh = pixelsToH(data.size.height, 30, (marginCell?.[1] ?? marginDefault[1]));
        
        // LINK - добавление нового блока
        const newBlock: LayoutPage = {
            i: newId,
            x: 0,
            y: layout.length * 2,                                               // разместим ниже всех
            w: 12,
            h: pxTh,
            moved: false,
            static: false,
            content: {
                props: {
                    'data-block-scope': data.meta.scope,
                    'data-block-name': data.meta.name,
                    style: {
                        
                    }
                }
            }
        };

        layout.push(newBlock);
        setLayouts((prev) => ({
            ...prev,
            [curBreacpoint]: [...layout]
        }));
        setSelectBlockData(null);

        //? костыль для next
        const memory = curBreacpoint;
        setCurBreacpoint('m');
        setTimeout(()=> setCurBreacpoint(memory), 600);
    }
    React.useEffect(() => {
        if (curentPageData) {
            const layoutsFromData: Record<('lg' | 'md' | 'sm' | 'xs'), LayoutPage[]> = {};

            Object.entries(curentPageData.variants).forEach(([key, value]) => {
                if (value?.layout) layoutsFromData[key as 'lg' | 'md' | 'sm' | 'xs'] = value.layout;
            });
            

            setLayouts(layoutsFromData);
        }
    }, [curentPageData]);
    React.useEffect(()=> {
        if(selectBlockData) addBlockToPage(selectBlockData);
    }, [selectBlockData]);
    const layoutList = getClosestLayout(curBreacpoint);
    

    return (
        <div
            data-name={curentPageName}
            style={{
                overflow: 'auto',
                display: 'flex',
                justifyContent: 'center',
                border: '1px solid gray',
                height: '100%',
            }}
        >
            <div
                style={{
                    width: BREAKPOINT_WIDTH[curBreacpoint] ?? '100%',                    //? меняем ширину и меняется layout
                    height: 'fit-content'
                }}
            >
                <ResponsiveGridLayout
                    className="GRID-PAGE"
                    layouts={{ [curBreacpoint]: layoutList }}
                    breakpoints={BREAKPOINT_WIDTH}
                    cols={{ lg: 12, md: 12, sm: 12, xs: 12 }}
                    rowHeight={29}
                    containerPadding={[0, 0]}
                    compactType={null}                      // Отключение автоматической компоновки
                    preventCollision={false}
                    isDraggable={true}                     // Отключить перетаскивание
                    isResizable={false}                     // Отключить изменение размера
                    margin={marginCell ?? marginDefault}
                >
                    { layoutList?.map((layout: LayoutPage) => (
                        <div 
                            key={layout.i} 
                            data-grid-id={layout.i} 
                            style={{ width: '100%'}}
                        >
                            { createComponent(layout) }
                        </div>
                    ))}
                </ResponsiveGridLayout>
            </div>
        </div>
    );
}
