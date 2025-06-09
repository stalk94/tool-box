import React from 'react';
import { LayoutCustom, ComponentSerrialize } from '@bloc/type';
import { ssr } from '@bloc/module-export';
import type { GridSSRAdapterProps } from '../types';

const BREACKPOINTS = { lg: 1200, md: 960, sm: 600, xs: 480 };
const COLS = { lg: 12, md: 10, sm: 8, xs: 6 };



export default function GridSSRAdapter({layouts, gap=5, rowHeight=20, curBreacpoint='lg', contentCells }: GridSSRAdapterProps) {
    const desserealize = (component: ComponentSerrialize, data?: Record<string, any>) => {
        if(component) {
            const { props, parent } = component;
            const type = props["data-type"];
            const Component = ssr[type];
    
            if (!Component) {
                console.warn(`Компонент типа "${type}" не найден в реестре ssr`);
                return <div>в разработке</div>;
            }
    
            return (
                <Component
                    data-parent={parent ?? data.parent}
                    {...props}
                    {...data}
                />
            );
        }
    }
    const calculate = () => {
        const containerWidth = typeof window !== 'undefined'
            ? window.innerWidth
            : BREACKPOINTS[curBreacpoint];

        const curmaxCols = COLS[curBreacpoint];
        const colWidth = (containerWidth - gap * (curmaxCols - 1)) / curmaxCols;

        return colWidth;
    }


    return (
        <div
            className="grid-ssr-wrapper"
            style={{
                position: 'relative',
                width: '100vw',
                height: '100vh',
                maxWidth: '100%',
                overflowX: 'hidden',
            }}
        >
            {layouts[curBreacpoint].map((layer: LayoutCustom, index: number) => {
                const { i, x, y, w, h } = layer;
                const colWidth = calculate();
                const width = w * colWidth + (w - 1) * gap;
                const height = h * rowHeight + (h - 1) * gap;
                const left = x * colWidth + x * gap;
                const top = y * rowHeight + y * gap;

                return (
                    <div key={i}
                        style={{
                            position: 'absolute',
                            left,
                            top,
                            width,
                            height,
                            boxSizing: 'border-box',
                        }}
                    >
                        <div
                            style={{
                                width: '100%',
                                height: '100%',
                                minHeight: '100%',      // ?
                                overflowX: 'hidden',
                                overflowY: 'auto',
                                display: 'flex',        //inline-flex
                                flexWrap: 'wrap',
                                alignItems: 'stretch',
                                alignContent: 'flex-start'
                            }}
                        >
                            {contentCells[i].map((component)=> 
                                <div key={component.props['data-id']}
                                    style={{
                                        boxSizing: 'border-box',
                                        position: 'relative',
                                        width: component.props.fullWidth ? '100%' : (component.props.width ?? 300),
                                        display: 'flex',
                                        //alignItems: 'center',
                                        transformOrigin: 'center',
                                        flexShrink: 0,
                                        flexBasis: component.props.fullWidth ? '100%' : (component.props.width ?? 30),
                                        maxWidth: '100%',
                                        padding: 1
                                    }}
                                >
                                    { desserealize(component) }
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}