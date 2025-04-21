'use client'
import React from 'react';
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import { RenderPageProps, LayoutPage, PageComponent } from '../types/page';
import RenderBlock from './RenderBlock';

const ResponsiveGridLayout = WidthProvider(Responsive);
const marginDefault: [number, number] = [5, 5];




export default function ({ data, marginCell }: RenderPageProps) {
    const [name, setName] = React.useState<string>(data.meta.name);
    const [currentBreakpoint, setCurrentBreakpoint] = React.useState('lg');
    const [layouts, setLayouts] = React.useState<Record<'lg'|'md'|'sm', LayoutPage[]>>({
        lg: [],
        md: [],
        sm: []
    });

    
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
    const createComponent =(serrializeContent: PageComponent)=> {
        const scope = serrializeContent.props['data-block-scope'];
        const nameBlock = serrializeContent.props['data-block-name'];

        if (!scope || !nameBlock) return <div>Ошибка данных блока</div>;

        return(
            <RenderBlock
                scope={scope}
                name={nameBlock}
            />
        );
    }
    React.useEffect(() => {
        if (data) {
            setName(data.meta.name);
            const layoutsFromData: Record<'lg' | 'md' | 'sm', LayoutPage[]> = {};

            Object.entries(data.variants).forEach(([key, value]) => {
                if(value?.layout) layoutsFromData[key as 'lg' | 'md' | 'sm'] = value.layout;
            });

            setLayouts(layoutsFromData);
        }
    }, [data]);


    return(
        <div 
            data-meta={data.meta}
            data-name={data.meta?.name}
            style={{ 
                maxWidth: '100%',           // можно ограничить ширину но при этом сетка останется отзывчивой
                height: '100%',
            }}
        >
            <ResponsiveGridLayout
                className="GRID-PAGE"
                layouts={layouts}                           
                breakpoints={{ lg: 1200, md: 960, sm: 600, xs: 460 }}
                cols={{ lg: 12, md: 12, sm: 12, xs: 12 }}                                  
                rowHeight={30}      
                compactType={null}                      // Отключение автоматической компоновки
                preventCollision={true}
                isDraggable={false}                     // Отключить перетаскивание
                isResizable={false}                     // Отключить изменение размера
                margin={marginCell ?? marginDefault}
                onBreakpointChange={(breakpoint) => {
                    setCurrentBreakpoint(breakpoint);
                }}
            >
                { getClosestLayout(currentBreakpoint).map((layout: LayoutPage)=> (
                    <div
                        key={layout.i}
                        data-id={layout.i}
                        data-variant={currentBreakpoint}
                        style={{
                            width: '100%',
                            overflow: 'hidden',
                            ...layout?.content?.props?.style
                        }}
                    >
                        { createComponent(layout?.content) }
                    </div>
                ))}
            </ResponsiveGridLayout>
        </div>
    );
}