import React from "react";
import { LayoutCustom, BlocData } from './type';
import { Responsive, WidthProvider, Layouts, Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import { useEditorContext, useRenderState, useCellsContent, useInfoState } from "./context";
import { hookstate, useHookstate } from "@hookstate/core";
import { arrayMove, SortableContext, verticalListSortingStrategy, rectSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './Sortable';
import { canPlace, findFreeSpot } from './utils/editor';
import { DroppableCell } from './Dragable';

const ResponsiveGridLayout = WidthProvider(Responsive);
const margin: [number, number] = [5, 5];



export default function ({ desserealize }) {
    const ctx = useHookstate(useEditorContext());
    const render = useHookstate(useRenderState());
    const gridContainerRef = React.useRef(null);                            // ref на главный контейнер редактора сетки                        
    const curCell = useHookstate(ctx.currentCell);                          // текушая выбранная ячейка
    const info = useHookstate(useInfoState());                              // данные по выделенным обьектам
    const cellsCache = useHookstate(useCellsContent());                     // элементы в ячейках


    const removeComponentFromCell = (cellId: string, componentIndex: number) => {
        //console.log(cellId, componentIndex);
        render.set((prev) => {
            const updatedRender = [...prev];
            const cellIndex = updatedRender.findIndex(item => item.i === cellId);

            if (cellIndex !== -1) {
                if (Array.isArray(updatedRender[cellIndex]?.content)) {
                    // Удаляем компонент из ячейки
                    updatedRender[cellIndex]?.content?.splice(componentIndex, 1);
                    // обновим наш dump
                    cellsCache.set((old) => {
                        old[cellId].splice(componentIndex, 1);

                        return old;
                    });
                }
            }

            return updatedRender;
        });
    }
    const handleDeleteKeyPress = (event: KeyboardEvent) => {
        const renderData = render.get({noproxy: true});
        if (event.key !== 'Delete') return;
      
        const selected = info.select.content.get({ noproxy: true });
        if (!selected) return;
      
        const id = selected.props?.['data-id'];
        if (!id) return;
        
        const cellId = renderData.find((layer) =>
            layer.content?.some?.((c) => c.props?.['data-id'] === id)
        )?.i;
        
        if (!cellId) return;
      
        const index = renderData.find((layer) => layer.i === cellId)
            ?.content?.findIndex((c) => c.props?.['data-id'] === id);
      
        if (index === -1 || index === undefined) return;
      
        removeComponentFromCell(cellId, index);
        info.select.content.set(null);
    }
    const consolidation = (layoutList: LayoutCustom[]) => {
        return layoutList.map((layer) => {
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
    const handleChangeLayout = (layout) => {
        ctx?.layout?.set((prev) =>
            prev?.map((cell) => {
                const updated = layout.find((l) => l.i === cell.i);
                return updated ? { ...cell, ...updated } : cell;
            })
        );
        
        render.set(consolidation(layout))
    }
    const addNewCell = () => {
        const all = render.get({ noproxy: true });
        const defaultW = 3;
        const defaultH = 2;
        const spot = findFreeSpot(defaultW, defaultH, all, 12);

        if (!spot) {
            console.warn('⛔ Нет свободного места');
            return;
        }

        const newId = `cell-${Date.now()}`;

        render.set((prev) => [
            ...prev,
            {
                i: newId,
                x: spot.x,
                y: spot.y,
                w: defaultW,
                h: defaultH,
                content: []
            }
        ]);
        ctx.layout.set((prev) => [
            ...prev,
            {
                i: newId,
                x: spot.x,
                y: spot.y,
                w: defaultW,
                h: defaultH,
                content: []
            }
        ]);

        cellsCache.set((old) => {
            old[newId] = [];
            return old;
        });
    }

    React.useEffect(() => {
        const cur = render.get({ noproxy: true });
        
        if (!cur || !cur.length) return;
        
        const resizeObserver = new ResizeObserver(() => {
            if (!gridContainerRef.current) return;

            const parentHeight = gridContainerRef.current.clientHeight;
            const containerWidth = gridContainerRef.current.offsetWidth;

            info.container.height.set(parentHeight);
            info.container.width.set(containerWidth);

            const maxY = Math.max(...cur.map((item) => item.y + item.h));
            console.log(maxY)
            const totalVerticalMargin = margin[1] * (maxY + 1);
            const availableHeight = parentHeight - totalVerticalMargin;
            // setRowHeight(availableHeight / maxY);
        });

        const ref = gridContainerRef.current;
        if (ref) resizeObserver.observe(ref);

        return () => {
            resizeObserver.disconnect();
            if (ref) resizeObserver.unobserve(ref); // ⬅️ важно: unobserve тот же ref
        }
    }, []);
    React.useEffect(() => {
        const meta = ctx?.meta?.get({ noproxy: true });
        // данные назначаются при старте из fetch
        const currentScope = info?.project?.get?.({ noproxy: true })?.[meta?.scope];
        const found: BlocData = currentScope?.find((obj) => obj.name === meta?.name);
        
       
        if (!found?.data) return;
        
        if (found.data.content) cellsCache.set(found.data.content);
        if (found.data.layout) {
            ctx.layout.set(found.data.layout);
            render.set(consolidation(found.data.layout));
        }
        if (found.data.size) {
            ctx.size.set((old) => ({ ...old, ...found.data.size }));
        }
    }, [ctx.meta.name, info.project]);
    React.useEffect(() => {
        document.addEventListener('keydown', handleDeleteKeyPress);
        EVENT.on('addCell', addNewCell);

        const layout = ctx.layout.get({noproxy:true});
        render.set(consolidation(layout ?? []));

        return () => {
            document.removeEventListener('keydown', handleDeleteKeyPress);
            EVENT.off('addCell', addNewCell);
        }
    }, []);
    
    
    
    return (
        <div 
            style={{ 
                margin: 5,
                maxWidth: ctx.size.width?.get() ?? '100%', 
                height: ctx.size.height?.get() ?? '100%',
                border: '1px dashed #fbfbfa26'
            }}
            ref={gridContainerRef}
        >
            <ResponsiveGridLayout
                style={{ background: '#222222' }}
                className="GRID-EDITOR"
                layouts={{ lg: render.get({noproxy:true}) }}                // Схема сетки
                breakpoints={{ lg: 1200 }}                                  // Ширина экрана для переключения
                cols={{ lg: 12 }}                                           // Количество колонок для каждого размера
                rowHeight={20}
                compactType={null}                                          // Отключение автоматической компоновки
                preventCollision={true}
                isDraggable={ctx.mod.get()==='grid' && true}                // Отключить перетаскивание
                isResizable={ctx.mod.get()==='grid' && true}                // Отключить изменение размера
                margin={margin}
                onLayoutChange={handleChangeLayout}
            >
                { render.get({ noproxy: true }).map((layer) => {
                    return(
                        <div 
                            onClick={(e) => {
                                // LINK (event) переключение на панель компонентов
                                if(curCell.get()?.i !== layer.i) {
                                    EVENT.emit('leftBarChange', {currentToolPanel: 'component'});
                                }
                                
                                curCell.set({ i: layer.i });
                                info.select.cell.set(e.currentTarget);
                                EVENT.emit('onSelectCell', layer.i);
                            }}
                            data-id={layer.i} 
                            key={layer.i}
                            style={{
                                overflowX: 'hidden',
                                overflowY: 'auto',
                                border: `1px dashed ${curCell.get()?.i === layer.i ? '#8ffb5030' : '#fe050537'}`,
                                background: curCell.get()?.i === layer.i && 'rgba(147, 243, 68, 0.003)',
                                height: '100%',
                                display: 'inline-flex',
                                width: '100%',
                                flexWrap: 'wrap',
                                alignItems: 'stretch',
                                alignContent: 'flex-start'
                            }}
                        >
                            <DroppableCell key={layer.i} id={layer.i}>
                                {EDITOR &&
                                    <SortableContext
                                        items={layer.content.map((cnt) => cnt.props['data-id'])}
                                        strategy={rectSortingStrategy}
                                    >
                                        {Array.isArray(layer.content) &&
                                            <>
                                                {Array.isArray(layer.content) && layer.content.map((component) => (
                                                    <SortableItem
                                                        key={component.props['data-id']}
                                                        id={component.props['data-id']}
                                                        cellId={layer.i}
                                                    >
                                                        {React.isValidElement(component)
                                                            ? component
                                                            : desserealize(component)
                                                        }
                                                    </SortableItem>
                                                ))}
                                            </>
                                        }
                                    </SortableContext>
                                }
                            </DroppableCell>
                            
                            {/* ANCHOR - Вне редактора */}
                            { (!EDITOR && Array.isArray(layer.content)) && 
                                layer.content.map((component, index) => 
                                    <React.Fragment key={index}>
                                        { React.isValidElement(component) ? component : desserealize(component) }
                                    </React.Fragment>
                                )
                            }
                        </div>
                    );
                })}
            </ResponsiveGridLayout>
        </div>
    );
}




/**
 *  React.useEffect(() => {
        const cur = render.get({ noproxy: true });

        if (cur && cur[0]) {
            console.log('layouts: ', cur);

            // Обновляем максимальное количество колонок
            const resizeObserver = new ResizeObserver(() => {
                if (gridContainerRef.current) {
                    const parentHeight = gridContainerRef.current.clientHeight; // Получаем высоту родительского контейнера
                    const containerWidth = gridContainerRef.current.offsetWidth;

                    info.container.height.set(parentHeight);
                    info.container.width.set(containerWidth);

                    // Рассчитываем количество строк, исходя из переданной схемы
                    const maxY = Math.max(...cur.map((item) => item.y + item.h)); // Определяем максимальное значение по оси y
                    const rows = maxY; // Количество строк = максимальное значение y + 1

                    const totalVerticalMargin = margin[1] * (rows + 1); // Суммарные вертикальные отступы для всех строк
                    const availableHeight = parentHeight - totalVerticalMargin; // Доступная высота без отступов
                    //setRowHeight(availableHeight / rows); // Вычисляем высоту строки
                }
            });

            if (gridContainerRef.current) {
                resizeObserver.observe(gridContainerRef.current);
            }

            return () => {
                resizeObserver.disconnect();
            }
        }
    }, [render]);
 */
/**
 * React.useEffect(() => {
        console.log('consolidation');
        const meta = ctx.meta.get();
        const currentScope = info.project?.get({ noproxy: true })?.[meta.scope];
        const find = currentScope?.find((obj) => obj.name === meta.name);

        if (find?.data) {
            if (find.data?.content) {
                cellsCache.set(find.data.content);
            }
            if (find.data?.layout) {
                ctx.layout.set(find.data.layout);
                const result = consolidation(find.data.layout);
                render.set(result);
            }
            if (find.data.size) ctx.size.set((old)=> ({ ...old, ...find.data.size }));
        }
    }, [ctx.meta.name, info.project]);
 */


/**
 *  if(!ctx.layout.get()[0]) {
            const parse = JSON.parse(cache);
            const curName = Object.keys(parse).pop();
            ctx.layout.set(parse[curName]);
            const result = consolidation(parse[curName])
            render.set(result)
        }
 */
/**
 *   React.useEffect(() => {
        const cur = layoutCellEditor.get({ noproxy: true });

        if (cur[0]) render.set((prev)=> {
            return cur.map((l) => l.name = l.content)
        });
    }, [layoutCellEditor]);
 */