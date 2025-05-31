import React from "react";
import { Responsive, WidthProvider, Layouts, Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import { LayoutCustom, ComponentSerrialize } from '../type';
import { desserealize, getRelativeStylePercent } from '../helpers/sanitize';
import { generateRenderGridFileSafe } from './shim';


type MiniRenderSlotProps = {
    type?: 'Frame' | 'Area'
    layouts: LayoutCustom[]
    size: {
        width: number 
        height: number 
    }
    cellsContent: Record<string, ComponentSerrialize[]>
    onReadyLiteral?: (code: string)=> void
}
const ResponsiveGridLayout = WidthProvider(Responsive);
const margin: [number, number] = [1, 1];



export default function MiniRender({ layouts, onReadyLiteral, size, type }: MiniRenderSlotProps) {
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

        const fileCode = generateRenderGridFileSafe(resultCellsRender, layouts);
        onReadyLiteral(fileCode);
    }
    const useAbsolute =(component: ComponentSerrialize)=> {
        if(type === 'Area') return({
            style: getRelativeStylePercent(
                component.props?.style,
                size.width,
                size.height
            )
        });
    }
    React.useEffect(()=> {
        if(onReadyLiteral) degidrateAll();
    }, []);
    

    return(
        <div style={{ position: 'relative' }}>
            { type !== 'Area' &&
                <ResponsiveGridLayout
                    className="GRID-SLOT"
                    layouts={{ lg: structuredClone(layouts) ?? [] }}                                   // Схема сетки
                    breakpoints={{ lg: 1200 }}                                  // Ширина экрана для переключения
                    cols={{ lg: 12 }}                                           // Количество колонок для каждого размера
                    rowHeight={21}
                    compactType={null}                                          // Отключение автоматической компоновки
                    preventCollision={true}
                    isDraggable={false}                                         // Отключить перетаскивание
                    isResizable={false}                                         // Отключить изменение размера
                    margin={margin}
                    //onLayoutChange={console.log}
                >
                    { layouts?.map((layer) => {
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
                                { Array.isArray(layer.content) &&
                                    layer.content.map((component, index) =>
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

            { type === 'Area' &&
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
