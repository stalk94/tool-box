'use client'

import React from 'react';
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import { consolidation } from '../../src/bloc/module-export';
import { RenderGridProps, DataRenderLayout } from '../types/editor';

const ResponsiveGridLayout = WidthProvider(Responsive);
const marginDefault: [number, number] = [5, 5];



// todo: возможно будет еще mobail компоновка
export default function ({ data, height, marginCell }: RenderGridProps) {
    const [render, setRender] = React.useState<DataRenderLayout[]>([]);


    React.useEffect(()=> {
        const renderData = consolidation(data.layout, data.content);
        setRender(renderData);
    }, []);


    return(
        <div 
            data-meta={data.meta}
            data-name={data.meta?.name}
            style={{ 
                maxWidth: '100%',           // можно ограничить ширину но при этом сетка останется отзывчивой
                height: height ?? '100%',
            }}
        >
            <ResponsiveGridLayout
                className="GRID-RENDER"
                layouts={{ lg: render }}                            // ! изучить
                breakpoints={{ lg: 1200 }}                          // ! изучить
                cols={{ lg: 12 }}                                   // ! изучить
                rowHeight={30}
                compactType={null}                      // Отключение автоматической компоновки
                preventCollision={true}
                isDraggable={false}                     // Отключить перетаскивание
                isResizable={false}                     // Отключить изменение размера
                margin={marginCell ?? marginDefault}
            >
                { render.map((layer) => (
                    <div
                        key={layer.i}
                        data-id={layer.i}
                        style={{
                            overflowX: 'hidden',
                            overflowY: 'auto',
                        }}
                    >
                        { Array.isArray(layer.content) &&
                            layer.content.map((component, index) =>
                                <React.Fragment key={`${layer.i}-${index}`}>
                                    {/* ❗ нет обертки, надо сделать данные обертки */}
                                    { component }
                                </React.Fragment>
                            )
                        }
                    </div>
                ))}
            </ResponsiveGridLayout>
        </div>
    );
}