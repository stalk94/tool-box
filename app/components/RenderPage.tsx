'use client'
import React from 'react';
import { DataRenderPage, LayoutPage, BREAKPOINT_WIDTH } from '../types/page';
import RenderBlock from './RenderBlock';
import { requestLlama } from '@system/helpers/ai';


type Props = {
    schema: DataRenderPage
    breakpoint?: 'lg' | 'md' | 'sm' | 'xs'
    headerBlock?: DataRenderPage
    footerBlock?: DataRenderPage
}

const test =()=> {
    requestLlama({
            vars: {
                id: 'test', 
                scope: 'test', 
                name: 'test', 
                description: 'Надо 4 компонента. Два поля ввода текста и две кнопки'
            }
        }).then((resp)=> {
            console.log(resp.response)
        })
}
//test()


/** ! РЕНДЕР В ПРОЕКТЕ (не эдитор)  */
export default function RenderPage({ schema, breakpoint = 'lg', headerBlock, footerBlock }: Props) {
    const [blocks, setBlocks] = React.useState<Record<string, any>>({})
    const [layout, setLayout] = React.useState<LayoutPage[]>([])
    const variantOrder: ('lg' | 'md' | 'sm' | 'xs')[] = ['lg', 'md', 'sm', 'xs'];


    React.useEffect(() => {
        const currentIndex = variantOrder.indexOf(breakpoint);

        for (let i = currentIndex; i >= 0; i--) {
            const variant = schema.variants[variantOrder[i]];

            if (variant?.layout?.length) {
                setLayout(variant.layout);
                return
            }
        }

        for (let i = currentIndex + 1; i < variantOrder.length; i++) {
            const variant = schema.variants[variantOrder[i]];

            if (variant?.layout?.length) {
                setLayout(variant.layout);
                return
            }
        }

        setLayout([]);
    }, [schema, breakpoint]);
    React.useEffect(() => {
        const loadBlocks = async () => {
            const loaded: Record<string, any> = {}

            await Promise.all(layout.map(async (cell) => {
                const { props } = cell.content;
                const scope = props['data-block-scope'];
                const name = props['data-block-name'];
                const id = `${scope}/${name}`;

                if (!loaded[id]) {
                    try {
                        const res = await fetch(`/blocks/${scope}/${name}.json`);
                        if (res.ok) {
                            loaded[id] = await res.json();
                        } 
                        else {
                            console.warn(`Блок не найден: ${id}`);
                        }
                    } 
                    catch (err) {
                        console.error(`Ошибка загрузки блока: ${id}`, err);
                    }
                }
            }));

            setBlocks(loaded);
        }

        if (layout.length > 0) {
            loadBlocks();
        }
    }, [layout]);
   

    return(
        <div className="render-page">
            { headerBlock && (
                <div className="render-header">
                    <RenderPage 
                        schema={headerBlock} 
                        breakpoint={breakpoint} 
                    />
                </div>
            )}
            
            <div className="render-body">
                { layout.map((cell, index) => {
                    const props = cell.content?.props
                    const scope = props?.['data-block-scope']
                    const name = props?.['data-block-name']
                    const id = `${scope}/${name}`
                    const block = blocks[id]

                    return (
                        <div key={index} className="render-cell">
                            { block ? (
                                <RenderBlock 
                                    data={block} 
                                    preview={true}          // убираем вспомогательные стили
                                />
                            ) : (
                                <div className="render-placeholder">
                                    Загрузка блока {id}...
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            { footerBlock && (
                <div className="render-footer">
                    <RenderPage schema={footerBlock} breakpoint={breakpoint} />
                </div>
            )}
        </div>
    );
}