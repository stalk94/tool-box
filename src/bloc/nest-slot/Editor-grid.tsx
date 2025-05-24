import React from "react";
import { Responsive, WidthProvider, Layouts, Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import { LayoutCustom, ComponentSerrialize } from '../type';
import { editorSlice, infoSlice, renderSlice, cellsSlice } from "./context";
import { arrayMove, SortableContext, verticalListSortingStrategy, rectSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './Sortable';
import { canPlace, findFreeSpot } from '../helpers/editor';
import { DroppableCell } from './Dragable';

const ResponsiveGridLayout = WidthProvider(Responsive);
const margin: [number, number] = [5, 5];

type NestGridEditor = { 
    desserealize: (component: ComponentSerrialize)=> void
    nestedData: {
        content: Record<string, ComponentSerrialize[]>
        layout?: LayoutCustom[]
        size: {
            width: number 
            height: number 
        }
    }
}


export default function ({ desserealize, nestedData }: NestGridEditor) {
    const gridContainerRef = React.useRef(null);                            // ref на главный контейнер редактора сетки    
    const render = renderSlice.use();     
    const curCell = editorSlice.currentCell.use();
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
        });

        cellsSlice.set((old) => {
            old[cellId].splice(componentIndex, 1);
            return old;
        });

        editorSlice.layout.set((layer) => {
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
    // согласование серриализованных компонентов в ячейках с render layouts
    const consolidation = (layoutList: LayoutCustom[]) => {
        if(layoutList[0] === null) return [];

        return layoutList.map((layer) => {
            const copyLayer = { ...layer };
            if(!layer) return;

            const cache = cellsSlice.get();
            const curCacheLayout = cache[layer.i];
            const resultsLayer = [];
            
            if (curCacheLayout) {
                Object.values(curCacheLayout).map((content) => {
                    const result = desserealize(content);
                    if (result) resultsLayer.push(result);
                });

                copyLayer.content = resultsLayer;
            }
            
            return copyLayer;
        });
    }
    const handleChangeLayout = (layoutList: LayoutCustom[]) => {
        if(layoutList[0]) {
            editorSlice.layout?.set((prev) =>
                prev.map((cell) => {
                    const updatedLayout = layoutList.find((l) => l.i === cell.i);
                    
                    if(updatedLayout) Object.keys(updatedLayout).map((key)=> {
                        if(key !== 'content') cell[key] = updatedLayout[key];
                    });
                    cell.content = [];

                    return cell;
                })
            );
            
            renderSlice.set(consolidation(layoutList));
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
            });
            editorSlice.layout.set((prev) => {
                prev.push(cell);
            });
            cellsSlice.set((old) => {
                old[cell.i] = [];
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
        if (!render || !render.length) return;
        
        const resizeObserver = new ResizeObserver(() => {
            if (!gridContainerRef.current) return;

            const parentHeight = gridContainerRef.current.clientHeight;
            const containerWidth = gridContainerRef.current.offsetWidth;

            infoSlice.container.height.set(parentHeight);
            infoSlice.container.width.set(containerWidth);

            const maxY = Math.max(...render.map((item) => item.y + item.h));
            //console.log(maxY)
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
        console.red('GRID nestedData update');
        if (nestedData.content) cellsSlice.set(nestedData.content);

        if (nestedData?.layout && nestedData?.layout[0]?.i) {
            console.green('init nested layouts:', nestedData.layout);
            editorSlice.layout.set(structuredClone(nestedData.layout));
        }

        if (nestedData.size) {
            editorSlice.size.width.set(nestedData.size.width);
            editorSlice.size.height.set(nestedData.size.height);
        }
    }, [nestedData]);
    React.useEffect(() => {
        document.addEventListener('keydown', handleDeleteKeyPress);
        EVENT.on('addCell', addNewCell);

        const result = consolidation(nestedData?.layout ?? []);
        renderSlice.set(result);
        if(nestedData?.layout) editorSlice.layout.set(nestedData.layout);

        return () => {
            document.removeEventListener('keydown', handleDeleteKeyPress);
            EVENT.off('addCell', addNewCell);
        }
    }, []);
    
    
    
    return (
        <div 
            style={{ 
                margin: 5,
                maxWidth: size.width ?? '100%', 
                height: size.height ?? '100%',
                border: '1px dashed #fbfbfa26'
            }}
            ref={gridContainerRef}
        >
            <ResponsiveGridLayout
                style={{ background: '#222222' }}
                className="GRID-EDITOR"
                layouts={{ lg: render }}                // Схема сетки
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
                            onClick={(e) => {
                                // LINK (event) переключение на панель компонентов
                                if(curCell?.i !== layer.i) {
                                    EVENT.emit('leftBarChange', {currentToolPanel: 'component'});
                                }
                                
                                editorSlice.currentCell.set({ i: layer.i });
                                infoSlice.select.cell.set(e.currentTarget);
                                EVENT.emit('onSelectCell', layer.i);
                            }}
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
                                {EDITOR &&
                                    <SortableContext
                                        items={layer.content?.map((cnt) => cnt.props['data-id'])}
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
                        </div>
                    );
                })}
            </ResponsiveGridLayout>
        </div>
    );
}