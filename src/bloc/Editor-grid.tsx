import React from "react";
import { LayoutCustom, Breakpoint } from './type';
import GridLayout, { Responsive, WidthProvider, Layouts, Layout } from "react-grid-layout";
import { editorContext, infoSlice, renderSlice, cellsSlice } from "./context";
import useContextMenu from '@components/context-main';
import { arrayMove, SortableContext, verticalListSortingStrategy, rectSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './Sortable';
import { Delete, Edit, Star } from '@mui/icons-material';
import { findFreeSpot, stackHorizont, stackVertical, getNearestLayout } from './helpers/editor';
import { DroppableCell } from './Dragable';
import Container from '@mui/material/Container';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { taskadeTheme, lightTheme, darkTheme } from 'src/theme';
import { RulerX, RulerY } from './utils/Rullers';

const ResponsiveGridLayout = WidthProvider(Responsive);
const margin: [number, number] = [5, 5];



export default function ({ desserealize }) {
    const [ready, setReady] = React.useState(false);
    const size = editorContext.size.use();
    const mod = editorContext.mod.use();
    const meta = editorContext.meta.use();
    const project = infoSlice.project.use();
    const gridContainerRef = React.useRef(null);                            // ref на главный контейнер редактора сетки                        
    const render = renderSlice.use();
    const curCell = editorContext.currentCell.use();                        // текушая выбранная ячейка
    const settings = editorContext.settings.use();
    const layouts = editorContext.layouts.use();
    const currentBreakpoint = editorContext.size.breackpoint.use();


    const removeComponentFromCell = (cellId: string, componentIndex: number) => {
        const breackpoint = editorContext.size.breackpoint.get();

        renderSlice.set((prevRender) => {
            const cellIndex = prevRender.findIndex(item => item.i === cellId);

            if (cellIndex !== -1) {
                if (Array.isArray(prevRender[cellIndex]?.content)) {
                    // Удаляем компонент из ячейки
                    prevRender[cellIndex]?.content?.splice(componentIndex, 1);
                }
            }

            return prevRender;
        });

        cellsSlice.set((old) => {
            old[cellId].splice(componentIndex, 1);
            return old;
        });

        editorContext.layouts[breackpoint]?.set((layer) => {
            layer = layer.map((lay) => {
                lay.content?.splice?.(componentIndex, 1);
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
    const handleChangeLayout = (layout: LayoutCustom[]) => {
        const breackpoint = editorContext.size.breackpoint.get();
        console.red('layout change: ', layout);

        editorContext.layouts[breackpoint].set(layout);
    }
    const handleClickCell = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, layer: LayoutCustom) => {
        // (event) переключение на панель компонентов
        EVENT.emit('leftBarChange', {
            currentToolPanel: 'component'
        });


        if (curCell?.i !== layer.i) {
            editorContext.currentCell.set({ i: layer.i });
            infoSlice.select.cell.set(e.currentTarget);
            EVENT.emit('onSelectCell', layer.i);
        }
    }
    const delCellData = (idCell: string) => {
        const breackpoint = editorContext.size.breackpoint.get();
        renderSlice.set((prev) => prev.filter((cell) => cell.i !== idCell));
        editorContext.layouts[breackpoint]?.set((prev) => prev.filter((cell) => cell.i !== idCell));

        // Удаляем содержимое из кэша
        //cellsSlice.set((old) => {
        //    delete old[idCell];
        //    return old;
        //});
    }
    const addCellData = (cells: any[], clean?: 'all' | string) => {
        if (clean === 'all') render.map((cell) => delCellData(cell.i));
        else if (clean && clean !== 'all') delCellData(clean);

        cells.map((cell, index) => {
            cell.i = cell.i ?? `cell-${Date.now() + index}`;

            ['lg', 'md', 'sm', 'xs'].forEach((breackpoint)=> 
                editorContext.layouts[breackpoint]?.set((prev) => {
                    prev.push(cell);
                })
            );
            renderSlice.set((prev) => {
                prev.push(cell);
                return prev;
            });
            cellsSlice.set((old) => {
                old[cell.i] = [];
                return old;
            });

            editorContext.currentCell.set({ i: cell.i });
        });
    }
    const addNewCell = () => {
        const breackpoint = editorContext.size.breackpoint.get();
        const defaultW = 3;
        const defaultH = 2;
        
        const render = editorContext.layouts[breackpoint].get();
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
        console.gray('grid render');
        if (typeof window === 'undefined') return;
        document.addEventListener('keydown', handleDeleteKeyPress);
        EVENT.on('addCell', addNewCell);

        return () => {
            document.removeEventListener('keydown', handleDeleteKeyPress);
            EVENT.off('addCell', addNewCell);
        }
    }, []);
    React.useEffect(() => {
        if (typeof window === 'undefined') return;
        
        const resizeObserver = new ResizeObserver(() => {
            if (!gridContainerRef.current) return;

            const parentHeight = gridContainerRef.current.clientHeight;
            const containerWidth = gridContainerRef.current.offsetWidth;

            if (containerWidth > 0) {
                infoSlice.container.height.set(parentHeight);
                infoSlice.container.width.set(containerWidth);
                console.log('ready')
                setReady(true);
            }

            const maxY = Math.max(...render.map((item) => item.y + item.h));
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
    }, [meta, project, size]);


    const currentLayout = React.useMemo(()=> 
        getNearestLayout(currentBreakpoint, layouts), 
        [currentBreakpoint, layouts]
    );
    const { menu, handleOpen } = useContextMenu([
        {
            label: <div style={{ color: 'red', fontSize: 14 }}>Удалить cell</div>,
            icon: <Delete sx={{ color: 'red', fontSize: 18 }} />,
            onClick: (id) => delCellData(id),
        },
    ]);
    

    return (
        <ThemeProvider theme={taskadeTheme}>
            {/* линейки */}
            <div className="ruler-container">
                <RulerX containerRef={gridContainerRef} />
                <RulerY containerRef={gridContainerRef} />
            </div>

            <Container sx={{
                    height: (size.height + 10) ?? '99%',
                    overflowY: 'hidden',
                    marginTop: '65px',
                }}
            >
                <div ref={gridContainerRef}
                    style={{
                        margin: 1,
                        maxWidth: size.width ?? '100%',
                        height: '99%',
                        border: '1px dashed #fbfbfa26',
                        overflowY: 'auto',
                    }}
                >
                    {ready &&
                        <ResponsiveGridLayout
                            style={{ height: (size.height - 10) ?? '99%' }}
                            className="GRID-EDITOR"
                            layouts={{ [currentBreakpoint]: currentLayout }}
                            breakpoints={{ lg: 1100, md: 950, sm: 590, xs: 480 }}
                            cols={{ lg: 12, md: 10, sm: 8, xs: 6 }}
                            rowHeight={settings.rowHeight}
                            compactType={settings.gridCompact ? undefined : null}       // Отключение автоматической компоновки
                            preventCollision={settings.gridCompact ? false : true}
                            isDraggable={mod === 'grid' && true}                // перетаскивание
                            isResizable={mod === 'grid' && true}                // изменение размера
                            margin={margin}
                            onDragStop={handleChangeLayout}
                            onResizeStop={handleChangeLayout}
                            onBreakpointChange={(br)=> editorContext.size.breackpoint.set(br)}
                            resizeHandles={['se', 'ne', 'sw', 'nw']}
                        >
                            { currentLayout.map((layer) => {
                                const content = cellsSlice[layer.i].get();
                                
                                return (
                                    <div
                                        onClick={(e) => handleClickCell(e, layer)}
                                        onContextMenu={(e) => {
                                            handleClickCell(e, layer);
                                            handleOpen(e, { id: layer.i });
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
                                                    items={content ? content.map((cnt) => cnt.props['data-id']) : []}
                                                    strategy={rectSortingStrategy}
                                                >
                                                    {Array.isArray(content) &&
                                                        <>
                                                            {Array.isArray(content) && content.map((component) => (
                                                                <SortableItem
                                                                    key={component.props['data-id']}
                                                                    id={component.props['data-id']}
                                                                    cellId={layer.i}
                                                                >
                                                                    { component }
                                                                </SortableItem>
                                                            ))}
                                                        </>
                                                    }
                                                </SortableContext>
                                            }
                                        </DroppableCell>

                                        {/* ANCHOR - Вне редактора */}
                                        {(!EDITOR && Array.isArray(layer.content)) &&
                                            layer.content.map((component, index) =>
                                                <React.Fragment key={component.props['data-id']}>
                                                    {desserealize(component)}
                                                </React.Fragment>
                                            )
                                        }
                                    </div>
                                );
                            })}
                        </ResponsiveGridLayout>
                    }
                </div>
                { menu }
            </Container>
        </ThemeProvider>
    );
}




/** 
 * const consolidation = (layoutList: LayoutCustom[]) => {
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
    } */
/**
 *  React.useEffect(() => {
        const currentScope = project?.[meta?.scope];
        const found: BlocData = currentScope?.find((obj) => obj.name === meta?.name);
       
        if (!found?.data) return;

        // ✅ устанавливаем layout и content
        if (found.data.content) cellsSlice.set(found.data.content);
        if (found.data.layout) editorContext.layout.set(found.data.layout);
        if (found.data.size) {
            editorContext.size.width.set(found.data.size.width);
            editorContext.size.height.set(found.data.size.height);
        }

        const freshLayout = found.data.layout ?? [];
        const result = consolidation(freshLayout);
        renderSlice.set(result);
    }, [meta.name, project]);
 */
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