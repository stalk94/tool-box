import React from "react";
import { useSnackbar } from 'notistack';
import { LayoutCustom, BlockData } from './type';
import { Responsive, WidthProvider } from "react-grid-layout";
import { editorContext, infoSlice, cellsSlice, settingsSlice } from "./context";
import useContextMenu from '@components/context-main';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './Sortable';
import { Delete, Edit, Save, Star } from '@mui/icons-material';
import { findFreeSpot, stackHorizont, stackVertical, getNearestLayout } from './helpers/editor';
import { DroppableCell, DroppableGrid } from './Dragable';
import Container from '@mui/material/Container';
import { specialComponents } from './config/category';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { taskadeTheme, lightTheme, darkTheme } from 'src/theme';
import { RulerX, RulerY } from './utils/Rullers';
import { extractMuiStylesForContainer } from './helpers/dom';
import { MetaHeader, MetaFooter } from './utils/Meta';
import { db } from "./helpers/export";

const themes = { taskade: taskadeTheme, light: lightTheme, dark: darkTheme };
const ResponsiveGridLayout = WidthProvider(Responsive);
const margin: [number, number] = [5, 5];


export default function ({ desserealize }) {
    const { enqueueSnackbar } = useSnackbar();
    const ctxTheme = settingsSlice.theme.use();
    const [ready, setReady] = React.useState(false);
    const gridContainerRef = React.useRef(null); 
    const size = editorContext.size.use();
    const mod = editorContext.mod.use();
    const meta = editorContext.meta.use();
    const project = infoSlice.project.use();                                              
    const curCell = editorContext.currentCell.use();                       
    const settings = editorContext.settings.use();
    const layouts = editorContext.layouts.use();
    const cells = cellsSlice.use();
    const currentBreakpoint = editorContext.size.breackpoint.use();


    const handleDeleteKeyPress = (event: KeyboardEvent) => {
        const curCell = editorContext.currentCell.get(); 

        if (!curCell?.i) {
            enqueueSnackbar('Не выделена ячейка!', {variant: 'warning'});
            return;
        }
        if (event.key !== 'Delete') return;

        const selected = infoSlice.select.content?.get();
        if (!selected) {
            enqueueSnackbar('Не выделен компонент!', {variant: 'warning'});
            return;
        }
        if (specialComponents.includes(selected.props['data-type'])) return;
        
        cellsSlice.set((next) => {
            next[curCell.i] = next[curCell.i].filter((content) =>
                content.props['data-id'] !== selected.props?.['data-id']
            );

            return next;
        });
        infoSlice.select.content.set(null);
    }
    const handleChangeLayout = (layout: LayoutCustom[]) => {
        const breackpoint = editorContext.size.breackpoint.get();
        console.red('layout change: ', layout);

        editorContext.layouts[breackpoint].set(layout);
    }
    const handleClickCell = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, layer: LayoutCustom) => {
        // (event) переключение на панель компонентов
        console.log('click')
        EVENT.emit('leftBarChange', {
            currentToolPanel: 'component'
        });


        if (curCell?.i !== layer.i) {
            editorContext.currentCell.set(layer);
            infoSlice.select.cell.set(e.currentTarget);
            EVENT.emit('onSelectCell', layer.i);
        }
    }
    const handleDblClickCell = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, layer: LayoutCustom) => {
        console.log('dbl click')
    }
    const saveFavorite = (idCell: string) => {
        const layotsExport = {};
        const cellComponents = cellsSlice[idCell].get(true);
        const layots = editorContext.layouts.get();
        const refCell = document.querySelector(`[data-id=${idCell}]`);
        
        const cleanDom = () => {
            const wrapper = document.createElement('div');
            const styles = extractMuiStylesForContainer(refCell);
            wrapper.innerHTML = refCell.innerHTML;

            // Селекторы мусора
            const selectors = [
                '.react-resizable-handle',
                '.resize-box',
                '.editor-only',
                'script',
                'style[data-editor]',
            ];

            selectors.forEach((selector) => {
                wrapper.querySelectorAll(selector).forEach((el) => el.remove());
            });

            return `<style>${styles}</style>\n${wrapper.outerHTML}`;
        }

        Object.keys(layots).forEach((br)=> {
            const find = layots[br].find((lay)=> lay.i === idCell);
            layotsExport[br] = find;
        });
      
        const data: BlockData = {
            meta: {
                category: 'favorite',
                name: String(Date.now()),
                preview: cleanDom()
            },
            content: cellComponents,
            layouts: layotsExport,
        }
        
        db.get('BLOCK.favorite').then((all)=> {
            if(!all) all = [];
            all.push(data);
            db.set('BLOCK.favorite', all);
        });
    }
    const delCellData = (idCell: string, isAll?: boolean) => {
        if (!idCell.includes('system')) {
            if (!isAll) {
                const breackpoint = editorContext.size.breackpoint.get();
                editorContext.layouts[breackpoint]?.set((prev) => prev.filter((cell) => cell.i !== idCell));
            }
            else {
                ['lg', 'md', 'sm', 'xs'].forEach((breackpoint)=> {
                    editorContext.layouts[breackpoint]?.set((prev) => prev.filter((cell) => cell.i !== idCell));
                });
            }
        }
    }
    const addCellData = (cells: any[], clean?: 'all' | string) => {
        if (clean === 'all') render.map((cell) => delCellData(cell.i));
        else if (clean && clean !== 'all') delCellData(clean);

        cells.forEach((cell, index) => {
            cell.i = cell.i ?? `cell-${Date.now() + index}`;

            ['lg', 'md', 'sm', 'xs'].forEach((breackpoint)=> 
                editorContext.layouts[breackpoint]?.set((prev) => {
                    prev.push(cell);
                })
            );
            cellsSlice.set((next) => {
                next[cell.i] = [];
                return next;
            });

            editorContext.currentCell.set(cell);
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
    
    const currentLayout = React.useMemo(()=> layouts[currentBreakpoint], [currentBreakpoint, layouts]);
    const { menu, handleOpen } = useContextMenu([
        {
            label: <div style={{ color: 'silver', fontSize: 14 }}>Сохранить</div>,
            icon: <Save sx={{ color: 'silver', fontSize: 18 }} />,
            onClick: (id) => saveFavorite(id),
        },
        {
            label: <div style={{ color: 'red', fontSize: 14 }}>Удалить cell</div>,
            icon: <Delete sx={{ color: 'red', fontSize: 18 }} />,
            onClick: (id) => delCellData(id),
        },
        {
            label: <div style={{ color: 'red', fontSize: 14 }}>Удалить all cell</div>,
            icon: <Delete sx={{ color: 'red', fontSize: 18 }} />,
            onClick: (id) => delCellData(id, true),
        },
    ]);

    React.useEffect(() => {
        console.blue('grid render');
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

            const maxY = Math.max(...currentLayout.map((item) => item.y + item.h));
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
    
    
    return (
        <ThemeProvider theme={themes[ctxTheme.currentTheme??'dark']}>
            {/* линейки */}
            <div className="ruler-container" style={{marginTop: 4}}>
                <RulerX containerRef={gridContainerRef} />
                <RulerY containerRef={gridContainerRef} />
            </div>
            
            <Container sx={{
                    height: (size.height + 10),
                    overflowY: 'hidden',
                    marginTop: '65px',
                    boxSizing: 'content-box'
                }}
            >
                <DroppableGrid id={1}/>
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
                        <>
                        <MetaHeader width={size.width} scope={meta.scope}/>
                        <ResponsiveGridLayout
                            style={{ height: size.height - 10 }}
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
                                const content = cells[layer.i];
                                
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
                                            alignContent: 'flex-start',
                                            boxSizing: 'border-box'
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
                                                                    onSelectCell={()=> editorContext.currentCell.set(layer)}
                                                                >
                                                                    { component }
                                                                </SortableItem>
                                                            ))}
                                                        </>
                                                    }
                                                </SortableContext>
                                            }
                                        </DroppableCell>

                                        {/* ANCHOR - Вне редактора (!non correct) */}
                                        {(!EDITOR && Array.isArray(layer.content)) &&
                                            layer.content.map((component, index) =>
                                                <React.Fragment key={component.props['data-id']}>
                                                    { desserealize(component) }
                                                </React.Fragment>
                                            )
                                        }
                                    </div>
                                );
                            })}
                        </ResponsiveGridLayout>
                        <MetaFooter width={size.width} scope={meta.scope}/>
                        </>
                    }
                </div>
                { menu }
            </Container>
        </ThemeProvider>
    );
}