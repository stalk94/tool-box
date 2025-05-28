import React from "react";
import { Responsive, WidthProvider, Layouts, Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import { LayoutCustom, ComponentSerrialize } from '../type';
import { editorSlice, infoSlice, renderSlice, cellsSlice } from "./context";
import { componentMap } from '../modules/helpers/registry';
import { arrayMove, SortableContext, verticalListSortingStrategy, rectSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './Sortable';
import { canPlace, findFreeSpot } from '../helpers/editor';
import { DroppableCell } from './Dragable';

const ResponsiveGridLayout = WidthProvider(Responsive);
const margin: [number, number] = [5, 5];

type NestedData = {
    content: Record<string, ComponentSerrialize[]>
    layout?: LayoutCustom[]
    size: {
        width: number
        height: number
    }
}
type NestGridEditor = { 
    desserealize: (component: ComponentSerrialize)=> void
    nestedData: NestedData
}


export default function ({ desserealize, nestedData }: NestGridEditor) {
    const [ready, setReady] = React.useState(false);
    const gridContainerRef = React.useRef(null);                            // ref на главный контейнер редактора сетки       
    const curCell = editorSlice.currentCell.use();
    const render = renderSlice.use();
    const size = editorSlice.size.use();
    const mod = editorSlice.mod.use();
    

    const removeComponentFromCell = (cellId: string, componentIndex: number) => {
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

        editorSlice.layout.set((layer) => {
            return layer.map((lay) => {
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
    const handleChangeLayout = (layoutList: LayoutCustom[]) => {
        console.red('change layots: ', layoutList);

        editorSlice.layout.set((prev) => {
            const result = prev.map((cell) => {
                const copy = {...cell};
                const updatedLayout = layoutList.find((l) => l.i === cell.i);

                if (updatedLayout) Object.keys(updatedLayout).map((key) => {
                    copy[key] = updatedLayout[key];
                });

                return copy;
            });

            return result;
        });
        
        renderSlice.set(editorSlice.layout.get(true));
    }
    const handleClickCell = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, layer: LayoutCustom) => {
        // (event) переключение на панель компонентов
        EVENT.emit('leftBarChange', {
            currentToolPanel: 'component'
        });


        if (curCell?.i !== layer.i) {
            editorSlice.currentCell.set({ i: layer.i });
            infoSlice.select.cell.set(e.currentTarget);
            EVENT.emit('onSelectCell', layer.i);
        }
    }
    const delCellData = (idCell: string) => {
        renderSlice.set((prev) => prev.filter((cell) => cell.i !== idCell));
        editorSlice.layout.set((prev) => prev.filter((cell) => cell.i !== idCell));

        // Удаляем содержимое из кэша
        cellsSlice.set((old) => {
            delete old[idCell];
            return old;
        });
    }
    const addCellData = (cells: any[], clean?: 'all'|string) => {
        if(clean === 'all') render.map((cell)=> delCellData(cell.i));
        else if(clean && clean !== 'all') delCellData(clean);

        cells.map((cell, index)=> {
            cell.i = cell.i ?? `cell-${Date.now()+index}`;

            renderSlice.set((prev) => {
                prev.push(cell);
                return prev;
            });
            editorSlice.layout.set((prev) => {
                prev.push(cell);
                return prev;
            });
            cellsSlice.set((old) => {
                old[cell.i] = [];
                return old;
            });
        });
    }
    const addNewCell = () => {
        const defaultW = 12;
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
        const resizeObserver = new ResizeObserver(() => {
            const render = editorSlice.layout.get(true);
            if (!gridContainerRef.current) return;

            const parentHeight = gridContainerRef.current.clientHeight;
            const containerWidth = gridContainerRef.current.offsetWidth;

            if (containerWidth > 0) {
                infoSlice.container.height.set(parentHeight);
                infoSlice.container.width.set(containerWidth);
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
    }, []);
    React.useEffect(() => {
        if (nestedData.content) cellsSlice.set(nestedData.content);

        if (nestedData?.layout && nestedData?.layout[0]?.i) {
            console.green('init nested layouts:', nestedData.layout);
            editorSlice.layout.set(structuredClone(nestedData.layout));
            renderSlice.set(nestedData.layout);
        }

        if (nestedData.size) {
            editorSlice.size.width.set(Math.round(nestedData.size.width));
            editorSlice.size.height.set(Math.round(nestedData.size.height));
        }
    }, [nestedData]);
    React.useEffect(() => {
        document.addEventListener('keydown', handleDeleteKeyPress);
        EVENT.on('addCell', addNewCell);

        return () => {
            document.removeEventListener('keydown', handleDeleteKeyPress);
            EVENT.off('addCell', addNewCell);
        }
    }, []);
    
    
    return (
        <div 
            style={{ 
                margin: 5,
                maxWidth: size?.width ?? '100%', 
                height: size?.height ?? '100%',
                border: '1px dashed #fbfbfa26'
            }}
            ref={gridContainerRef}
        >
            {ready && 
            <ResponsiveGridLayout
                style={{ background: '#222222' }}
                className="GRID-EDITOR"
                layouts={{ lg: editorSlice.layout.get(true) }}                // Схема сетки
                breakpoints={{ lg: 1200 }}                                  // Ширина экрана для переключения
                cols={{ lg: 12 }}                                           // Количество колонок для каждого размера
                rowHeight={20}
                compactType={null}                                          // Отключение автоматической компоновки
                preventCollision={true}
                isDraggable={mod === 'grid' && true}                // Отключить перетаскивание
                isResizable={mod === 'grid' && true}                // Отключить изменение размера
                margin={margin}
                onLayoutChange={handleChangeLayout}
            >
                { render?.map((layer) => {
                    if(layer?.i) return(
                        <div 
                            onClick={(e) => handleClickCell(e, layer)}
                            data-id={layer.i} 
                            key={layer.i}
                            style={{
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
                                {(EDITOR && layer?.content) &&
                                    <SortableContext
                                        items={layer.content?.map((cnt) => cnt.props['data-id'])}
                                        strategy={rectSortingStrategy}
                                    >
                                        {layer?.content && Array.isArray(layer.content) &&
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
                        </div>
                    );
                })}
            </ResponsiveGridLayout>
            }
        </div>
    );
}