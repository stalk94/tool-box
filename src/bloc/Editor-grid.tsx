import React from "react";
import { LayoutCustom, BlocData } from './type';
import { Responsive, WidthProvider, Layouts, Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import { editorContext, infoSlice, renderSlice, cellsSlice } from "./context";
import { arrayMove, SortableContext, verticalListSortingStrategy, rectSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './Sortable';
import { findFreeSpot, stackHorizont, stackVertical } from './helpers/editor';
import { DroppableCell } from './Dragable';
import Container from '@mui/material/Container';

const ResponsiveGridLayout = WidthProvider(Responsive);
const margin: [number, number] = [5, 5];



export default function ({ desserealize }) {
    const rowHeight = 20;
    const [ready, setReady] = React.useState(false);
    const size = editorContext.size.use();
    const mod = editorContext.mod.use();
    const layouts = editorContext.layout.use();
    const meta = editorContext.meta.use();
    const project = infoSlice.project.use();
    const gridContainerRef = React.useRef(null);                            // ref на главный контейнер редактора сетки                        
    const render = renderSlice.use();
    const curCell = editorContext.currentCell.use();                        // текушая выбранная ячейка
    

    const removeComponentFromCell = (cellId: string, componentIndex: number) => {
        renderSlice.set((prevRender) => {
            const cellIndex = prevRender.findIndex(item => item.i === cellId);

            if (cellIndex !== -1) {
                if (Array.isArray(prevRender[cellIndex]?.content)) {
                    // Удаляем компонент из ячейки
                    prevRender[cellIndex]?.content?.splice(componentIndex, 1);
                }
            }
        });

        cellsSlice.set((old) => {
            old[cellId].splice(componentIndex, 1);
            return old;
        });

        editorContext.layout.set((layer) => {
            layer = layer.map((lay) => {
                lay.content.splice(componentIndex, 1);
                return lay;
            });
        });
    }
    const handleDeleteKeyPress = (event: KeyboardEvent) => {
        const renderData = renderSlice.get();
        if (event.key !== 'Delete') return;

        const selected = infoSlice.select.content?.get();
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
        infoSlice.select.content.set(null);
    }
    const consolidation = (layoutList: LayoutCustom[]) => {
        return layoutList.map((layer) => {
            const copyLayer = structuredClone(layer);
            const cache = cellsSlice.get();
            const curCacheLayout = cache[layer.i];

            copyLayer.content = [];

            if (curCacheLayout) {
                for (const content of Object.values(curCacheLayout)) {
                    const result = desserealize(content);
                    if (result) copyLayer.content.push(result);
                }
            }

            return copyLayer;
        });
    }
    const handleChangeLayout = (layoutList: LayoutCustom[]) => {
        editorContext.layout?.set((prev) =>
            prev.map((cell) => {
                const updatedLayout = layoutList.find((l) => l.i === cell.i);

                if (updatedLayout) Object.keys(updatedLayout).map((key) => {
                    if (key !== 'content') cell[key] = updatedLayout[key];
                });
                cell.content = [];

                return cell;
            })
        );

        renderSlice.set(consolidation(layoutList));
    }
    const delCellData = (idCell: string) => {
        renderSlice.set((prev) => prev.filter((cell) => cell.i !== idCell));
        editorContext.layout.set((prev) => prev.filter((cell) => cell.i !== idCell));

        // Удаляем содержимое из кэша
        cellsSlice.set((old) => {
            delete old[idCell];
            return old;
        });
    }
    const addCellData = (cells: any[], clean?: 'all' | string) => {
        if (clean === 'all') render.map((cell) => delCellData(cell.i));
        else if (clean && clean !== 'all') delCellData(clean);

        cells.map((cell, index) => {
            cell.i = cell.i ?? `cell-${Date.now() + index}`;

            renderSlice.set((prev) => {
                prev.push(cell);
            });
            editorContext.layout.set((prev) => {
                prev.push(cell);
            });
            cellsSlice.set((old) => {
                old[cell.i] = [];
            });
        });
    }
    const addNewCell = () => {
        const defaultW = 3;
        const defaultH = 2;
        const spot = findFreeSpot(defaultW, defaultH, render, 12);

        if (!spot) {
            console.warn('⛔ Нет свободного места');
            return;
        }
        addCellData([{
            i: `cell-${Date.now()}`,
            x: spot.x,
            y: spot.y,
            w: defaultW,
            h: defaultH,
            props: {
                classNames: '',
                style: {}
            },
            content: []
        }]);
    }

   
    React.useEffect(() => {
        const currentScope = project?.[meta?.scope];
        const found: BlocData = currentScope?.find((obj) => obj.name === meta?.name);
       
        if (!found?.data) return;
        
        cellsSlice.set({});
        renderSlice.set([]);
        editorContext.layout.set([]);
        editorContext.currentCell.set(undefined);
        editorContext.size.set({ width: 0, height: 0, breackpoint: 'lg' });

        // ✅ устанавливаем layout и content
        if (found.data.content) cellsSlice.set(found.data.content);
        if (found.data.layout) editorContext.layout.set(found.data.layout);
        if (found.data.size) {
            editorContext.size.width.set(found.data.size.width);
            editorContext.size.height.set(found.data.size.height);
        }

        // ✅ defer render slice
        setTimeout(() => {
            const freshLayout = editorContext.layout.get(); // важно: получаем уже обновлённый layout
            const result = consolidation(freshLayout); // применяем на актуальном layout
            renderSlice.set(result); // безопасно
        }, 0);
    }, [meta.name, project]);
    React.useEffect(() => {
        document.addEventListener('keydown', handleDeleteKeyPress);
        EVENT.on('addCell', addNewCell);

        //renderSlice.set(consolidation(layouts ?? []));

        return () => {
            document.removeEventListener('keydown', handleDeleteKeyPress);
            EVENT.off('addCell', addNewCell);
        }
    }, []);
    React.useEffect(() => {
        const resizeObserver = new ResizeObserver(() => {
            if (!gridContainerRef.current) return;

            const parentHeight = gridContainerRef.current.clientHeight;
            const containerWidth = gridContainerRef.current.offsetWidth;
            
            if (containerWidth > 0) {
                infoSlice.container.height.set(parentHeight);
                infoSlice.container.width.set(containerWidth);
                setReady(true);             // ✅ разрешаем рендер grid
            }

            const maxY = Math.max(...render.map((item) => item.y + item.h));
            console.log(`%c max y cell : ${maxY}`, 'color: orange; font-weight: bold;');
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
    }, [meta.name]);
  
    
    
    return (
        <Container 
            sx={{
                height: (size.height + 10) ?? '99%', 
                overflowY: 'hidden'
            }}
        >
        <div
            style={{ 
                margin: 1,
                maxWidth: size.width ?? '100%', 
                height: '99%',
                border: '1px dashed #fbfbfa26',
                overflowY: 'auto',
            }}
            ref={gridContainerRef}
        >
            {ready &&
            <ResponsiveGridLayout
                key={`${meta.scope}-${meta.name}`}
                style={{ background: '#222222', height: (size.height - 10) ?? '99%', }}
                className="GRID-EDITOR"
                layouts={{ lg: layouts }}                // Схема сетки
                breakpoints={{ lg: 1200 }}                                  // Ширина экрана для переключения
                cols={{ lg: 12 }}                                           // Количество колонок для каждого размера
                rowHeight={rowHeight}
                compactType={null}                                          // Отключение автоматической компоновки
                preventCollision={true}
                isDraggable={mod === 'grid' && true}                // Отключить перетаскивание
                isResizable={mod === 'grid' && true}                // Отключить изменение размера
                margin={margin}
                onLayoutChange={handleChangeLayout}
            >
                { render?.map((layer) => {
                    
                    return(
                        <div 
                            onClick={(e) => {
                                // LINK (event) переключение на панель компонентов
                                if(curCell?.i !== layer.i) {
                                    EVENT.emit('leftBarChange', {currentToolPanel: 'component'});
                                }
                                
                                editorContext.currentCell.set({ i: layer.i });
                                infoSlice.select.cell.set(e.currentTarget);
                                EVENT.emit('onSelectCell', layer.i);
                            }}
                            data-id={layer.i} 
                            key={layer.i}
                            className={layer?.props?.classNames}
                            style={{
                                ...layer?.props?.style,
                                overflowX: 'hidden',
                                overflowY: 'auto',
                                border: `1px dashed ${curCell?.i === layer.i ? '#8ffb5030' : '#fe050537'}`,
                                background: curCell?.i === layer.i && 'rgba(147, 243, 68, 0.003)',
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
            }
        </div>
        </Container>
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