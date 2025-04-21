import React from "react";
import { LayoutCustom, Component } from './type';
import { Responsive, WidthProvider, Layouts, Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import context, { cellsContent, infoState, renderState } from './context';
import { hookstate, useHookstate } from "@hookstate/core";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, rectSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './Sortable';
import { canPlace, findFreeSpot } from './utils/editor';


const ResponsiveGridLayout = WidthProvider(Responsive);
const margin: [number, number] = [5, 5];


export default function ({ desserealize }) {
    const ctx = useHookstate(context);
    const render = useHookstate(renderState);
    const containerRef = React.useRef(null);
    const curCell = useHookstate(context.currentCell);                // текушая выбранная ячейка
    const info = useHookstate(infoState);                             // данные по выделенным обьектам
    const cellsCache = useHookstate(cellsContent);                    // элементы в ячейках (dump из localStorage)
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
    );


    // ANCHOR - изменение cellsCache (меняет позиции в массиве)
    const handleDragEnd = (event: DragEndEvent, cellId: string) => {
        const { active, over } = event;

        if (!active || !over || active.id === over.id) return;

        const currentList = cellsContent.get({ noproxy: true })[cellId];
        const oldIndex = currentList.findIndex((comp) => comp.props['data-id'] === active.id);
        const newIndex = currentList.findIndex((comp) => comp.props['data-id'] === over.id);

        if (oldIndex === -1 || newIndex === -1) return;

        // 🔁 Обновляем состояние через setRender
        render.set((prev) => {
            const updated = [...prev];
            const target = updated.find((c) => c.i === cellId);
            if (target?.content) {
                target.content = arrayMove(target.content, oldIndex, newIndex);
            }

            // ⚠️ Обновляем и cellsContent 
            cellsContent.set((old) => {
                old[cellId] = arrayMove(old[cellId], oldIndex, newIndex);
                return old;
            });

            return updated;
        });
    }
    const handleDragStart = (event, layer) => {
        const { active } = event;
        const render = renderState.get({ noproxy: true });

        const layerContent = render.find(r => r.i === layer.i)?.content ?? [];
        const currentComponent = layerContent.find(
            (c) => c.props['data-id'] === active.id
        );

        if (currentComponent) {
            //setSelectComponent(currentComponent);             //! для DragOverlay
            info.select.content.set(currentComponent);        // ✅ ReactNode

            document.querySelectorAll('[data-id]').forEach(el => {
                el.classList.remove('editor-selected');
            });
            const el = document.querySelector(`[data-id="${active.id}"]`);
            if (el) el.classList.add('editor-selected');
        }
    }
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
        const render = renderState.get({noproxy: true});
        if (event.key !== 'Delete') return;
      
        const selected = info.select.content.get({ noproxy: true });
        if (!selected) return;
      
        const id = selected.props?.['data-id'];
        if (!id) return;
        
        const cellId = render.find((layer) =>
            layer.content?.some?.((c) => c.props?.['data-id'] === id)
        )?.i;
        
        if (!cellId) return;
      
        const index = render.find((layer) => layer.i === cellId)
          ?.content?.findIndex((c) => c.props?.['data-id'] === id);
      
        if (index === -1 || index === undefined) return;
      
        removeComponentFromCell(cellId, index);
        info.select.content.set(null);
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
    const handleChangeLayout = (layout) => {
        ctx.layout.set((prev) =>
            prev.map((cell) => {
                const updated = layout.find((l) => l.i === cell.i);
                return updated ? { ...cell, ...updated } : cell;
            })
        );
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
        const cur = render.get();
        console.log('layouts: ', render.get({noproxy: true}));

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

                //setRowHeight(availableHeight / rows); // Вычисляем высоту строки
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
            if (find.data.size) ctx.size.set(find.data.size);
        }
    }, [ctx.meta.name, info.project]);
    React.useEffect(() => {
        document.addEventListener('keydown', handleDeleteKeyPress);
        EVENT.on('addCell', addNewCell);

        const layout = ctx.layout.get({noproxy:true});
        const result = consolidation(layout);
        render.set(result);

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
            ref={containerRef}
        >
            <ResponsiveGridLayout
                style={{ background: '#222222' }}
                className="GRID-EDITOR"
                layouts={{ lg: render.get({noproxy:true}) }}        // Схема сетки
                breakpoints={{ lg: 1200 }}         // Ширина экрана для переключения
                cols={{ lg: 12 }}                    // Количество колонок для каждого размера
                rowHeight={30}
                compactType={null}                                        // Отключение автоматической компоновки
                preventCollision={true}
                isDraggable={ctx.mod.get()==='grid' && true}             // Отключить перетаскивание
                isResizable={ctx.mod.get()==='grid' && true}             // Отключить изменение размера
                margin={margin}
                onLayoutChange={handleChangeLayout}
            >
                { render.get({ noproxy: true }).map((layer) => {
                    return(
                        <div 
                            onClick={(e) => {
                                curCell.set(layer);
                                info.select.cell.set(e.currentTarget);
                            }}
                            data-id={layer.i} 
                            key={layer.i}
                            style={{
                                overflowX: 'hidden',
                                overflowY: 'auto',
                                border: `1px dashed ${curCell.get()?.i === layer.i ? '#8ffb5030' : '#fe050537'}`,
                                background: curCell.get()?.i === layer.i && 'rgba(147, 243, 68, 0.003)'
                            }}
                        >
                            { EDITOR &&  
                                <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragEnd={(event) => handleDragEnd(event, layer.i)}
                                    onDragStart={(event) => handleDragStart(event, layer)}
                                >
                                    { Array.isArray(layer.content) &&
                                        <SortableContext
                                            items={layer.content.map((cnt) => cnt.props['data-id'])}
                                            strategy={rectSortingStrategy}
                                        >
                                            { Array.isArray(layer.content) && layer.content.map((component) => (
                                                <SortableItem 
                                                    key={component.props['data-id']} 
                                                    id={component.props['data-id']}
                                                >
                                                    { component }
                                                </SortableItem>
                                            ))}
                                        </SortableContext>
                                    }
                                </DndContext>
                            }
                            {/* ANCHOR - Вне редактора */}
                            { (!EDITOR && Array.isArray(layer.content)) && 
                                layer.content.map((component, index) => 
                                    <React.Fragment key={index}>
                                        { component }
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