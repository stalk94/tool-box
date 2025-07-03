import React from "react";
import { Responsive, WidthProvider, Layouts, Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import { ComponentSerrialize, MiniRenderSlotProps, LayoutCustom } from '../type';
import { desserealize } from '../helpers/sanitize';
import { getRelativeStylePercent } from '../helpers/editor';
import { generateRenderGridFileSafe, generateLiteralFromCells } from '../modules/export/_core';


const ResponsiveGridLayout = WidthProvider(Responsive);
const margin: [number, number] = [1, 1];



export default function MiniRender({ layouts, onReadyLiteral, size, type, anyRender }: MiniRenderSlotProps) {
    const [ready, setReady] = React.useState(false);
    const [breackpoint, setBreackpoint] = React.useState('lg');
    const [layotRender, setLayoytRender] = React.useState([]);

    // режим headles render
    const degidrateAll = async () => {
        const cacheIds = [];
        const resultCellsRender: Record<string, string[]> = {};

        await Promise.all(layouts.map(async (cell) => {
            const cellResults: string[] = [];

            if (!Array.isArray(cell.content)) return;

            await Promise.all(cell.content.map((comp) => {
                return new Promise<void>((resolve) => {
                    const id = comp.props['data-id'];

                    sharedEmmiter.emit('degidratation.' + id, {
                        call: (code: string) => {
                            if(!cacheIds.includes(id)) {
                                cellResults.push(code);
                                cacheIds.push(id);
                            }
                            resolve();
                        }
                    });
                });
            }));

            resultCellsRender[cell.i] = cellResults;
        }));

        if(type !== 'Area') {
            const fileCode = generateRenderGridFileSafe(resultCellsRender, layouts);
            onReadyLiteral(fileCode);
        }
        else onReadyLiteral(generateLiteralFromCells(resultCellsRender));
    }
    const useAbsolute =(component: ComponentSerrialize)=> {
        if(type === 'Area' && size.width && size.height) return({
            style: getRelativeStylePercent(
                component.props?.style,
                size.width,
                size.height
            )
        });
    }
    const useRender =(layout: LayoutCustom)=> {
        if(Array.isArray(layouts)) return layout.content;
        else if(layouts.content) return layouts.content[layout.i];
    }
    React.useEffect(()=> {
        if(!EDITOR) return;
        if(onReadyLiteral) degidrateAll();
    }, []);
    React.useEffect(()=> {
        if(Array.isArray(layouts)) {
            setBreackpoint('lg');
            setLayoytRender(structuredClone(layouts));
            setReady(true);
        }
        else if(layouts.layouts) {
            setLayoytRender(structuredClone(layouts.layouts[breackpoint]));
            setReady(true);
        }
    }, [breackpoint]);
    

    return(
        <div style={{ position: 'relative' }}>
            { anyRender }
            { (type !== 'Area' && ready) &&
                <ResponsiveGridLayout
                    className="GRID-SLOT"
                    layouts={{ [breackpoint]: layotRender }}
                    breakpoints={{ lg: 1100, md: 940, sm: 590, xs: 480 }}
                    cols={{ lg: 24, md: 16, sm: 12, xs: 8 }}
                    rowHeight={20}
                    compactType={null}                                          // Отключение автоматической компоновки
                    preventCollision={true}
                    isDraggable={false}                                         // Отключить перетаскивание
                    isResizable={false}                                         // Отключить изменение размера
                    margin={margin}
                    onBreakpointChange={(br)=> {
                        if(!Array.isArray(layouts)) setBreackpoint(br)
                    }}
                >
                    { layotRender.map((layer) => {
                        return (
                            <div
                                data-id={layer.i}
                                key={layer.i}
                                className={layer?.props?.classNames}
                                style={{
                                    ...layer?.props?.style,
                                    overflowX: 'hidden',
                                    overflowY: 'auto',
                                    height: '100%',
                                    display: 'inline-flex',
                                    width: '100%',
                                    flexWrap: 'wrap',
                                    alignItems: 'stretch',
                                    alignContent: 'flex-start',
                                    position: type === 'Area' ? 'relative' : 'static'
                                }}
                            >
                                {
                                    useRender(layer).map((component, index) =>
                                        <React.Fragment key={index}>
                                            {desserealize(
                                                component, 
                                                useAbsolute(component)
                                            )}
                                        </React.Fragment>
                                    )
                                }
                            </div>
                        );
                    })}
                </ResponsiveGridLayout>
            }

            { type === 'Area' && size.width && size.height &&
                <div style={{ width: size.width-5, height: size.height-5, position: 'relative' }}>
                    { layouts?.map((layer) => (
                        <React.Fragment key={layer.i}>
                            {Array.isArray(layer.content) && layer.content.map((component, index)=> (
                                <React.Fragment key={index}>
                                    {desserealize(
                                        component,
                                        useAbsolute(component)
                                    )}
                                </React.Fragment>
                            ))}
                        </React.Fragment>
                    ))}
                </div>
            }
        </div>
    );
}
