import React, { useState } from "react";
import { LayoutCustom, ComponentSerrialize, ContentFromCell } from './type';
import { Responsive, WidthProvider, Layouts, Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "../../style/grid.css";
import "../../style/edit.css"
import context, { cellsContent, infoState } from './context';
import { hookstate, useHookstate } from "@hookstate/core";
import Draggable, { DraggableData } from 'react-draggable';
import { ToolBarInfo } from './RenderTools';
import { listAllComponents, listConfig } from './config/render';
import Tools from './ToolBar';

const ResponsiveGridLayout = WidthProvider(Responsive);
const margin: [number, number] = [5, 5];



// это редактор блоков сетки
export default function ({ height }) {
    const refs = React.useRef({});                                   // список всех рефов на все компоненты
    const [render, setRender] = React.useState<LayoutCustom []>([]);
    const containerRef = React.useRef(null);
    const info = useHookstate(infoState);                             // данные по выделенным обьектам
    const [rowHeight, setRowHeight] = React.useState(30);
    const layoutCellEditor = useHookstate(context.layout);            // синхронизация с редактором сетки
    const curCell = useHookstate(context.currentCell);                // текушая выбранная ячейка
    const cellsCache = useHookstate(cellsContent);                    // элементы в ячейках (dump из localStorage)
    
   
    // todo: здесь работаем
    const dumpRender =()=> {
        const cache = cellsCache.get({noproxy: true});
        const sizeContainer = {
            width: info.container.width.get(),
            height: info.container.height.get()
        }
        
        Object.keys(cache).map((idLayout)=> {
            //? рендер компоненты все свойства держат внутри props в data атрибутах 
            //? (но к ним нет доступа на запись после рендера)
            const findRenderLayot = render.find(l => l.i === idLayout);
            const cacheLayout = cache[idLayout];

            console.log(findRenderLayot);
            console.log(cacheLayout);
        });
    }
    // добавить/изменить пропс (применится везде/сохранится)
    const editRenderComponentProps =(component: ContentFromCell, data: Record<string, any>)=> {
        const cellId = curCell.get()?.i;
        const curCache = cellsCache.get({ noproxy: true });
        const clone = React.cloneElement(component, data);
        const id = clone.props['data-id'];

        if (curCache[cellId]) {
            const findIndex = curCache[cellId].findIndex(e => e.id === id);
            if(findIndex !== -1) {
                cellsCache.set((old)=> {
                    Object.keys(data).map((dataKey)=> {
                        const props = old[cellId][findIndex].props;
                        if(props) props[dataKey] = data[dataKey];
                    });
                    
                    return old;
                });
            }
        }
        // перерендер
        setRender((layers)=> {
            const newLayers = layers.map((layer)=> {
                if(Array.isArray(layer.content)) {
                    const findindex = layer.content.findIndex(c => c.props['data-id'] === id);
                    if(findindex !== -1) layer.content[findindex] = clone;
                }

                return layer;
            });

            return [...newLayers];
        });
    }
    const onSelectCell =(cell: LayoutCustom, target: HTMLDivElement)=> {
        curCell.set(cell);
        info.select.cell.set(target);
    }
    const serrialize =(component: React.ReactNode, cellId: string)=> {
        const serlz = JSON.stringify(component, null, 2);
        const rslz = JSON.parse(serlz);
        rslz.id = Date.now();
        rslz.parent = cellId;

        return rslz;
    }
    const desserealize =(component: ComponentSerrialize)=> {
        const type = component.props["data-type"];
        const Consolid = listAllComponents[type];

        if(Consolid) return (
            <Consolid 
                data-offset={component.offset}
                data-id={component.id}
                ref={(el) => {
                    if (el) refs.current[component.id] = el;
                }}
                { ...component.props } 
            />
        );
    }
    const addComponentToCell = (cellId: string, component: React.ReactNode) => {
        setRender((prev) => {
            const updatedRender = [...prev];
            const cellIndex = updatedRender.findIndex(item => item.i === cellId);

            if (cellIndex !== -1) {
                const cell = updatedRender[cellIndex];
                if(!Array.isArray(cell.content)) cell.content = [];


                const rsrlz = serrialize(component, cellId);
                const clone = React.cloneElement(component, 
                    { 
                        'data-id': rsrlz.id,
                        ref: (el)=> {
                            if(el) refs.current[rsrlz.id] = el;
                        }
                    }
                );
                cell.content.push(clone);

                cellsCache.set((old)=> {
                    if(!old[cellId]) old[cellId] = [rsrlz];
                    else old[cellId].push(rsrlz);
        
                    return old;
                });
            }
            return updatedRender;
        });
    }
    const removeComponentFromCell = (cellId: string, componentIndex: number) => {
        setRender((prev) => {
            const updatedRender = [...prev];
            const cellIndex = updatedRender.findIndex(item => item.i === cellId);
            
            if (cellIndex !== -1) {
                if(Array.isArray(updatedRender[cellIndex]?.content)) {
                    // Удаляем компонент из ячейки
                    updatedRender[cellIndex]?.content?.splice(componentIndex, 1);

                    cellsCache.set((old)=> {
                        const content = updatedRender[cellIndex].content;
                        //old[cellId].findIndex(e => e.id === )
                        old[cellId].splice(componentIndex, 1);
            
                        return old;
                    });
                }
            }
            return updatedRender;
        });
    }
    const useSetClassRef =(id: number|string, className: string)=> {
        setTimeout(()=> {
            if(refs.current[id]) refs.current[id].classList.add('editor-'+className);
        }, 300);
    }
    const useRemoveClassRef =(id: number|string|'all', className?: string)=> {
        setTimeout(()=> 
            Object.keys(refs.current).map((elId)=> {
                if(elId === String(id) || id === 'all') {
                    const el = refs.current[elId];

                    if(className) el.classList.remove('editor-' + className);
                    else el.classList.forEach((className: string) => {
                        if(className.includes('editor-')) el.classList.remove(className);
                    });
                }
            }), 200
        );
    }
    const dragableOnStop =(item: ContentFromCell, cellId: string, data: DraggableData)=> {
        editRenderComponentProps(
            item, 
            {'data-offset': { x: data.x, y: data.y }}
        );
    }
    const consolidation =(list: LayoutCustom[])=> {
        return list.map((layer)=> {
            const cache = cellsCache.get({ noproxy: true });
            const curCacheLayout = cache[layer.i];

            if(curCacheLayout) {
                const resultsLayer = [];

                Object.values(curCacheLayout).map((content)=> {
                    const result = desserealize(content);
                    if(result) resultsLayer.push(result);
                });
                layer.content = resultsLayer;
            }

            return layer;
        });
    }

    React.useEffect(() => {
        const cur = render;
        // Обновляем максимальное количество колонок
        const resizeObserver = new ResizeObserver(() => {
            if (containerRef.current) {
                const parentHeight = containerRef.current.clientHeight; // Получаем высоту родительского контейнера
                const containerWidth = containerRef.current.offsetWidth;

                info.container.height.set(parentHeight);
                info.container.width.set(containerWidth);

                // Рассчитываем количество строк, исходя из переданной схемы
                const maxY = Math.max(...cur.map((item) => item.y + item.h)); // Определяем максимальное значение по оси y
                const rows = maxY; // Количество строк = максимальное значение y + 1

                const totalVerticalMargin = margin[1] * (rows + 1); // Суммарные вертикальные отступы для всех строк
                const availableHeight = parentHeight - totalVerticalMargin; // Доступная высота без отступов

                setRowHeight(availableHeight / rows); // Вычисляем высоту строки
            }
        });

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }
        return () => {
            resizeObserver.disconnect();
        };
    }, [render]);
    React.useEffect(() => {
        const cur = layoutCellEditor.get({noproxy: true});
        console.log('layoutCellEditor: ', cur);

        if(cur[0]) setRender(cur);
    }, [layoutCellEditor]);
    React.useEffect(() => {
        const cache = localStorage.getItem('GRIDS');

        if (cache) {
            const loadData = JSON.parse(cache);
            const curName = Object.keys(loadData).pop();
            const result = consolidation(loadData[curName]);

            setRender(result);
            info.contentAllRefs.set(refs.current);
        }
    }, []);
    
    
    return(
        <div style={{width: '100%', height: '100%', display: 'flex', flexDirection: 'row'}}>
            <Tools
                addComponentToLayout={(elem)=> {
                    if(curCell.get()?.i) addComponentToCell(curCell.get().i, elem);
                }}
                useEditProps={editRenderComponentProps}
                useDump={dumpRender}
            />
            <div style={{width: '80%', height: '100%', display: 'flex', flexDirection: 'column'}}>
                <ToolBarInfo 
                    render={render}
                    useEditProps={editRenderComponentProps}
                />
                {/* область редактора сетки */}
                <div style={{width: '100%', height: height ? height+'%' : '100%'}} ref={containerRef}>
                <ResponsiveGridLayout
                    className="layout"
                    layouts={{ lg: render }}        // Схема сетки
                    breakpoints={{ lg: 0 }}         // Точки для респонсива
                    cols={{ lg: 12 }}
                    rowHeight={rowHeight}
                    compactType={null}              // Отключение автоматической компоновки
                    isDraggable={false}             // Отключить перетаскивание
                    isResizable={false}             // Отключить изменение размера
                    margin={margin}
                >
                    { render.map((layer) => (
                        <div 
                            onClick={(e)=> onSelectCell(layer, e.currentTarget)}
                            key={layer.i}
                            style={{ 
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                textAlign: "center", 
                                border: `1px dashed ${curCell.get()?.i === layer.i ? '#8ffb50b5' : '#fb505055'}`,
                                background: curCell.get()?.i === layer.i && 'rgba(147, 243, 68, 0.003)'
                            }} 
                        >
                            { Array.isArray(layer.content) && layer.content.map((component, index)=> (
                                <Draggable 
                                    grid={[10, 10]}
                                    defaultPosition={component.props['data-offset']}
                                    key={index}
                                    bounds="parent"
                                    onStart={(e, data)=> {
                                        info.select.content.set(component);
                                        useRemoveClassRef('all');
                                        useSetClassRef(component.props['data-id'], 'blink');
                                    }}
                                    onStop={(e, data)=> dragableOnStop(component, layer.i, data)}
                                >
                                    {/* ❗ новая фича style={{ width: 'fit-content' }} */}
                                    
                                    { component }
                                      
                                </Draggable>
                            ))}
                        </div>
                    ))}
                </ResponsiveGridLayout>
            </div>
            </div>
        </div>
    );
}