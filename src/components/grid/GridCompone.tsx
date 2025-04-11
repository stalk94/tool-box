import React from "react";
import { LayoutCustom, ComponentSerrialize, ContentFromCell } from './type';
import { Responsive, WidthProvider, Layouts, Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "../../style/grid.css";
import "../../style/edit.css"
import context, { cellsContent, infoState } from './context';
import { hookstate, useHookstate } from "@hookstate/core";
import Draggable, { DraggableData } from 'react-draggable';



const ResponsiveGridLayout = WidthProvider(Responsive);
const margin: [number, number] = [5, 5];



export default function ({ render, setRender, height, desserealize }) {
    const refs = React.useRef({});                                   // список всех рефов на все компоненты
    const containerRef = React.useRef(null);
    const [rowHeight, setRowHeight] = React.useState(30);
    const curCell = useHookstate(context.currentCell);                // текушая выбранная ячейка
    const info = useHookstate(infoState);                             // данные по выделенным обьектам
    const layoutCellEditor = useHookstate(context.layout);            // синхронизация с редактором сетки
    const cellsCache = useHookstate(cellsContent);                    // элементы в ячейках (dump из localStorage)


    // добавить/изменить пропс (применится везде/сохранится)
    const editRenderComponentProps = (component: ContentFromCell, data: Record<string, any>, rerender?:boolean) => {
        const cellId = curCell.get()?.i;
        const curCache = cellsCache.get({ noproxy: true });
        const clone = React.cloneElement(component, data);
        const id = clone.props['data-id'];

        if (curCache[cellId]) {
            const findIndex = curCache[cellId].findIndex(e => e.id === id);
            if (findIndex !== -1) {
                cellsCache.set((old) => {
                    Object.keys(data).map((dataKey) => {
                        const props = old[cellId][findIndex].props;
                        if (props) props[dataKey] = data[dataKey];
                    });

                    return old;
                });
            }
        }
        // перерендер
        if(rerender) setRender((layers) => {
            const newLayers = layers.map((layer) => {
                if (Array.isArray(layer.content)) {
                    const findindex = layer.content.findIndex(c => c.props['data-id'] === id);
                    if (findindex !== -1) layer.content[findindex] = clone;
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
    const dragableOnStop = (item: ContentFromCell, cellId: string, data: DraggableData) => {
        const element = document.querySelector(`[data-id="${cellId}"]`);

        if(element) {
            const parentWidth = element.offsetWidth;
            const parentHeight = element.offsetHeight;
            const relativeX = parentWidth > 0 ? data.x / parentWidth : 0;
            const relativeY = parentHeight > 0 ? data.y / parentHeight : 0;

            editRenderComponentProps(
                item,
                { 'data-relative-offset': { x: relativeX, y: relativeY }, 
                    'data-offset': {x: data.x, y: data.y}
                },
            );
        }
    }
    const removeComponentFromCell = (cellId: string, componentIndex: number) => {
        setRender((prev) => {
            const updatedRender = [...prev];
            const cellIndex = updatedRender.findIndex(item => item.i === cellId);

            if (cellIndex !== -1) {
                if (Array.isArray(updatedRender[cellIndex]?.content)) {
                    // Удаляем компонент из ячейки
                    updatedRender[cellIndex]?.content?.splice(componentIndex, 1);

                    cellsCache.set((old) => {
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
    const handleDeleteKeyPress = (event) => {
        if (event.key === 'Delete') {
            if(info.select.content.get()) {
                const select = info.select.content.get({noproxy:true})
                if(select._store.index !== undefined) {
                    removeComponentFromCell(curCell.i?.get(), select._store.index);
                }
            }
        }
    }
    const consolidation = (list: LayoutCustom[]) => {
        return list.map((layer) => {
            const cache = cellsCache.get({ noproxy: true });
            const curCacheLayout = cache[layer.i];

            if (curCacheLayout) {
                const resultsLayer = [];

                Object.values(curCacheLayout).map((content) => {
                    const result = desserealize(content);
                    if (result) resultsLayer.push(result);
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
        const cur = layoutCellEditor.get({ noproxy: true });
        console.log('layoutCellEditor: ', cur);

        if (cur[0]) setRender(cur.map((l)=> l.name = l.content));
    }, [layoutCellEditor]);
    React.useEffect(() => {
        document.addEventListener('keydown', handleDeleteKeyPress);
        const cache = localStorage.getItem('GRIDS');
        
        if (cache) {
            const loadData = JSON.parse(cache);
            const curName = Object.keys(loadData).pop();
            const result = consolidation(loadData[curName]);

            setRender(result);
            info.contentAllRefs.set(refs.current);
        }

        return () => {
            document.removeEventListener('keydown', handleDeleteKeyPress);
        }
    }, []);

    
    return(
        <div style={{width: '100%', height: height ? height+'%' : '100%'}} ref={containerRef}>
        <ResponsiveGridLayout
            style={{background:'#222222'}}
            className="GRID-EDITOR"
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
                    data-id={layer.i}
                    onClick={(e) => onSelectCell(layer, e.currentTarget)}
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
                    { Array.isArray(layer.content) && layer.content.map((component, index) => (
                        <Draggable
                            grid={[10, 10]}
                            defaultPosition={component.props['data-offset']}
                            key={index}
                            bounds="parent"
                            onStart={(e, data) => {
                                component._store.index = index;
                                info.select.content.set(component);
                                useRemoveClassRef('all');
                                useSetClassRef(component.props['data-id'], 'blink');
                            }}
                            onStop={(e, data) => dragableOnStop(component, layer.i, data)}
                        >
                            {/* ❗ новая фича style={{ width: 'fit-content' }} */}
                           
                            { component }
                            
                        </Draggable>
                    ))}
                </div>
            ))}
        </ResponsiveGridLayout>
        </div>
    );
}
