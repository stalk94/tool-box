import React from "react";
import { LayoutCustom, Component } from './type';
import { Responsive, WidthProvider, Layouts, Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import context, { cellsContent, infoState, renderState } from './context';
import { hookstate, useHookstate } from "@hookstate/core";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, } from '@dnd-kit/sortable';
import { SortableItem } from './Sortable';

const ResponsiveGridLayout = WidthProvider(Responsive);
const margin: [number, number] = [5, 5];



export default function ({ height, desserealize }) {
    const render = useHookstate(renderState);
    const containerRef = React.useRef(null);
    const [rowHeight, setRowHeight] = React.useState(30);
    const [selectComponent, setSelectComponent] = React.useState<Component | null>(null);
    const curCell = useHookstate(context.currentCell);                // текушая выбранная ячейка
    const info = useHookstate(infoState);                             // данные по выделенным обьектам
    const layoutCellEditor = useHookstate(context.layout);            // синхронизация с редактором сетки
    const cellsCache = useHookstate(cellsContent);                    // элементы в ячейках (dump из localStorage)
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
    );


    const handleDragStart = (event, layer) => {
        const { active } = event;
        const render = renderState.get({ noproxy: true });

        const layerContent = render.find(r => r.i === layer.i)?.content ?? [];
        const currentComponent = layerContent.find(
            (c) => c.props['data-id'] === active.id
        );

        if (currentComponent) {
            setSelectComponent(currentComponent);             // для DragOverlay
            info.select.content.set(currentComponent);        // ✅ ReactNode

            document.querySelectorAll('[data-id]').forEach(el => {
                el.classList.remove('editor-selected');
            });
            const el = document.querySelector(`[data-id="${active.id}"]`);
            if (el) el.classList.add('editor-selected');
        }
    }
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
    const removeComponentFromCell = (cellId: string, componentIndex: number) => {
        //console.log(cellId, componentIndex);
        render.set((prev) => {
            const updatedRender = [...prev];
            const cellIndex = updatedRender.findIndex(item => item.i === cellId);

            if (cellIndex !== -1) {
                if (Array.isArray(updatedRender[cellIndex]?.content)) {
                    // Удаляем компонент из ячейки
                    updatedRender[cellIndex]?.content?.splice(componentIndex, 1);

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
            layer.content?.some((c) => c.props?.['data-id'] === id)
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

    React.useEffect(() => {
        const cur = render.get();

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

        if (cur[0]) render.set((prev)=> {
            return cur.map((l) => l.name = l.content)
        });
    }, [layoutCellEditor]);
    React.useEffect(() => {
        document.addEventListener('keydown', handleDeleteKeyPress);
        const cache = localStorage.getItem('GRIDS');

        if (cache) {
            const loadData = JSON.parse(cache);
            const curName = Object.keys(loadData).pop();
            const result = consolidation(loadData[curName]);

            render.set(result);
        }

        return () => {
            document.removeEventListener('keydown', handleDeleteKeyPress);
        }
    }, []);


    return (
        <div style={{ width: '100%', height: height ? height + '%' : '100%' }} ref={containerRef}>
            <ResponsiveGridLayout
                style={{ background: '#222222' }}
                className="GRID-EDITOR"
                layouts={{ lg: render.get() }}        // Схема сетки
                breakpoints={{ lg: 0 }}         // Точки для респонсива
                cols={{ lg: 12 }}
                rowHeight={rowHeight}
                compactType={null}              // Отключение автоматической компоновки
                isDraggable={false}             // Отключить перетаскивание
                isResizable={false}             // Отключить изменение размера
                margin={margin}
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
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                textAlign: "center",
                                gap: 4,             //!
                                border: `1px dashed ${curCell.get()?.i === layer.i ? '#8ffb50b5' : '#fb505055'}`,
                                background: curCell.get()?.i === layer.i && 'rgba(147, 243, 68, 0.003)'
                            }}
                        >
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={(event) => handleDragEnd(event, layer.i)}
                                onDragStart={(event) => handleDragStart(event, layer)}
                            >
                                { Array.isArray(layer.content) &&
                                    <SortableContext
                                        items={layer.content.map((cnt) => cnt.props['data-id'])}
                                        strategy={verticalListSortingStrategy}
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
                        </div>
                    );
                })}
            </ResponsiveGridLayout>
        </div>
    );
}