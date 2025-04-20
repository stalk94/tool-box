import React from "react";
import html2canvas from 'html2canvas';
import { LayoutCustom, ComponentSerrialize, Component } from './type';
import "react-grid-layout/css/styles.css";
import context, { cellsContent, infoState, renderState } from './context';
import { hookstate, useHookstate } from "@hookstate/core";
import { ToolBarInfo } from './Top-bar';
import { componentMap } from './modules/utils/registry';
import Tools from './Left-bar';
import GridComponentEditor from './Editor-grid';
import { writeFile } from "../app/plugins";
import GridEditor from '../components/tools/grid-editor';
import { serializeJSX, deserializeJSX } from './utils/sanitize';
import EventEmitter from "../app/emiter";

//import "../style/grid.css";
import "../style/edit.css";
import './modules/index';
// системный эммитер
globalThis.EVENT = new EventEmitter();


// это редактор блоков сетки
export default function ({ height, setHeight }) {
    const mod = useHookstate(context.mod);
    const refs = React.useRef({});                                   // список всех рефов на все компоненты
    const render = useHookstate(renderState);
    const info = useHookstate(infoState);                             // данные по выделенным обьектам
    const curCell = useHookstate(context.currentCell);                // текушая выбранная ячейка
    const cellsCache = useHookstate(cellsContent);                    // элементы в ячейках (dump из localStorage)
    
   
    const dumpRender = (name: string) => {
        const gridContainer: HTMLDivElement = document.querySelector('.GRID-EDITOR');
        const children = Array.from(gridContainer.children);
        const cache = cellsCache.get({ noproxy: true });
         
        const meta = {
            name: name ?? Date.now(),
            data: new Date().toJSON(),
            screen: undefined,
            container: {
                width: info.container.width.get(),
                height: info.container.height.get()
            },
            layers: []
        }
        exportAsHTML('test')
        
        Object.keys(cache).map((idLayout)=> {
            const found = children.find(el => el.getAttribute('data-id') === idLayout);
            
            if(found) {
                const cacheLayout = cache[idLayout];
                const bound = found.getBoundingClientRect();
                const findLayout = context.layout.get().find((l)=> l.i === idLayout);
                const findRenderLayot = render.get({ noproxy: true }).find(l => l.i === idLayout);
                
                meta.layers.push({
                    ...findRenderLayot,
                    name: findLayout?.content,
                    size: {
                        width: bound.width,
                        height: bound.height,
                    },
                    content: cacheLayout
                });
            }
        });

        html2canvas(gridContainer, { scrollY: -window.scrollY })
            .then((canvas)=> {
                return canvas.toDataURL();
            })
            .then((v) => {
                const filename = `screenshot_${meta.name}.png`;
                meta.screen = '/db/editor/screen/' + filename;
                const content = v;

                writeFile(
                    '/db/editor/screen',
                    filename,
                    content,
                    { image: true }
                ).then(() => {
                    writeFile(
                        '/db/editor',
                        `${meta.name + '.json'}`,
                        JSON.stringify(meta, null, 2)
                    ).then(console.log)
                });
            });
    }
    const desserealize = (component: ComponentSerrialize) => {
        const { id, props, functions, parent } = component;
        const type = props["data-type"];

        const Component = componentMap[type];
        Component.displayName = type;
        Component.parent = parent;
        Component.functions = functions;
        
    
        if (!Component) {
            console.warn(`Компонент типа "${type}" не найден в реестре`);
            return null;
        }
    
        return (
            <Component
                { ...props }
                ref={(el) => {
                    if (el) refs.current[id] = el;
                }}
            />
        );
    }
    // вызывается только при добавлении нового сонтента 
    const serrialize = (component: Component, cellId: string): ComponentSerrialize => {
        const rawProps = { ...component.props };
        const type = rawProps['data-type'];
        const id = Date.now();

        delete rawProps.ref;
        const cleanedProps = serializeJSX(rawProps);
        console.log(cleanedProps)

        return {
            id,
            parent: cellId,
            props: {
                ...cleanedProps,
                'data-id': id,
                'data-type': type,
            }
        };
    }
    const addComponentToCell = (cellId: string, component: Component) => {
        render.set((prev) => {
            const updatedRender = [...prev];
            const cellIndex = updatedRender.findIndex(item => item.i === cellId);

            if (cellIndex !== -1) {
                const cell = updatedRender[cellIndex];
                if(!Array.isArray(cell.content)) cell.content = [];
                const serialized = serrialize(component, cellId);

                const clone = React.cloneElement(component, 
                    { 
                        'data-id': serialized.id,
                        ref: (el)=> {
                            if(el) refs.current[serialized.id] = el;
                        }
                    }
                );
                cell.content.push(clone);

                cellsCache.set((old)=> {
                    if(!old[cellId]) old[cellId] = [serialized];
                    else old[cellId].push(serialized);
        
                    return old;
                });
            }
            return updatedRender;
        });
    }
    const addComponentToLayout = (elem) => {
        const selected = info.select.content.get({ noproxy: true });
        const cell = curCell.get();
        const type = elem.props['data-type'];
        const id = Date.now() + Math.floor(Math.random() * 10000);

        const newComponent = React.cloneElement(elem, {
            'data-id': id,
            'data-type': type,
            ref: (el) => el && (refs.current[id] = el),
        });

        const serialized = serializeJSX(newComponent);

        if (selected?.props?.['data-type'] === 'Block') {
            const blockId = selected.props['data-id'];

            render.set((prev) => {
                const updated = [...prev];
                const layer = updated.find((l) => l.i === cell?.i);
                if (!layer) return prev;

                const blockIndex = layer.content.findIndex(
                    (comp) => comp?.props?.['data-id'] === blockId
                );
                if (blockIndex === -1) return prev;

                const block = layer.content[blockIndex];

                // ❗️Вставляем только ОДИН раз в render
                const updatedBlock = React.cloneElement(block, {
                    ...block.props,
                    content: [...(block.props.content ?? []), newComponent],
                });

                layer.content[blockIndex] = updatedBlock;

                return updated;
            });

            // 🧊 Добавляем только сериализованный JSX в dump
            cellsCache.set((old) => {
                const layer = old[cell.i];
                if (!layer) return old;

                const block = layer.find((c) => c.props['data-id'] === blockId);
                if (!block) return old;

                if (!Array.isArray(block.props.content)) block.props.content = [];

                // ❗️Проверка на дубли
                if (!block.props.content.find((c) => c.props?.['data-id'] === id)) {
                    block.props.content.push(serialized);
                }

                return old;
            });

            return;
        }

        // ⬇️ По умолчанию — вставка в ячейку
        if (cell?.i) {
            addComponentToCell(cell.i, newComponent);
        }
    
    }

    
    return(
        <div style={{width: '100%', height: '100%', display: 'flex', flexDirection: 'row'}}>
            <Tools
                useDump={()=> dumpRender('page')}
                externalPanelTrigger={(cb) => {
                    // 💡 новый трюк
                    window.triggerLeftPanel = cb;
                }}
                addComponentToLayout={addComponentToLayout}
            />
            <div style={{width: '80%', height: '100%', display: 'flex', flexDirection: 'column'}}>

                <ToolBarInfo />

                { mod.get() === 'home' &&
                    <GridComponentEditor
                        desserealize={desserealize}
                        height={height}
                    />
                }
                { mod.get() === 'grid' &&
                    <GridEditor components={[]} />
                }
            </div>
        </div>
    );
}


/**
 *   addComponentToLayout={(elem)=> {
                    if(curCell.get()?.i) addComponentToCell(curCell.get().i, elem);
                }}
 */
import { hookstate, extend } from "@hookstate/core";
import { ComponentSerrialize, LayoutCustom } from './type';
import { localstored } from '@hookstate/localstored';


// копия на рендер App state
export const renderState = hookstate<LayoutCustom[]>([]);


export default hookstate(
    {
        mod: 'home',
        dragEnabled: true,                                          // отключить перетаскивание
        linkMode: <number|undefined> undefined,                     // режим связи
        layout: <LayoutCustom[]> <unknown>[],
        //tools: undefined,                                         // ?
        currentCell: <LayoutCustom> undefined,
    }, 
    localstored({ key: 'CONTEXT', engine: localStorage })
);


// сохраняемое состояние в localStorage редактора сетки (! это не дамп финальный)
export const cellsContent = hookstate<Record<string, ComponentSerrialize[]>>(
    {

    }, 
    localstored({key: 'cellsContent', engine: localStorage}
));


export const infoState = hookstate(new Proxy({
        container: {
            width: 0,
            height: 0
        },
        select: {
            /** это выбранный HTML layoout   */
            cell: <HTMLDivElement> undefined,
            /** это выбранный (react рендер) элемент  */
            content: <React.ReactElement> undefined,
            /** выделено в панели */
            panel: <{lastAddedType: string}> {
                lastAddedType: ''
            },
        },
        inspector: {
            lastData: {},
            task: []
        },
        contentAllRefs: <Record<string, Element>> undefined
    }, {
        set(target, property, value) {
            if(property === 'selectCell' && value) {
                // пример перехватчика
            }
            target[property] = value;
            return true;
        }
    }
))

import React from "react";
import { LayoutCustom, Component } from './type';
import { Responsive, WidthProvider, Layouts, Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import context, { cellsContent, infoState, renderState } from './context';
import { hookstate, useHookstate } from "@hookstate/core";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, rectSortingStrategy } from '@dnd-kit/sortable';
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
            setSelectComponent(currentComponent);             // для DragOverlay
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


import React from "react";
import Draggable, { DraggableData } from 'react-draggable';
import context, { cellsContent, infoState } from './context';
import { hookstate, useHookstate } from "@hookstate/core";
import { Component, DraggbleElementProps } from './type';
import { throttle } from "lodash";


// !? убираем пока второй draggable
// ! перед правками сперва копию в dump
const DragableElement = React.memo(({ component, index, cellId, useStop, useDelete }: DraggbleElementProps) => {
    const refWrapperX = React.useRef<Draggable>(null);
    const refWrapperY = React.useRef<HTMLDivElement>(null);
    const info = useHookstate(infoState);           // данные по выделенным обьектам (!)
    const cellsCache = useHookstate(cellsContent);  // все компоненты по списку своих контейнеров
    const offset = component.props['data-offset'];

    
    const onStop = (data: DraggableData, component: Component, axis: 'x' | 'y') => {
        const cell = cellsCache.get({ noproxy: true })[cellId];
        const currentId = component.props['data-id'];
    
        const find = cell.find(el => el.id === currentId);
        if (!find) return;
    
        const targetPos = {
            x: axis === 'x' ? data.x : find.props['data-offset']?.x,
            y: axis === 'y' ? data.y : find.props['data-offset']?.y,
        };
    
        useStop(component, targetPos);
    }
    const handlerStop = React.useMemo(() =>
        throttle((data: DraggableData, component: Component, axis: 'x' | 'y') => {
            onStop(data, component, axis);
        }, 200),
        [component, cellId, index]
    );
    const useSetClassRef = (id: number | string, className: string) => {
        const el = document.querySelector(`[data-editor-id="${id}"]`);
        if (el) el.classList.add(`editor-${className}`);
    }
    const useRemoveClassRef = (id: number | string | 'all') => {
        const removeClasses = (ref: Element) => {
            ref.classList.forEach((className: string) => {
                if (className.startsWith('editor-')) {
                    ref.classList.remove(className);
                }
            });
        };
    
        if (id === 'all') {
            Object.keys(cellsCache.get()).forEach((idCell) => {
                cellsCache.get()[idCell].forEach((content) => {
                    const ref = document.querySelector(`[data-editor-id="${content.id}"]`);
                    if (ref) removeClasses(ref);
                });
            });
        } else {
            const ref = document.querySelector(`[data-editor-id="${id}"]`);
            if (ref) removeClasses(ref);
        }
    }
    const handleHoverIn = () => {
        const el = document.querySelector(`[data-editor-id="${component.props['data-id']}"]`);
        if (el) el.classList.add('editor-hover');
    }
    const handleHoverOut = () => {
        const el = document.querySelector(`[data-editor-id="${component.props['data-id']}"]`);
        if (el) el.classList.remove('editor-hover');
    }
    const handleDoubleClick = () => {
        info.select.content.set(component);
        window.triggerLeftPanel('component');        
    }
    
    

    return(
        <Draggable 
            axis="y"
            grid={[10, 10]}
            defaultPosition={{x: 0, y: offset?.y ?? 0}}
            key={index}
            bounds="parent"
            onStart={(e, data) => {
                component._store.index = index;
                info.select.content.set(component);
                useRemoveClassRef('all');
                useSetClassRef(component.props['data-id'], 'selected');
            }}
            onStop={(e, data) => handlerStop(data, component, 'y')}
        >
            <div 
                id={String(index)}
                className="Wrapper-y" 
                ref={refWrapperY} 
                style={{border: '1px dotted #bababa33'}}
            >
                <Draggable 
                    ref={refWrapperX}
                    axis="x"
                    grid={[50, 10]}
                    defaultPosition={{x: offset?.x ?? 0, y: 0}}
                    key={index}
                    bounds="parent"
                    cancel=".hover-delete"          // блокировка срабатывания на бейдже удаления
                    onStart={(e, data) => {
                        component._store.index = index;
                        info.select.content.set(component);
                        useRemoveClassRef('all');
                        useSetClassRef(component.props['data-id'], 'selected');
                    }}
                    onStop={(e, data) => handlerStop(data, component, 'x')}
                >
                <div 
                    id={String(index)}
                    className="Wrapper-x" 
                    data-editor-id={component.props['data-id']}
                    style={{width: 'fit-content'}}
                    onMouseEnter={handleHoverIn}
                    onMouseLeave={handleHoverOut}
                    onDoubleClick={handleDoubleClick}
                >
                    <div className="hover-tools">
                        <button
                            className="hover-delete"
                            onClick={(e) => {
                                console.log('click')
                                e.stopPropagation();
                                e.preventDefault(); 
                                useDelete(cellId, index)
                            }}
                        >
                            ❌
                        </button>
                    </div>
                    
                    { component }
                </div>
                </Draggable>
            </div>

        </Draggable>
    );
});



DragableElement.displayName = 'DraggableElement';
export default DragableElement;



/**
 * const handlerStop =throttle((data, component, axis: 'x' | 'y')=> {
        const cell = cellsCache.get({noproxy: true})[cellId];
        const find = cell.find(el => el.id === component.props['data-id']);

        if(axis === 'x') {
            const xy = {
                x: data.x,
                y: find.props['data-offset'].y
            }
            useStop(component, xy);
        }
        else {
            const xy = {
                x: find.props['data-offset'].x,
                y: data.y
            }
            useStop(component, xy);
        }
    }, 200);
 */
import React from "react";
export { TextInput, NumberInput, SliderInput } from '../components/input';
import { Form, Schema, AccordionForm, AccordionScnema } from '../index';
import { useTheme, Theme } from "@mui/material";
import { fabrickUnical, fabrickStyleScheme, stylesFabricScheme } from './config/utill';
import { motion } from 'framer-motion';
import { sanitizeProps } from './utils/sanitize';
import { debounce } from 'lodash';
import { PropsForm, ProxyComponentName } from './type';
import { merge } from 'lodash';


// составляет индивидуальную схему пропсов
const useCreateSchemeProp = (typeContent:ProxyComponentName, propName:string, propValue:any, theme) => {
    const textKeys = ['children', 'src', 'alt', 'sizes', 'placeholder', 'label'];
    const numberKeys = ['min', 'max', 'step'];
    const switchKeys = ['fullWidth', ];
  

    if(switchKeys.includes(propName)) {
        return {
            type: 'switch',
            id: propName,
            label: propName,
            labelSx: { fontSize: '14px' },
            value: propValue
        }
    }
    else if(numberKeys.includes(propName)) {
        return {
            type: 'number',
            id: propName,
            value: propValue,
            label: propName,
            labelSx: { fontSize: '14px' },
            sx: { fontSize: 14 }
        }
    }
    else if(textKeys.includes(propName)) {
        return {
            type: 'text',
            id: propName,
            multiline: true,
            value: propValue,
            label: propName,
            labelSx: { fontSize: '14px' },
            sx: { fontSize: 14 }
        }
    }
    else return fabrickUnical(propName, propValue, theme, typeContent);
}
const useFabrickSchemeProps = (typeComponent: ProxyComponentName, props: Record<string, any>, theme: Theme) => {
    const result = { schema: [], acSchema: [] };

    Object.keys(props).forEach((propsName) => {
        const value = props[propsName];

        // проп массив либо обьект
        if (typeof value === 'object') {
            //console.log(propsName, value);
        }
        // проп является элементарным типом
        else {
            const schema = useCreateSchemeProp(
                typeComponent,
                propsName,
                value,
                theme
            );

            if (schema) result.schema.push(schema);
        }
    });

    return result;
}


// ! есть баг если удалить компонент при открытом редакторе (вроде)
export default function({ type, elemLink, onChange }: PropsForm) {
    const theme = useTheme();
    const copyDataContent = React.useRef({});                               // кэш во избежание перерендеров
    const [schema, setSchema] = React.useState<Schema[]>([]);
    const [acSchema, setAcSchema] = React.useState<AccordionScnema[]>([]);
    const [story, setStory] = React.useState<Record<string, string>[]>([]);
    const [future, setFuture] = React.useState<Record<string, string>[]>([]);
    const [current, setCurrent] = React.useState<Record<string, any>>(null);


    const undo = () => {
        if (story.length <= 1) return; // Nothing to undo
        
        // Take the current state and add it to future for potential redo
        setFuture(prev => [structuredClone(current), ...prev]);
        
        // Get the previous state from story
        const newStory = story.slice(0, -1);
        const previousState = structuredClone(newStory[newStory.length - 1]);
        
        // Update current state and apply it to the theme
        
        
        // Update story array
        setStory(newStory);
    }
    const redo = () => {
        if (future.length === 0) return; // Nothing to redo
        
        // Get the next state from future
        const nextState = structuredClone(future[0]);
        const newFuture = future.slice(1);
        
        // Add current state to history before applying the next state
        setStory(prev => [...prev, structuredClone(current)]);
        
        // Update current state and apply it to the theme
        
        
        // Update future array
        setFuture(newFuture);
    }
    const useAddStory = (current) => {
        if (current && (story.length === 0 || JSON.stringify(current) !== JSON.stringify(story[story.length - 1]))) {
            setFuture(prev => [sanitizeProps(current), ...prev]);
            setStory(prev => [...prev, sanitizeProps(current)]);
        }
    }
    const useMergeObject = (key: 'style'|'sx'|string, newValue: any) => {
        setCurrent((prev) => {
            const prevValue = prev[key] ?? {};
            const next = {
                ...prev,
                [key]: merge({}, prevValue, newValue)  // lodash.merge для глубокой сборки
            };
            useAddStory(next);
            onChange(next);
            return next;
        });
    }
    const useEdit = React.useCallback(
        debounce((key: string, newValue: string, keyProps?: string) => {
            const type = copyDataContent?.current?.type;        // тип вкладки редактора

            if (type === 'props') {
                if(keyProps) {
                    const targetSection = acSchema.find(section => section.id === keyProps);
                    const find = targetSection?.scheme?.find((s) => s.id === key);
                    const unit = find?.unit ?? '';
                    useMergeObject(keyProps, { [key]: newValue + unit  });
                }
                else setCurrent((prev) => {
                    const next = { ...prev, [key]: newValue };
                    useAddStory(next);
                    onChange(next);
                    return next;
                });
            } 
            else if(type === 'styles' && keyProps) {
                const targetSection = acSchema.find(section => section.id === keyProps);
                const find = targetSection?.scheme?.find((s) => s.id === key);
                const unit = find?.unit ?? '';
                useMergeObject('styles', {
                    [keyProps]: {
                        ...(current?.styles?.[keyProps] ?? {}),
                        [key]: newValue + unit
                    }
                });
            }
            else {
                setSchema((schema) => {
                    const find = schema.find((s) => s.id === key);
                    const unit = find?.unit ?? '';
                    useMergeObject('style', { [key]: newValue + unit });
                    return schema;
                });
            }
        }, 250),
        [elemLink, onChange]
    );
    const createScheme = (typeComponent: ProxyComponentName, props: Record<string, any>) => {
        if(type === 'props') {
            const { schema, acSchema } = useFabrickSchemeProps(typeComponent, props, theme);
            setSchema(schema);
            setAcSchema([]);
        }
        else if(type === 'styles') {
            setSchema([]);
            setAcSchema([...stylesFabricScheme(typeComponent, props.styles ?? {})]);
        }
        else {
            const curSchema = fabrickStyleScheme(type, props.style ?? {});
            setSchema(curSchema);
            setAcSchema([]);
        }
    }

    React.useEffect(() => {
        if (!elemLink) return;
    
        const elem = elemLink.get({ noproxy: true });
        const props = elem?.props;
    
        if (!props || !props['data-id'] || !props['data-type']) return;
        if (!elem || !elem.props || !elem.props['data-id']) return null;
    
        const id = props['data-id'];
        const internalType = props['data-type'];
        const currentKey = `${id}-${type}`;
    
        if (copyDataContent.current?.key === currentKey) return;
    
        // Обновляем всё — новый элемент или режим
        copyDataContent.current = {
            key: currentKey,
            id,
            type,
            'data-type': internalType
        };
    
        const copyProps = sanitizeProps(props);
        setStory([copyProps]);
        setCurrent(copyProps);
        setFuture([]);
    
        createScheme(internalType, copyProps);
    }, [elemLink, type]);
    React.useEffect(() => {
        return () => useEdit.cancel();
    }, []);


    return(
        <motion.div
            className="FORM"
            style={{display:'flex', flexDirection: 'column'}}
            initial={{ opacity: 0 }}     // Начальная непрозрачность 0
            animate={{ opacity: 1 }}     // Конечная непрозрачность 1
            transition={{ duration: 1 }} // Плавное изменение за 1 секунду
        >
            { schema[0] &&
                <Form
                    key={`form-${copyDataContent.current?.key}`}
                    scheme={schema}
                    labelPosition="column"
                    onSpecificChange={(old, news)=> {
                        Object.entries(news).forEach(([key, value]) => useEdit(key, value))
                    }}
                />
            }
            { acSchema[0] &&
                <AccordionForm
                    key={`accordion-${copyDataContent.current?.key}`}
                    scheme={acSchema}
                    labelPosition="column"
                    onSpecificChange={(old, news, keyProps: string)=> {
                        Object.entries(news).forEach(([key, value]) => useEdit(key, value, keyProps))
                    }}
                />
            }
        </motion.div>
    );
}


/**
 * const schema: Schema[] = [];

    if (typeContent === 'Typography') {
        const children = fabrickPropsScheme(typeContent, propsElem.children, 'children');
        const color = fabrickPropsScheme(typeContent, propsElem.color, 'color');
        const variant = fabrickPropsScheme(typeContent, propsElem.variant, 'variant');
        const display = fabrickPropsScheme(typeContent, propsElem.display, 'display');
        const align = fabrickPropsScheme(typeContent, propsElem.align, 'align');
        color.items = getColors(theme);

        schema.push(
            children as Schema<'text'>,
            color as Schema<'toggle'>,
            variant as Schema<'select'>,
            display as Schema<'toggle'>,
            align as Schema<'toggle'>
        );
    }
    else if (typeContent === 'Button') {
        const children = fabrickPropsScheme(typeContent, propsElem.children, 'children');
        const color = fabrickPropsScheme(typeContent, propsElem.color, 'color');
        const variant = fabrickPropsScheme(typeContent, propsElem.variant, 'variant');
        const fullWidth = fabrickPropsScheme(typeContent, propsElem.fullWidth, 'fullWidth');
        //const type = fabrickPropsScheme(typeContent, propsElem.type, 'type');
        const size = fabrickPropsScheme(typeContent, propsElem.size, 'size');
        const startIcon = fabrickPropsScheme(typeContent, propsElem.startIcon, 'startIcon');
        const endIcon = fabrickPropsScheme(typeContent, propsElem.endIcon, 'endIcon');
        color.items = getColors(theme);

        schema.push(
            children as Schema<'text'>,
            //type as Schema<'toggle'>,
            fullWidth as Schema<'switch'>,
            variant as Schema<'select'>,
            size as Schema<'toggle'>,
            color as Schema<'toggle'>,
            startIcon as Schema<'toggle'>,
            endIcon as Schema<'toggle'>,
        );
    }
    else if (typeContent === 'IconButton') {
        const color = fabrickPropsScheme(typeContent, propsElem.color, 'color');
        const size = fabrickPropsScheme(typeContent, propsElem.size, 'size');
        const icon = fabrickPropsScheme(typeContent, propsElem.icon, 'icon');
        color.items = getColors(theme);

        schema.push(
            color as Schema<'toggle'>,
            size as Schema<'toggle'>,
            icon as Schema<'toggle'>,
        );
    }
    else if (typeContent === 'Image') {
        const src = fabrickPropsScheme(typeContent, propsElem.src, 'src');
        const alt = fabrickPropsScheme(typeContent, propsElem.alt, 'alt');
        const sizes = fabrickPropsScheme(typeContent, propsElem.sizes ?? '100vw', 'sizes');
    
        schema.push(
            src as Schema<'text'>,
            alt as Schema<'text'>,
            sizes as Schema<'text'>
        );
    
        const imgixParams = {
            id: 'imgixParams',
            type: 'text',
            multiline: true,
            label: 'imgixParams',
            value: JSON.stringify(propsElem.imgixParams ?? {}, null, 2),
            labelSx: { fontSize: '14px' },
            sx: { fontSize: 12 },
        };
    
        schema.push(imgixParams as Schema<'text'>);
    }
    else if (typeContent === 'TextInput') {
        const left = fabrickPropsScheme(typeContent, propsElem.leftIcon, 'icon');
        const label = fabrickPropsScheme(typeContent, propsElem.label, 'children');
        const placeholder = fabrickPropsScheme(typeContent, propsElem.label, 'children');
        const position = fabrickPropsScheme(typeContent, propsElem.position, 'labelPosition');
        const fullWidth = fabrickPropsScheme(typeContent, propsElem.fullWidth, 'fullWidth');
        
    }
    
    return schema;
 */
import React, { useState } from 'react';
import { Paper, IconButton, Box, Typography } from '@mui/material';
import { Close, DragIndicator, ExpandMore, ExpandLess } from '@mui/icons-material';
import { JsonViewer } from '@textea/json-viewer';
import context, { cellsContent, infoState } from './context';
import { useHookstate } from "@hookstate/core";


export default function InspectorPanel ({ data, onClose }) {
    const [mod, setMod] = useState<'event'|'storage'>('event');
    const [collapsed, setCollapsed] = useState(false);
    const inspector = useHookstate(infoState.inspector);
    
    React.useEffect(()=> {
        sharedEmmiter.onAny((key, value)=> {
            inspector.task.set((prew)=> {
                prew.push({
                    component: key,
                    ...value,
                });
                return prew;
            });
        });
    }, []);


    return (
        <Paper
            sx={{
                zIndex: 1500,
                width: '100%',
                maxHeight: '40vh',
                background: '#1e1e1e',
                color: 'white',
                overflow: 'auto',
                resize: 'both',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Box
                sx={{
                    marginTop:'auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 1,
                    py: 0.5,
                    background: '#2d2d2d',
                    borderTop: '1px solid #5555559d',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    
                    <Typography variant="caption">
                        Инспектор
                    </Typography>
                </Box>
                <Box>
                    <IconButton size="small" onClick={() => setCollapsed(!collapsed)}>
                        {collapsed
                            ? <ExpandLess sx={{ color: '#aaa', fontSize:14 }} />
                            : <ExpandMore sx={{ color: '#aaa', fontSize:14 }} />
                        }
                    </IconButton>
                    <IconButton size="small" onClick={onClose}>
                        <Close sx={{ color: '#aaa', fontSize:14 }} />
                    </IconButton>
                </Box>
            </Box>

            {!collapsed && (
                <Box
                    sx={{
                        fontSize: '11px',
                        fontFamily: 'monospace',
                        lineHeight: 1.4,
                        textAlign: 'left',           // ⬅️ ключевой момент
                        '& *': {
                            textAlign: 'left !important', // на случай переопределений
                        }
                    }}
                >
                    <JsonViewer
                        displayDataTypes={false} 
                        value={
                            mod==='event' 
                                ? [...inspector.task.get()].reverse() 
                                : inspector.lastData.get() 
                        }
                        defaultInspectDepth={3}
                        rootName={false}
                        theme="dark"
                        enableClipboard={true}
                    />
                </Box>
            )}
        </Paper>
    );
}
import React from "react";
import { Button, useTheme, Box, IconButton } from "@mui/material";
import { BorderStyle, ColorLens, FormatColorText, More } from '@mui/icons-material';
import { Component, LayoutCustom } from './type';
import { Settings, Menu, Logout, Palette, Extension, Save, Functions } from "@mui/icons-material";
import context, { cellsContent, infoState } from './context';
import { useHookstate } from "@hookstate/core";
import { TooglerInput } from '../components/input/input.any';
import LeftSideBarAndTool from '../components/nav-bars/tool-left'
import { ContentData } from './Top-bar';
import { updateComponentProps } from './utils/updateComponentProps';
import Forms from './Forms';
import Inspector from './Inspector';

import { componentGroups } from './config/category';
import { createComponentFromRegistry } from './utils/createComponentRegistry';
import { componentMap, componentRegistry } from "./modules/utils/registry";
import { Divider } from "primereact/divider";


type Props = {
    addComponentToLayout: (elem: React.ReactNode)=> void
    useDump: ()=> void
    useEditProps: (component: Component, data: Record<string, any>)=> void
    externalPanelTrigger?: (fn: (panel: 'items' | 'component') => void) => void;
}


const useElements = (currentTool, setCurrentTool, addComponentToLayout) => {
    const categories = Object.entries(componentGroups);
    const itemsInCurrentCategory = Object.entries(componentMap).filter(([type]) => {
        const meta = componentRegistry[type] as any; // или прокинуть icon/category отдельно
  
        const category = meta?.category ?? 'misc';
        return category === currentTool;
    });
    
    return {
        start: (
            <TooglerInput
                value={currentTool}
                onChange={setCurrentTool}
                sx={{ px: 0.2 }}
                items={categories.map(([id, group]) => {
                    const Icon = group.icon ?? Settings;
                    return {
                        id,
                        label: <Icon sx={{ fontSize: 18 }} />
                    };
                })}
            />
        ),
        children: (
            <>
                { itemsInCurrentCategory.map(([type, config]) => {
                    const Icon = componentRegistry[type].icon ?? Settings;

                    return (
                        <Box key={type} sx={{ display: 'flex', flexDirection: 'row', mb: 1 }}>
                            <Button 
                                variant="outlined"
                                style={{color:'#fcfcfc', borderColor:'#fcfcfc61',boxShadow: '0px 2px 1px rgba(0, 0, 0, 0.4)'}}
                                startIcon={<Icon sx={{ color: 'gray', fontSize: 18 }} />}
                                sx={{ width: '100%', opacity: 0.6 }}
                                onClick={() => {
                                    //infoState.select.panel.lastAddedType.set(type);
                                    addComponentToLayout(createComponentFromRegistry(type))
                                }}
                            >
                                { type }
                            </Button>
                        </Box>
                    );
                })}
            </>
        )
    };
}
const useComponent = (elem, onChange, curSub, setSub) => {
    return {
        start: (
            <TooglerInput
                value={curSub}
                disabled={!elem.get()}
                onChange={setSub}
                sx={{px:0.2}}
                items={[
                    { label: <More sx={{fontSize:18}}/>, id: 'props' },
                    { label: <ColorLens sx={{fontSize:18}} />, id: 'styles' },
                    { label: <BorderStyle sx={{fontSize:18}} />, id: 'flex' },
                    { label: <FormatColorText sx={{fontSize:20}} />, id: 'text' },
                ]}
            />
        ),
        children: (
            <Forms
                type={curSub}
                elemLink={elem}
                onChange={onChange}
            />
        )
    };
}
const useFunctions =(elem, onChange, curSub)=> {
    return {
        start: (null),
        children: (
            <>
                functions
            </>
        )
    };
}


// левая панель редактора
export default function ({ addComponentToLayout, useDump }: Props) {
    const select = useHookstate(infoState.select);
    const [currentContentData, setCurrent] = React.useState<ContentData>();
    const [curSubpanel, setSubPanel] = React.useState<'props'|'styles'|'flex'|'text'>('props');
    const [currentToolPanel, setCurrentToolPanel] = React.useState<'items'|'component'|'func'>('items');
    const [currentTool, setCurrentTool] = React.useState<keyof typeof componentGroups>('interactive');

    const menuItems = [
        { id: 'items', label: 'Библиотека', icon: <Extension />},
        { divider: true },
        { id: 'component', label: 'Настройки', icon: <Palette /> },
        { divider: true },
        { id: 'func', label: 'Функции', icon: <Functions /> },
    ];
    const endItems = [
        { id: 'save', label: 'Сохранить', icon: <Save /> },
        { id: 'exit', label: 'Выход', icon: <Logout /> }
    ];

    // слушаем эмитер
    React.useEffect(() => {
        const handler = (data) => {
            if(data.curentComponent) setCurrent(data.curentComponent);
            if(data.currentToolPanel) setCurrentToolPanel(data.currentToolPanel);
            if(data.curSubpanel) setSubPanel(data.curSubpanel);
        }

        EVENT.on('leftBarChange', handler);
        return ()=> EVENT.off('leftBarChange', handler);
    }, []);

    // Обработка навигации по разделам
    const changeNavigation = (item) => {
        if (item.id === 'items') setCurrentToolPanel('items');
        else if (item.id === 'component') setCurrentToolPanel('component');
        else if (item.id === 'func') setCurrentToolPanel('func');
        else if (item.id === 'save') useDump();
    }
    // ANCHOR - updateComponentProps
    const changeEditor = (newDataProps) => {
        const component = select.content.get({ noproxy: true });
        if (component) updateComponentProps({ component, data: newDataProps });
    }
    const changeFunc =()=> {

    }
    
    const panelRenderers = {
        items: () => useElements(currentTool, setCurrentTool, addComponentToLayout),
        component: () => useComponent(select.content, changeEditor, curSubpanel, setSubPanel),
        func: () => useFunctions(select.content, changeFunc, curSubpanel),
    }
    const { start, children } = panelRenderers[currentToolPanel] 
        ? panelRenderers[currentToolPanel]() 
        : { start: null, children: null };

    
    return (
        <LeftSideBarAndTool
            selected={currentToolPanel}
            sx={{ height: '100%' }}
            schemaNavBar={{ items: menuItems, end: endItems }}
            width={260}
            onChangeNavigation={changeNavigation}
            start={start}
            end={
                <Inspector
                    data={ globalThis.sharedContext.get() }
                    onClose={console.log}
                />
            }
        >
            <Box sx={{ mt: 1, mx: 1 }}>
                { children }
            </Box>
        </LeftSideBarAndTool>
    );
}
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import context, { infoState, renderState } from './context'; 
import { useHookstate } from '@hookstate/core';
import { Component } from './type';
import { getComponentById } from './utils/editor';

//! особые условия стилей для компонентов (!это костыли, вся логика в обертки идет)
class Styler {
    ref: Element
    styleWrapper: React.CSSProperties
    children: Component

    constructor(children, styleWrapper) {
        this.ref = document.querySelector(`[data-id="${children.props['data-id']}"]`);
        this.styleWrapper = styleWrapper;
        this.children = children;
        this.type = this.children.props['data-type'];
        this.init();
    }
    Typography() {
        this.ref.style.width = '100%'
    }
    init() {
        const childProps = this.children.props;

        if(childProps.style) {
            const style = childProps.style;
            
            if(childProps.fullWidth) {
                this.styleWrapper.display === 'block'
                this.styleWrapper.display = 'flex';
                this.styleWrapper.width = '100%';

                if(this.ref) {
                    if(this[this.type]) this[this.type]();
                    // что бы кнопка с иконками не ратекелась
                    this.ref.style.display = 'flex';
                }
            }
        }
    }
}


export function SortableItem({ id, children, ...props }: { id: number, children: Component }) {
    const itemRef = React.useRef<HTMLDivElement>(null);
    const [isLastInRow, setIsLastInRow] = React.useState(false);        // флаг то что элемент последний в строке
    const dragEnabled = useHookstate(context.dragEnabled);
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ 
        id ,
        disabled: !dragEnabled.get()        // ✅ глобальный флаг
    });

    
    const styleWrapper: React.CSSProperties = {
        position: 'relative',
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        width: children.props.fullWidth ? (children.props.width ?? '100%') : 'fit-content',
        display: 'inline-flex',
        verticalAlign: 'top',
        cursor: dragEnabled.get() ? 'grab' : 'default',
        // для отладки
        paddingTop: 3,
        paddingBottom: 3,
        borderRight: '1px dotted #8580806b',
        transformOrigin: 'center',
        scale: isDragging ? '0.95' : '1',
    }
    //ANCHOR - отслеживает ключевые свойства(маркеры) на компоненте и устанавливает на обертку спец стили
    const useSetStyleFromPropsComponent = () => {
        if(children?.props) {
            const childProps = children.props;

            const styler = new Styler(children, styleWrapper);
        }
        
        return styleWrapper;
    } 
    const handleClick = () => {
        // Ищем компонент в render по id
        const all = renderState.get({ noproxy: true });
        const found = all
            .flatMap(layer => layer.content ?? [])
            .find(comp => comp?.props?.['data-id'] === id);

        if (found) {
            infoState.select.content.set(found);

            // Визуально подсветим
            document.querySelectorAll('[data-id]').forEach(el => {
                el.classList.remove('editor-selected');
            });
            const el = document.querySelector(`[data-id="${id}"]`);
            if (el) el.classList.add('editor-selected');
        }
    }
    React.useEffect(() => {
        if (!itemRef.current) return;

        const update = () => {
            const parent = itemRef.current?.parentElement;
            if (!parent) return;

            const items = Array.from(parent.children) as HTMLElement[];

            // Найдём себя и проверим — последняя ли строка
            const self = itemRef.current;
            const selfTop = self.getBoundingClientRect().top;

            const lastInSameRow = items
                .filter((el) => el.getBoundingClientRect().top === selfTop)
                .pop();
            
            setIsLastInRow(lastInSameRow === self);
        };

        update();
        const resizeObserver = new ResizeObserver(update);
        resizeObserver.observe(itemRef.current);

        return () => resizeObserver.disconnect();
    }, []);
    

    return (
        <div
            ref={(node) => {
                setNodeRef(node);
                itemRef.current = node;
            }}
            style={useSetStyleFromPropsComponent()}
            {...attributes}
            {...(dragEnabled.get() ? listeners : {})}
            onClick={handleClick} 
            onDoubleClick={()=> {
                const comp = getComponentById(id);
                EVENT.emit('leftBarChange', {
                    currentToolPanel: 'component',
                    curSubpanel: 'props',
                    curentComponent: comp
                });
            }}
            { ...props }
        >
            { children }
        </div>
    );
}
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, useTheme, Box, Dialog, Paper, Typography, Tooltip, IconButton, Menu as MenuPoup } from "@mui/material";
import { Component, LayoutCustom } from './type';
import { Settings, Menu, Logout, VerifiedUser, Extension, Save } from "@mui/icons-material";
import context, { cellsContent, infoState } from './context';
import { useHookstate } from "@hookstate/core";
import SelectButton from "../components/popup/select.button";
import Inspector from './Inspector';

export type ContentData = {
    id: number 
    type: 'Button' | 'IconButton' | 'Typography'
}

/**
 * --------------------------------------------------------------------------
 * список всех компонентов редактора
 * todo: что бы восстановить позицию элемента после редактора:  
 *      style={{transform: `translate(${comp.offset.x}px, ${comp.offset.y}px)`,}}
 * todo: дессериализатор функции:
 *      const deserializedFunction = eval('(' + serializedFunction + ')');
 * --------------------------------------------------------------------------
 */ 


// верхняя полоска (инфо обшее)
export const ToolBarInfo = () => {
    const [data, setSData] = React.useState();
    const [open, setOpen] = React.useState<undefined>();
    const [currentContentData, setCurrent] = React.useState<ContentData>();
    const [bound, setBound] = React.useState<DOMRect>();
    const select = useHookstate(infoState.select);
    const container = useHookstate(infoState.container);


    React.useEffect(()=> {
        const value = select.cell.get({noproxy:true});

        if(value) {
            const bound = value.getBoundingClientRect();
            setBound(bound);
        }
    }, [select.cell]);
    React.useEffect(()=> {
        const content = select.content.get({ noproxy: true });

        if(content) {
            if(content.props['data-id']) setCurrent({
                id: content.props['data-id'],
                type: content.props['data-type']
            });
            else console.warn('🚨 У контента отсутствует data-id');
        }
    }, [select.content]);


    return (
        <Paper elevation={2}
            sx={{
                height:'5%', 
                width:'99%', 
                background:'rgb(58, 58, 58)',
                border: '1px solid #cdcbcb36',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                px: 3,
                ml: 0.5
            }}
        >
            <Box>
                <MenuPoup 
                    anchorEl={open} 
                    keepMounted 
                    PaperProps={{
                        style: {
                            width: '40%'
                        },
                    }}
                    open={Boolean(open)} 
                    onClose={()=> setOpen()}
                    sx={{mt: 1}}
                >
                    <Box sx={{p:2, display:'flex', justifyContent:'center'}}>
                        { select.content.get({ noproxy: true }) }
                    </Box>
                </MenuPoup>
                { currentContentData &&
                    <Button 
                        color='navigation'
                        onClick={(e)=> setOpen(e.currentTarget)} 
                        sx={{fontSize:'12px',textDecoration:'underline'}}
                    >
                        { currentContentData.type }
                    </Button>
                }
            </Box>
            <Box sx={{ml:'auto'}}>
                <SelectButton
                    variant="outlined"
                    color='inherit'
                    sx={{color: '#bababa69', background:'#0000001a',fontSize:12}}
                    value={{ id: 'home', label: 'Компоновшик', icon: <Extension /> }}
                    items={[
                        { id: 'home', label: 'Компоновшик', icon: <Extension /> },
                        { id: 'grid', label: 'Сетка' }
                    ]}
                    onChange={(v)=> context.mod.set(v.id)}
                />
            </Box>
            <Box
                sx={{ml: 'auto', display: 'flex',}}
            >
                <span style={{marginRight:'5px',opacity:0.8}}>⊞</span> 
                <Tooltip title="ℹ размеры базового контейнера">
                    <Typography sx={{mr:1, color:'gold'}} variant='subtitle1'>
                        { container.width.get() } x { container.height.get() }
                    </Typography>
                </Tooltip>
                { bound && 
                    <Tooltip title="ℹ размеры выбранной ячейки">
                        <Typography variant='caption' sx={{textDecoration:'underline'}}>
                            ⌗ { bound.width } x { bound.height }
                        </Typography>
                    </Tooltip>
                }
            </Box>
        </Paper>
    );
}
import { Layout } from "react-grid-layout";
import { RegistreTypeComponent } from './config/type';
import React from 'react'


// все компоненты исходные используемые в редакторе и вне
export type ProxyComponentName = RegistreTypeComponent;
export type DataEmiters = 'onChange' | 'onClick' | 'onSelect';

// ---------------- styles  -----------------
export type InputStyles = {
    form?: {
        borderStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset' | 'none'
        borderColor?: string | 'none'
        background?: string | 'none'
    }
    placeholder?: React.CSSProperties
    label?: React.CSSProperties
    icon?: React.CSSProperties
}


//------------------------------------------
export type ComponentProps = {
    'data-id': number
    'data-type': ProxyComponentName
    /** если генерит события, то будет список labels emiters */
    'data-pubs' ?: DataEmiters[]
    /** на кого подписан */
    'data-subs' ?: string | number[]
    children ?: string | any
    style ?: React.CSSProperties
    styles?: InputStyles | any
    [key: string]: any
}
/** 
 * Компонент в редакторе (в ячейках)
 * все дочерние компоненты установленные редактором 
 */
export type Component = React.ReactElement & {
    _store: {
        index: number
    }
    props: ComponentProps
    type: {
        functions?: {}
        parent?: string
    }
}
/** серриализованный вид */
export type ComponentSerrialize = {
    id: number | string
    /** id ячейки */
    parent: string
    functions?: {
        [key: string]: string
    }
    props: {
        "data-type": string,
        "data-offset"?: { x: number; y: number },
        [key: string]: any
    }
    
}




export type DraggbleElementProps = {
    component: Component
    index: number
    cellId: number
    useStop: (component: any, data: {x: number, y: number})=> void
    useDelete: (cellId: string | number, componentIndex: number)=> void
}
export type LayoutCustom = Layout & {
    /** id рендер элемента */
    content?: string | Component[]
}
export type GridEditorProps = {
    setLayout: (old: Layout[])=> void
    layout: LayoutCustom[]
    renderItems: React.ReactNode[]
    tools: React.ReactNode
}
export type PropsForm = {
    elemLink: any
    type: 'props'|'styles'|'flex'|'text'
    onChange: (data: Record<string, any>)=> void
}
import { iconsList } from '../../components/tools/icons';
import { ViewModule, TouchApp, Photo, Layers, Widgets } from '@mui/icons-material';

// ! мусор
/** 
export const componentRegistry = {
    Typography: {
        type: 'Typography',
        category: 'interactive',
        icon: iconsList.TextFields,
        defaultProps: {
            children: 'Текст по умолчанию',
            variant: 'body1',
            color: 'textPrimary',
            'data-type': 'Typography',
            fullWidth: true,
            style: {
                display: 'flex',  
            }
        },
    },
    Button: {
        type: 'Button',
        category: 'interactive',
        icon: iconsList.TouchApp,
        defaultProps: {
            children: 'Кнопка',
            variant: 'outlined',
            color: 'primary',
            'data-type': 'Button',
            fullWidth: true,
            style: {display: 'block'}
        },
    },
    IconButton: {
        type: 'IconButton',
        category: 'interactive',
        icon: iconsList.Settings,
        defaultProps: {
            icon: 'Settings',
            color: 'secondary',
            'data-type': 'IconButton',
        },
    },
    Image: {
        type: 'Image',
        category: 'media',
        icon: iconsList.Photo,
        defaultProps: {
            src: 'https://cs5.pikabu.ru/post_img/big/2015/06/04/11/1433446202_1725992411.jpg',
            alt: 'Картинка',
            width: '50%',
            height: 'auto',
            'data-type': 'Image',
        },
    },
    Video: {
        type: 'Video',
        category: 'media',
        icon: iconsList.VideoLibrary,
        defaultProps: {
            src: '',
            controls: true,
            'data-type': 'Video',
        },
    },
    Card: {
        type: 'Card',
        category: 'block',
        icon: iconsList.ViewModule,
        defaultProps: {
            elevation: 2,
            sx: { padding: 2 },
            'data-type': 'Card',
        },
    },
    Carousel: {
        type: 'Carousel',
        category: 'complex',
        icon: iconsList.Slideshow,
        defaultProps: {
            items: [],
            'data-type': 'Carousel',
        },
    },
}
*/


// * final
export const componentGroups = {
    block: {
        label: 'Базовые блоки',
        icon: ViewModule,
    },
    interactive: {
        label: 'Интерактивные',
        icon: TouchApp,
    },
    media: {
        label: 'Медиа',
        icon: Photo,
    },
    complex: {
        label: 'Сложные блоки',
        icon: Layers,
    },
    misc: {
        label: 'Прочее',
        icon: Widgets,
    },
}
/**
 * ------------------------------------------------
 * Шаблоны для разных компонентов (заготовки стилей)
 * ------------------------------------------------
 */

export const buttons = {

}

export const buttonsInput = {

}

export const texts = {

}
/**
 * ---------------------------------------------
 * пропсы компонентов
 * ---------------------------------------------
 */
const propsButton = {
    variant: ['text', 'outlined', 'contained'], // Стиль кнопки
    color: ['inherit', 'primary', 'secondary', 'success', 'error', 'info', 'warning'], // Цвета
    size: ['small', 'medium', 'large'], // Размеры
    disabled: [true, false], // Отключение кнопки
    fullWidth: [true, false], // Растянуть на 100%
    //type: ['button', 'submit', 'reset'], // Тип HTML-кнопки
    startIcon: 'ReactNode', // Иконка до текста (например, <SaveIcon />)
    endIcon: 'ReactNode', // Иконка после текста
    onClick: 'function', // Обработчик клика
    href: 'string', // Ссылка (если кнопка как ссылка)
    component: 'elementType', // Например, Link из react-router
    children: 'ReactNode', // Текст или элементы внутри кнопки
    sx: 'SxProps', // Стили через sx пропс
    className: 'string', // CSS класс
    style: 'CSSStyleDeclaration', // Инлайн стили
    id: 'string', // id элемента
    disableElevation: [true, false], // Убрать тень у кнопки (только для contained)
    disableRipple: [true, false], // Убрать ripple-эффект при клике
    disableFocusRipple: [true, false], // Убрать ripple при фокусе
}

const propsIconButton = {
    color: ['default', 'inherit', 'primary', 'secondary', 'success', 'error', 'info', 'warning'], // Цвет
    size: ['small', 'medium', 'large'], // Размер
    edge: [false, 'start', 'end'], // Смещение к краю контейнера
    disabled: [true, false], // Отключение
    onClick: 'function', // Обработчик клика
    children: 'ReactNode', // Иконка внутри
    href: 'string', // Если нужна ссылка
    component: 'elementType', // Например, Link из react-router
    sx: 'SxProps', // Стили через sx
    className: 'string', // CSS-класс
    style: 'CSSStyleDeclaration', // Инлайн стили
    id: 'string', // id элемента
    disableFocusRipple: [true, false], // Отключить ripple при фокусе
    disableRipple: [true, false], // Отключить ripple-эффект
}

const propsTypography = {
    variant: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'subtitle1', 'subtitle2', 'body1', 'body2', 'caption', 'overline', 'button', 'srOnly'], // Типы текста
    align: ['left', 'center', 'right', 'justify'], // Выравнивание текста 'inherit', 
    color: ['initial', 'textPrimary', 'textSecondary', 'error', 'primary', 'secondary', 'inherit'], // Цвет текста
    gutterBottom: [true, false], // Добавить нижний отступ
    noWrap: [true, false], // Отключить перенос строк
    paragraph: [true, false], // Сделать текст абзацем (добавляется дополнительный отступ снизу)
    display: ['initial', 'inline', 'block', 'inline-block', 'flex', 'inline-flex', 'grid', 'inline-grid'], // Свойство display для управления отображением
    variantMapping: { // Маппинг типов для других компонентов
        h1: 'h1',
        h2: 'h2',
        h3: 'h3',
        h4: 'h4',
        h5: 'h5',
        h6: 'h6',
        subtitle1: 'h6',
        subtitle2: 'h6',
        body1: 'p',
        body2: 'p',
        caption: 'span',
        overline: 'span',
        button: 'span',
        srOnly: 'span',
    }, // Связь с другими элементами
    component: 'elementType', // Тип компонента (например, 'div', 'span', 'a')
    children: 'ReactNode', // Контент внутри Typography
    sx: 'SxProps', // Стили через sx пропс
    className: 'string', // CSS класс
    style: 'CSSStyleDeclaration', // Инлайн стили
    id: 'string', // id элемента
}

const propsImage = {
    src: 'string',
    alt: 'string',
    sizes: 'string',
    imgixParams: 'object', // можно редактировать позже через JSON-форму
}

const propsInput = {
    label: 'string',
    position: ['none', 'column', 'left', 'right'],
    divider: ['none', 'solid', 'dashed', 'dotted'],
    placeholder: 'string',
    leftIcon: 'string',
    //! композитный тип
    styles: {
        form: {
            borderStyle: ['none', 'solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset'],
            borderColor: { type: 'color' },
            background: { type: 'color' }
        },
        placeholder: {
              // типы которые применяются как преформа
            color: { type: 'color' },
            opacity: { type: 'slider', min: 0, max: 1, step: 0.01 },
            fontFamily: { type: 'autocomplete', options: globalThis.FONT_OPTIONS }
        },
        label: {
            color: { type: 'color' },
            fontSize: { type: 'slider', min: 8, max: 48, step: 1 },
            fontFamily: { type: 'autocomplete', options: globalThis.FONT_OPTIONS }
        },
        icon: {
            fontSize: { type: 'slider', min: 8, max: 48, step: 1 },
            opacity: { type: 'slider', min: 0, max: 1, step: 0.01 },
            color: { type: 'color' }
        }
    }
}


export default {
    Button: propsButton,
    IconButton: propsIconButton,
    Typography: propsTypography,
    Image: propsImage,
    TextInput: propsInput,
    NumberInput: propsInput,
    
}
import {
    FormatAlignLeft,
    FormatAlignRight,
    FormatAlignCenter,
    FormatAlignJustify,
    ViewStream,              // как альтернатива для space-between
    ViewModule,              // альтернатива для space-around
    DensityMedium
} from '@mui/icons-material';
import {
    SyncAlt,        // Для "row"
    LinearScale,         // Для "column"
    Autorenew, // Для "row-reverse"
    SwapVerticalCircle  // Для "column-reverse"
} from '@mui/icons-material';
import {
    TextFields,        // Для "lowercase"
    TextFormat,        // Для "capitalize"
    FontDownload,      // Для "none"
    TextRotationNone   // Для "uppercase"
} from '@mui/icons-material';


export const iconListStyle = {
    justifyContent: {
        "flex-start": FormatAlignLeft,
        "flex-end": FormatAlignRight,
        "center": FormatAlignCenter,
        "space-between": ViewStream,
        "space-around": ViewModule,
        "space-evenly": DensityMedium
    },
    flexDirection: {
        "row": ViewModule,
        "column": DensityMedium,
        "row-reverse": SyncAlt,
        "column-reverse": Autorenew
    },
    textAlign: {
        "left": FormatAlignLeft,
        "right": FormatAlignRight,
        "center": FormatAlignCenter,
        "justify": FormatAlignJustify,
    },
    textTransform: {
        "lowercase": TextFields,
        "capitalize": TextFormat,
        "uppercase": TextRotationNone
    }
}
/**
 * -------------------------------------------------------------------
 * Инлайн стили
 * -------------------------------------------------------------------
 */
export const baseOptions = {
    display: [
        "block",
        "flex",
        "inline",
        "inline-block",
        "grid",
        "contents",
    ],
    textAlign: [
        "left",
        "center",
        "right",
        "justify",
        "start",
        "end",
    ],
    width: 'limit',
    height: 'limit',
    background: "color",
    //backgroundColor: "color",
    color: "color",
    padding: "number",
    //paddingLeft: "string?",
    //paddingRight: "string?",
    //paddingTop: "string?",
    //paddingBottom: "string?",
    margin: "number",
    //marginLeft: "string?",
    //marginRight: "string?",
    //marginTop: "string?",
    //marginBottom: "string?",
    borderRadius: "number"
}
export const flexOptions = {
    //flex: false,            //! тут надо покурить документацию (можно прикольно сделать)
    flexDirection: ["column", "column-reverse", "row", "row-reverse"],
    flexWrap: ["nowrap", "wrap", "wrap-reverse"],
    justifyContent: [
        "flex-start",
        "flex-end",
        "center",
        "space-between",
        "space-around",
        "space-evenly",
    ],
    alignItems: ["stretch", "flex-start", "flex-end", "center", "baseline"],
    alignContent: [
        "stretch",
        "flex-start",
        "flex-end",
        "center",
        "space-between",
        "space-around",
    ],
    alignSelf: ["auto", "stretch", "flex-start", "flex-end", "center", "baseline"],
}
export const textOptionsAll = {
    "fontFamily": undefined,
    "fontWeight": ['normal', 'bold', '600', '800'],
    "fontSize": [6, 32],
    "letterSpacing": "number",
    "wordSpacing": "number",
    "fontStyle": ["normal", "italic", "oblique"],
  
    "textAlign": ["left", "center" ,"right", "justify", "start", "end"],
    "textOverflow": ["clip", "ellipsis"],
    "textTransform": ["lowercase", "capitalize", "none", "uppercase"],
  
    "textDecoration": ["line-through", "none", "overline", "underline"],
    "textDecorationStyle": ["solid", "double", "dotted", "dashed", "wavy"],
    "textDecorationThickness": undefined,
    "textDecorationColor": undefined,
  
    "overflowWrap": ["normal", "break-word"],
    "whiteSpace": ["normal", "pre", "nowrap", "pre-wrap", "pre-line"],
    "verticalAlign": ["baseline", "top", "bottom", "middle", "sub", "super", "text-top", "text-bottom"],
    "wordBreak": ["normal", "break-all", "keep-all", "break-word"],
  
    "direction": ["ltr", "rtl"],
    "text-shadow": undefined
}
export const textOptions = {
    "fontFamily": 'string',
    "fontWeight": ['normal', 'bold', '600', '800'],
    "fontSize": [6, 32],
    "letterSpacing": 'number',
    "wordSpacing": 'number',
    "fontStyle": ["normal", "italic", "oblique"],
  
    "textAlign": ["left", "right", "center", "justify", "start", "end"],
    "textOverflow": ["clip", "ellipsis"],
    "textTransform": ["none", "lowercase", "capitalize", "uppercase"],
    "textDecoration": ["line-through", "none", "overline", "underline"],
    "textDecorationStyle": ["solid", "double", "dotted", "dashed", "wavy"],
  
    "overflowWrap": ["normal", "break-word"],
    "whiteSpace": ["normal", "pre", "nowrap", "pre-wrap", "pre-line"],
    "verticalAlign": ["baseline", "top", "bottom", "middle", "sub", "super", "text-top", "text-bottom"],
    "wordBreak": ["normal", "break-all", "keep-all", "break-word"],
}


export const stylesOptions = {
    borderRadius: "number",
    borderStyle: ['none', 'solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset'],
    background: "color",
    color: "color",

    marginLeft: "number",
    marginRight: "number",
    marginTop: "number",
    marginBottom: "number",

    paddingLeft: "number",
    paddingRight: "number",
    paddingTop: "number",
    paddingBottom: "number",
}
export interface BaseType {
    display: "block" | "inline" | "inline-block" | "flex" | "grid" | "none" | "contents" | "hidden"
    width: string
    height: string
    background: string
    backgroundColor: string
    color: string
    margin?: string
    marginLeft?: string
    marginRight?: string
    marginTop?: string
    marginBottom?: string
    padding: string
    paddingLeft?: string
    paddingRight?: string
    paddingTop?: string
    paddingBottom?: string
    textAlign: "left" | "right" | "justify" | "start" | "end" | 'center'
    borderRadius: string
}

export interface FlexType extends BaseType {
    flexDirection?: "column" | "row" | "row-reverse" | "column-reverse",
    flexWrap?: "nowrap" | "wrap" | "wrap-reverse", // Определяет, должны ли элементы перетекать на новую строку или колонку
    justifyContent?: "flex-start" | "flex-end" | "center" | "space-between" | "space-around" | "space-evenly", // Выравнивание элементов по основной оси
    alignItems?: "stretch" | "flex-start" | "flex-end" | "center" | "baseline", // Выравнивание элементов по поперечной оси
    alignContent?: "stretch" | "flex-start" | "flex-end" | "center" | "space-between" | "space-around", // Выравнивание строк по поперечной оси
    alignSelf?: "auto" | "stretch" | "flex-start" | "flex-end" | "center" | "baseline", // Выравнивание конкретного элемента по поперечной оси
    flexGrow?: number, // Описание способности элемента расширяться
    flexShrink?: number, // Описание способности элемента сжиматься
    flexBasis?: string, // Начальная длина элемента до применения flex-grow или flex-shrink
    flex?: string, // Краткая запись для flexGrow, flexShrink и flexBasis
    order?: number, // Задает порядок элементов внутри флекс-контейнера
    gap?: string, // Расстояние между флекс-элементами
}

export interface TextType extends BaseType {
    fontFamily: string
    fontWeigh: string 
    fontSize: string
    letterSpacing: string
    wordSpacing: string
    fontStyle: "normal" | "italic" | "oblique"

    textAlign: "left" | "right" | "center" | "justify" | "start" | "end"
    textOverflow: "clip" | "ellipsis"
    textTransform: "lowercase" | "capitalize" | "none" | "uppercase"

    textDecoration: "line-through" | "none" | "overline" | "underline"
    textDecorationStyle: "solid" | "double" | "dotted" | "dashed" | "wavy"
    textDecorationThickness: string
    textDecorationColor: string
  
    overflowWrap: "normal" | "break-word"
    whiteSpace: "normal" | "pre" | "nowrap" | "pre-wrap" | "pre-line"
    verticalAlign: "baseline" | "top" | "bottom" | "middle" | "sub" | "super" | "text-top" | "text-bottom"
    wordBreak: "normal" | "break-all" | "keep-all" | "break-word"
  
    direction: "ltr" | "rtl"
    unicodeBidi: "normal" | "embed" | "bidi-override"
    textShadow: string
}

export type PropsTypesEditor = 'color'
    | 'variant'
    | 'children'
    | 'size'
    | 'startIcon'
    | 'endIcon'
    | 'display'
    | 'align'
    | 'fullWidth'
    | 'type'
    | 'icon'
    | 'src'
    | 'alt'
    | 'sizes'
    | 'labelPosition'

export type RegistreTypeComponent = 'Button'
    | 'IconButton'
    | 'Image'
    | 'Typography'
    | 'Text'
    | 'TextInput'
    
export type BoxSide = 'top' | 'right' | 'bottom' | 'left';

export type BorderInfo = {
    side: BoxSide
    isVisible: boolean;
    width: string;
    style: string;
    color: string;
}
export type SpacingInfo = {
    side: BoxSide
    value: string
    isSet: boolean
}
import React from "react";
import { Theme, Tooltip } from "@mui/material";
import { FormatAlignCenter, FormatAlignJustify, FormatAlignLeft, FormatAlignRight, LinearScale,  
    ViewColumn, ViewList, ViewQuilt, ViewArray, ViewCarousel, ViewComfy, ViewCompact, 
    ViewModule, ViewAgenda, Widgets
} from "@mui/icons-material";
import { iconsList } from '../../components/tools/icons';
import { RegistreTypeComponent } from './type';
import { Schema, AccordionScnema } from '../../index';
import { flexOptions, textOptions } from './style';
import { iconListStyle } from './style-icons';
import metaProps from './props';                 // списки возможных пропсов каждого компонента


// отделяет значения числовые от постфиксов
export function parseStyleValue(value?: string) {
    if (typeof value !== 'string') return { number: 0, unit: '' };

    const match = value.match(/^([\d.]+)([a-z%]*)$/);
    if (!match) return { number: 0, unit: '' };

    const [, number, unit] = match;
    const num = parseFloat(number);
    return {
        number: isNaN(num) ? 0 : num,
        unit,
    };
}
const decorize = (keyListStyle: string, keyListVariant: string) => {
    const list = iconListStyle[keyListStyle];
    

    if(list && list[keyListVariant]) {
        const Icon = list[keyListVariant];

        return(
            <Tooltip title={keyListVariant} placement="top" arrow >
                <Icon sx={{fontSize: '14px'}} />
            </Tooltip>
        );
    }
    else {
        return (
            <span style={{ fontSize: '8px', whiteSpace: 'nowrap', color: 'silver' }}>
                { keyListVariant }
            </span>
        );
    }
}


// --------------------------------------------------------------------------------
export const getColors = (theme: Theme) => {
    const palette = theme.palette;

    const color = {
        primary: palette.primary.main,
        secondary: palette.secondary.main,
        error: palette.error.main,
        success: palette.success.main,
        info: palette.info.main,
        warning: palette.warning.main,
        textPrimary: palette.text.primary,
        textSecondary: palette.text.secondary
    }

    return Object.keys(color).map((key) => {
        return {
            label: <div style={ { width: '20px', height: '20px', background: color[key] } }/>,
        id: key
    }
    });
}
export const fabrickStyleScheme = (listType: 'flex' | 'text', sourceStyle: any) => {
    const listTypes = { flex:flexOptions, text:textOptions }[listType];
    const result: Schema[] = [];

    Object.keys(listTypes).forEach((key, index) => {
        const data = listTypes[key];            // значение из option

        // списки, диапазоны
        if (Array.isArray(data)) {
            const length = listTypes[key].length;
            let schema: Schema;

            // диапазон
            if (typeof data[0] === 'number') {
                const parseValue = parseStyleValue(sourceStyle[key]);

                schema = {
                    id: key,
                    type: 'slider',
                    label: key,
                    value: parseValue.number,
                    unit: parseValue.unit,
                    labelSx: {
                        fontSize: '12px',
                    },
                    min: data[0],
                    max: data[1]
                }
            }
            // списки
            else {
                schema = {
                    id: key,
                    type: 'toggle',
                    label: key,
                    value: sourceStyle[key],
                    labelSx: {
                        fontSize: '12px',
                    },
                    items: listTypes[key].map((label, id) => ({
                        label: decorize(key, label),
                        id: label
                    }))
                }
            }

            result.push(schema);
        }
        // все что должно потом в строку перейти с 'px' или '%'
        else if (data === 'number') {
            const parseValue = parseStyleValue(sourceStyle[key]);
            const schema = {
                id: key,
                type: 'number',
                label: key,
                value: parseValue.number,
                unit: parseValue.unit,          // ! не забыть подставить в выходное
                labelSx: {
                    fontSize: '12px',
                },
            }

            result.push(schema);
        }
        // выбор цвета
        else if (data === 'color') {
            const schema = {
                id: key,
                type: 'color',
                label: key,
                value: sourceStyle[key],
                labelSx: {
                    fontSize: '12px',
                },
            }

            result.push(schema);
        }
        // текстовое значение (можно расширить)
        else if (data === 'string') {
            const schema = {
                id: key,
                type: 'text',
                label: key,
                value: sourceStyle[key],
                labelSx: {
                    fontSize: '12px',
                },
            }

            result.push(schema);
        }
    });

    return result;
}
/** [?] `stylesScheme` - styles props, `source` - данные которые уже есть в styles */ 
export const stylesFabricScheme = (type: RegistreTypeComponent, source: Record<string, any>) => {
    const result: AccordionScnema[] = [];
    const stylesScheme: Record<string, any> = metaProps[type]?.styles ?? {};


    Object.keys(stylesScheme).forEach((keyStyle) => {
        const curentStyles = stylesScheme[keyStyle];
        const acordeon: AccordionScnema = {
            id: keyStyle,
            label: keyStyle,
            scheme: []
        };
        
        Object.keys(curentStyles).forEach((key) => {
            const data = curentStyles[key]; 

            if(typeof data === 'object' && data !== null && !Array.isArray(data)) {
                let parseValue = source?.[keyStyle]?.[key] ?? '';

                if(data.type === 'slider') {
                    if(!parseValue) parseValue = 0;
                    else parseValue = +parseValue;
                }

                const schema = {
                    ...data,
                    id: key,
                    label: key,
                    //unit: parseValue.unit,
                    value: parseValue,
                    labelSx: {
                        fontSize: '12px',
                    },
                }

                acordeon.scheme.push(schema);
            }
            else if(Array.isArray(data)) {
                const length = curentStyles[key].length;
                let schema: Schema;

                // диапазон
                if (typeof data[0] === 'number') {
                    const parseValue = source?.[keyStyle]?.[key] ?? 0;

                    schema = {
                        id: key,
                        type: 'slider',
                        label: key,
                        value: parseValue,
                        //unit: parseValue.unit,
                        labelSx: {
                            fontSize: '12px',
                        },
                        min: data[0],
                        max: data[1]
                    }
                }
                // списки
                else {
                    schema = {
                        id: key,
                        type: 'toggle',
                        label: key,
                        value: source?.[keyStyle]?.[key] ?? '',
                        labelSx: {
                            fontSize: '12px',
                        },
                        items: curentStyles[key].map((label, id) => ({
                            label: decorize(key, label),
                            id: label
                        }))
                    }
                }

                acordeon.scheme.push(schema);
            }
        });

        result.push(acordeon);
    });

    return result;
}



/**
 * ФАБРИКА КОНСТРУИРУЕТ ФОРМЫ ДЛЯ ПРОПСОВ
 * @param type 
 * @param defaultValue 
 * @param typeProps 
 * @returns 
 */
export const fabrickUnical = (propName: string, propValue:any, theme, typeComponent?:RegistreTypeComponent) => {
    const displayIcons = {
        left: <FormatAlignLeft />,
        center: <FormatAlignCenter />,
        right: <FormatAlignRight />,
        justify: <FormatAlignJustify />,

        initial: <span style={{ fontSize: '11px', whiteSpace: 'nowrap' }}> init </span>,
        block: <LinearScale />,
        inline: <ViewColumn />,
        'inline-block': <span style={{ fontSize: '11px', whiteSpace: 'nowrap' }}>in -b </span>,
        flex: <Widgets />,
        'inline-flex': <ViewList />,
        grid: <ViewQuilt />,
        'inline-grid': <ViewArray />,
        none: <span style={{ fontSize: '11px', whiteSpace: 'nowrap' }}>✖️</span>
    }
    Object.keys(displayIcons).map((key) => {
        displayIcons[key] = (
            <Tooltip title={key} placement="top" arrow >
                { displayIcons[key] }
            </Tooltip>
        )
    });


    if (propName === 'color') {
        return {
            type: 'toggle',
            id: propName,
            items: getColors(theme),
            label: propName,
            value: propValue,
            labelSx: { fontSize: '14px' }
        }
    }
    else if (propName === 'size') {
        return {
            type: 'toggle',
            id: propName,
            items: [
                { id: 'small', label: <var style={{ fontStyle: 'italic' }} > sm </var> },
                { id: 'medium', label: <var style={{ fontWeight: 400 }}> md </var> },
                { id: 'large', label: <var style={{ fontWeight: 'bold' }}> lg </var> }
            ],
            label: propName,
            value: propValue,
            labelSx: { fontSize: '14px' }
        }
    }
    else if (propName === 'display' || propName === 'labelPosition') {
        return {
            type: 'toggle',
            id: propName,
            label: propName,
            labelSx: { fontSize: '14px' },
            value: propValue,
            items: ['none', 'left', 'right', 'column'].map((key) => ({
                id: key,
                label: displayIcons[key]
            }))
        }
    }
    else if (['icon', 'endIcon', 'startIcon', 'leftIcon'].includes(propName)) {
        const items = Object.keys(iconsList).map((key) => {
            const Render = iconsList[key];

            return ({
                id: key,
                label: <Render />
            })
        });
        items.unshift({
            id: 'none',
            label: <span style={{ fontSize: '10px', whiteSpace: 'nowrap', color: 'gray' }}>✖️</span>
        });

        return {
            type: 'toggle',
            id: propName,
            label: propName,
            labelSx: { fontSize: '14px' },
            value: propValue,
            items: items
        }
    }
    else if(typeComponent && metaProps[typeComponent]?.[propName]) {
        const vars: [] | string = metaProps[typeComponent][propName];
        
        if(vars === 'string') {

        }
        else if(Array.isArray(vars)) {
            const type = vars.length < 5 ? 'toggle' : 'select';

            const result = {
                type: type,
                id: propName,
                label: propName,
                labelSx: { fontSize: '10px' },
                value: propValue,
                items: vars.map((key) => ({
                    id: key,
                    label: (
                        <>
                            { type === 'select' && <span style={{ fontSize: '14px', whiteSpace: 'nowrap' }}>{key}</span>}
                            { type === 'toggle' && <span style={{ fontSize: '8px', whiteSpace: 'nowrap' }}>{key}</span>}
                        </>
                    )
                }))
            }

            if(type==='select') result.onlyId = true;
            return result;
        }
    }
}



// ---------------------------------------------------------------------------------
// ! снести
export const utill = {
    getSize(element: Element) {
        const bound = element.getBoundingClientRect();
        return {
            height: bound.height,
            width: bound.width
        };
    },
    getPos(element: Element) {
        const bound = element.getBoundingClientRect();
        return {
            x: bound.x,
            y: bound.y
        };
    },
    getOverlap(el1: HTMLElement, el2: HTMLElement) {
        const rect1 = el1.getBoundingClientRect();
        const rect2 = el2.getBoundingClientRect();
    
        const x_overlap = Math.max(
            0,
            Math.min(rect1.right, rect2.right) - Math.max(rect1.left, rect2.left)
        );
        const y_overlap = Math.max(
            0,
            Math.min(rect1.bottom, rect2.bottom) - Math.max(rect1.top, rect2.top)
        );
    
        const area = x_overlap * y_overlap;
    
        return {
            x_overlap,
            y_overlap,
            area,
            hasCollision: area > 0
        };
    }
}



/**
 * export const fabrickPropsScheme = (type: RegistreTypeComponent, defaultValue: any, typeProps: PropsTypesEditor) => {
    const alightsIcons = {
        left: <FormatAlignLeft />,
        center: <FormatAlignCenter />,
        right: <FormatAlignRight />,
        justify: <FormatAlignJustify />
    }
    const displayIcons = {
        initial: <span style={{ fontSize: '11px', whiteSpace: 'nowrap' }}> init </span>,
        block: <LinearScale />,
        inline: <ViewColumn />,
        'inline-block': <span style={{ fontSize: '11px', whiteSpace: 'nowrap' }}>in -b </span>,
        flex: <Widgets />,
        'inline-flex': <ViewList />,
        grid: <ViewQuilt />,
        'inline-grid': <ViewArray />
    }
    Object.keys(displayIcons).map((key) => {
        displayIcons[key] = (
            <Tooltip title={key} placement="top" arrow >
                { displayIcons[key] }
            </Tooltip>
        )
    });


    if (typeProps === 'children' && typeof defaultValue === 'string') {
        return {
            type: 'text',
            id: typeProps,
            multiline: true,
            value: defaultValue,
            label: typeProps,
            labelSx: { fontSize: '14px' },
            sx: { fontSize: 14 }
        }
    }
    else if (['src', 'alt', 'sizes'].includes(typeProps)) {
        return {
            type: 'text',
            id: typeProps,
            multiline: true,
            value: defaultValue,
            label: typeProps,
            labelSx: { fontSize: '14px' },
            sx: { fontSize: 14 }
        }
    }
    else if (typeProps === 'color') {
        return {
            type: 'toggle',
            id: typeProps,
            items: '',
            label: typeProps,
            value: defaultValue,
            labelSx: { fontSize: '14px' }
        }
    }
    else if (typeProps === 'variant') {
        return {
            type: 'toggle',
            id: typeProps,
            label: typeProps,
            labelSx: { fontSize: '14px' },
            value: defaultValue,
            items: metaProps[type]?.[typeProps]?.map((key) => ({
                id: key,
                label: <span style={{ fontSize: '10px', whiteSpace: 'nowrap' }} >{key}</span>
            }))
        }
    }
    else if (typeProps === 'size') {
        return {
            type: 'toggle',
            id: typeProps,
            items: [
                {
                    id: 'small', label: <var style={{ fontStyle: 'italic' }} > sm </var>
                },
                { id: 'medium', label: <var style={{ fontWeight: 400 }}> md </var> },
                { id: 'large', label: <var style={{ fontWeight: 'bold' }}> lg </var> }
            ],
            label: typeProps,
            value: defaultValue,
            labelSx: { fontSize: '14px' }
        }
    }
    else if (typeProps === 'display' || typeProps === 'labelPosition') {
        return {
            type: 'toggle',
            id: typeProps,
            label: typeProps,
            labelSx: { fontSize: '14px' },
            value: defaultValue,
            items: metaProps[type]?.[typeProps]?.map((key) => ({
                id: key,
                label: displayIcons[key]
            }))
        }
    }
    else if (typeProps === 'align') {
        return {
            type: 'toggle',
            id: typeProps,
            label: typeProps,
            labelSx: { fontSize: '14px' },
            value: defaultValue,
            items: metaProps[type]?.[typeProps]?.map((key) => ({
                id: key,
                label: alightsIcons[key]
            }))
        }
    }
    else if (typeProps === 'fullWidth') {
        return {
            type: 'switch',
            id: typeProps,
            label: typeProps,
            labelSx: { fontSize: '14px' },
            value: defaultValue,
        }
    }
    else if (typeProps === 'type') {
        return {
            type: 'toggle',
            id: typeProps,
            label: typeProps,
            labelSx: { fontSize: '14px' },
            value: defaultValue,
            items: metaProps[type]?.[typeProps]?.map((key) => ({
                id: key,
                label: <span style={{ fontSize: '11px', whiteSpace: 'nowrap' }} > {key} </span>
            }))
        }
    }
    else if (['icon', 'endIcon', 'startIcon', 'leftIcon'].includes(typeProps)) {
        const r = Object.keys(iconsList).map((key) => {
            const Render = iconsList[key];

            return ({
                id: key,
                label: <Render />
            })
        });
        r.unshift({
            id: 'none',
            label: <span style={{ fontSize: '10px', whiteSpace: 'nowrap', color: 'gray' }}>✖️</span>
        });

        return {
            type: 'toggle',
            id: typeProps,
            label: typeProps,
            labelSx: { fontSize: '14px' },
            value: defaultValue,
            items: r

        }
    }
    else if (['min', 'max', 'step'].includes(typeProps)) {
        return {
            type: 'number',
            id: typeProps,
            value: defaultValue,
            label: typeProps,
            labelSx: { fontSize: '14px' },
            sx: { fontSize: 14 }
        }
    }
}
 */
import React from 'react';
import { ContentFromCell, ComponentSerrialize } from '../type';

type Params = {
    component: ContentFromCell,
    data: Record<string, any>,
    cellId: string,
    cellsCache: any,
    setRender: React.Dispatch<React.SetStateAction<any>>,
    rerender?: boolean
}


export function updateComponentProps({component, data, cellId, cellsCache, setRender, rerender = true}: Params) {
    const id = component.props['data-id'];

    // обновляем данные в store
    cellsCache.set((old) => {
        const index = old[cellId]?.findIndex((c) => c.id === id);
        if (index !== -1) {
            Object.entries(data).forEach(([key, value]) => {
                old[cellId][index].props[key] = value;
            });
        }
        return old;
    });

    if (!rerender) return;

    // обновляем рендер
    setRender((layers) => {
        const updated = layers.map((layer) => {
            if (Array.isArray(layer.content)) {
                const i = layer.content.findIndex((c) => c.props['data-id'] === id);
                if (i !== -1) {
                    const updatedComponent = React.cloneElement(component, {
                        ...component.props,
                        ...data
                    });
                    layer.content[i] = updatedComponent;
                }
            }
            return layer;
        });

        return [...updated];
    });
}
/**
 *   const dragableOnStop = (component: Component, cellId: string, data: DraggableData) => {
        const element = document.querySelector(`[data-id="${cellId}"]`);

        if (element) {
            const parentWidth = element.offsetWidth;
            const parentHeight = element.offsetHeight;
            const relativeX = parentWidth > 0 ? data.x / parentWidth : 0;
            const relativeY = parentHeight > 0 ? data.y / parentHeight : 0;
            const propsData = {
                'data-relative-offset': { x: relativeX, y: relativeY },
                'data-offset': { x: data.x, y: data.y }
            }

            updateComponentProps({
                component,
                data: propsData,
                cellId,
                cellsCache,
                setRender,
                rerender: false
            });
        }
    }

 *  <div
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
                        {Array.isArray(layer.content) && layer.content.map((component, index) => (
                            <DraggableElement
                                key={index}
                                cellId={layer.i}
                                component={component}
                                index={index}
                                useStop={(component, data) => dragableOnStop(component, layer.i, data)}
                                useDelete={removeComponentFromCell}
                            />
                        ))}
                    </div>
 */
import React from 'react';
import { Divider, DividerProps } from '@mui/material';
import { ComponentProps } from '../type';
import { deserializeJSX } from '../utils/sanitize';




/**
 * Нужно: SpeedDial
 * Rating в инпуты!
 */
type DividerWrapperProps = DividerProps & ComponentProps;


export const DividerWrapper = React.forwardRef((props: DividerWrapperProps, ref) => {
    const { ['data-id']: dataId, children, fullWidth, ...otherProps } = props;
    const parsedChild = React.useMemo(() => deserializeJSX(children), [children]);


    return (
        <Divider
            ref={ref}
            data-id={dataId}
            data-type='Divider'
            {...otherProps}
        >
            { parsedChild }
        </Divider>
    );
});
import React from 'react';
import { Button, IconButton } from '@mui/material';
import { iconsList } from '../../components/tools/icons';
import { Settings } from '@mui/icons-material';



export const IconButtonWrapper = React.forwardRef((props: any, ref) => {
    const { icon, children, fullWidth, ...otherProps } = props;
    const Icon = icon && iconsList[icon] ? iconsList[icon] : Settings;

    return (
        <IconButton
            ref={ref}
            data-type="IconButton"
            {...otherProps}
        >
            <Icon />
        </IconButton>
    );
});

export const ButtonWrapper = React.forwardRef((props: any, ref) => {
    const { startIcon, endIcon, children, ...otherProps } = props;
    const StartIcon = startIcon && iconsList[startIcon] ? iconsList[startIcon] : null;
    const EndIcon = endIcon && iconsList[endIcon] ? iconsList[endIcon] : null;

    return (
        <Button
            ref={ref}
            data-type="Button"
            variant="outlined"
            startIcon={StartIcon ? <StartIcon /> : undefined}
            endIcon={EndIcon ? <EndIcon /> : undefined}
            {...otherProps}
        >
            { children }
        </Button>
    );
});
import React from 'react';
import { Accordion, AccordionProps } from '../../index';
import { Box, Tabs, Tab, BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { ComponentProps } from '../type';
import { deserializeJSX } from '../utils/sanitize';
import { triggerFlyFromComponent } from './utils/anim';
import { useEvent, useCtxBufer } from './utils/shared';
import { iconsList } from '../../components/tools/icons';
import DataTable, { DataSourceTableProps }  from './sources/table';
import { useComponentSize } from './utils/hooks';


type AccordionWrapperProps = AccordionProps & ComponentProps;
type TableSourcesProps = DataSourceTableProps & ComponentProps;


export const AccordionWrapper = React.forwardRef((props: AccordionWrapperProps, ref) => {
    const { ['data-id']: dataId, style, items, tabStyle, activeIndexs, fullWidth, ...otherProps } = props;
    
    // добавить элементы
    const parse =()=> {
        const maps = {
            Box: Box
        }

        return items.map((item) => ({
            title: deserializeJSX(item.title, maps),
            content: deserializeJSX(item.content, maps),
        }));
    }
    const parsedItems = React.useMemo(() => parse(), [items]);


    return (
        <div
            ref={ref}
            data-id={dataId}
            data-type='Accordion'
            style={{ ...style, width: '100%', display: 'block' }}
            { ...otherProps }
        >
            <Accordion
                activeIndexs={activeIndexs}
                tabStyle={tabStyle}
                items={parsedItems}
            />
        </div>
    );
});

export const TabsWrapper = React.forwardRef((props: any, ref) => {
    const [value, setValue] = React.useState(0);
    const { ['data-id']: dataId, style, items, fullWidth, textColor, indicatorColor, ...otherProps } = props;
    

    const emiter = React.useMemo(() => useEvent(dataId), [dataId]);
    const storage = React.useMemo(() => useCtxBufer(dataId, value), [dataId]);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        emiter('onChange', newValue);
        storage(newValue);
        setValue(newValue);
        triggerFlyFromComponent(String(dataId));
    }
    // добавить элементы
    const parse =()=> {
        const maps = {
            Box: Box
        }

        if(items) return items.map((item) => deserializeJSX(item));
    }
    const parsedItems = React.useMemo(() => parse(), [items]);
    

    return (
        <div
            ref={ref}
            data-id={dataId}
            data-type='Tabs'
            style={{ ...style, width: '100%', display: 'block' }}
            { ...otherProps }
        >
            <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons={true}
                allowScrollButtonsMobile={true}
                textColor={textColor}
                indicatorColor={indicatorColor}
                aria-label="tabs"
            >
                { parsedItems && parsedItems.map((elem, index)=>
                    <Tab
                        key={index}
                        label={elem}
                    />
                )}
            </Tabs>
        </div>
    );
});

// сделать зпкреп снизу, сделать маршрутизацию
// * обеспечивает внутреннюю навигацию
export const BottomNavWrapper = React.forwardRef((props: any, ref) => {
    const [value, setValue] = React.useState(0);
    const { ['data-id']: dataId, style, items, fullWidth, textColor, indicatorColor, ...otherProps } = props;
    

    const emiter = React.useMemo(() => useEvent(dataId), [dataId]);
    const storage = React.useMemo(() => useCtxBufer(dataId, value), [dataId]);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        emiter('onChange', newValue);
        storage(newValue);
        setValue(newValue);
        triggerFlyFromComponent(String(dataId));
    }
    const parse =()=> {
        if(items) return items.map((item) => {
                const label =  deserializeJSX(item.label);
                const Icon = item.icon && iconsList[item.icon] ? iconsList[item.icon] : null;

                return {
                    label: label,
                    icon: Icon
                }
            }
        );
    }
    const parsedItems = React.useMemo(() => parse(), [items]);


    return (
        <Paper
            ref={ref}
            data-id={dataId}
            data-type='BottomNav'
            style={{ ...style, width: '100%', position:'sticky'}}
            { ...otherProps }
        >
            <BottomNavigation 
                value={value} 
                onChange={handleChange}
            >
                { parsedItems && parsedItems.map((elem, index)=>
                    <BottomNavigationAction
                        key={index}
                        label={elem.label}
                        icon={elem.icon ? <elem.icon/> : undefined}
                    />
                )}
            </BottomNavigation>
        </Paper>
    );
});

// пока только текстовые данные. Надо стили
export const DataTableWrapper = React.forwardRef((props: TableSourcesProps, ref) => {
    const { 
        ['data-id']: dataId, 
        style, 
        header,
        footer,
        ...otherProps 
    } = props;
    

    const { width, height } = useComponentSize(dataId);
    const emiter = React.useMemo(() => useEvent(dataId), [dataId]);
    //const storage = React.useMemo(() => useCtxBufer(dataId, value), [dataId]);
    //const parsedItems = React.useMemo(() => deserializeJSX(children), [children]);
    

    return (
        <DataTable
            height={height}
            width={width}
            dataId={dataId}
            onSelect={(data)=> {
                emiter('onSelect', data);
                triggerFlyFromComponent(String(dataId));
            }}
            { ...otherProps }
       />
    );
});
import React from 'react';
import { registerComponent } from './utils/registry';
import { ButtonWrapper, IconButtonWrapper } from './buttons';
import { TypographyWrapper, TextWrapper } from './text';
import { ImageWrapper } from './media';
import { 
    Settings, Description, FlashAuto, ViewList, Check, EditAttributes,
    RadioButtonChecked, LinearScale, EventAvailable, Schedule, Exposure, TextFields, Create, Image,
    ViewCarousel, BackupTable, ListAlt, Repartition, ViewQuilt
 } from '@mui/icons-material';
import { TextInputWrapper, NumberInputWrapper, DateInputWrapper, SliderInputWrapper,
    ToggleInputWrapper, SwitchInputWrapper, CheckBoxInputWrapper, SelectInputWrapper,
    AutoCompleteInputWrapper, FileInputWrapper
} from './inputs';
import { VerticalCarouselWrapper, HorizontalCarouselWrapper, PromoBannerWrapper } from './media';
import { DividerWrapper } from './any';
import { TabsWrapper, BottomNavWrapper, AccordionWrapper, DataTableWrapper } from './complex';
import { DataSourceTableProps } from './sources/table';
import { sharedContext, sharedEmmiter } from './utils/shared';
import { Box } from '@mui/material';
import { serializeJSX } from '../utils/sanitize';
import { InputStyles } from '../type';


/**
 * Приоритет: 
 * * пропс настройки компонентов 
 * * панель проектов 
 * * доработать редактор сетки
 * * 
 */
//////////////////////////////////////////////////////////////////////
globalThis.EDITOR = true;       // мы в контексте редактора
globalThis.sharedContext = sharedContext;
globalThis.sharedEmmiter = sharedEmmiter;
// глобальный список шрифтов
globalThis.FONT_OPTIONS = [
    'inherit',
    'Roboto',
    'Arial',
    'Georgia',
    'Times New Roman',
    'Inter',
    'Montserrat',
];
///////////////////////////////////////////////////////////////////////


registerComponent({
    type: 'Button',
    component: ButtonWrapper,
    defaultProps: {
        children: 'Button',
        variant: 'outlined',
        color: 'primary',
        fullWidth: true,
        startIcon: 'none',
        endIcon: 'none',
        style: {display: 'block'}
    },
    icon: Settings,
    category: 'interactive',
});

registerComponent({
    type: 'Typography',
    component: TypographyWrapper,
    defaultProps: {
        children: 'Заголовок',
        variant: 'h5',
        fullWidth: true,
        style: {
            display: 'flex',  
        }
    },
    icon: TextFields,
    category: 'interactive',
});
registerComponent({
    type: 'Text',
    component: TextWrapper,
    defaultProps: {
        children: '',
        fullWidth: true,
    },
    icon: TextFields,
    category: 'interactive',
});

registerComponent({
    type: 'Image',
    component: ImageWrapper,
    defaultProps: {
        src: 'https://cs5.pikabu.ru/post_img/big/2015/06/04/11/1433446202_1725992411.jpg',
        alt: 'Картинка',
    },
    icon: Image,
    category: 'media',
});

registerComponent({
    type: 'IconButton',
    component: IconButtonWrapper,
    defaultProps: {
        icon: 'Add',
        color: 'default',
    },
    icon: Settings,
    category: 'interactive',
});

// инпуты
registerComponent({
    type: 'TextInput',
    component: TextInputWrapper,
    defaultProps: {
        label: 'label',
        position: 'column',
        placeholder: 'ввод',
        divider: 'none',
        fullWidth: true,
        width: '100%',
        leftIcon: 'none',
        styles: {} satisfies InputStyles,
        labelStyle: {
            fontSize: 14,
        }
    },
    icon: Create,
    category: 'interactive',
});
registerComponent({
    type: 'Number',
    component: NumberInputWrapper,
    defaultProps: {
        label: 'label',
        position: 'column',
        placeholder: 'ввод number',
        fullWidth: true,
        width: '100%',
        styles: {} satisfies InputStyles,
        labelStyle: {
            fontSize: 14,
        }
    },
    icon: Exposure,
    category: 'interactive',
});
registerComponent({
    type: 'Time',
    component: DateInputWrapper,
    defaultProps: {
        label: 'label',
        position: 'column',
        type: 'time',
        fullWidth: true,
        width: '100%',
        styles: {} satisfies InputStyles,
        labelStyle: {
            fontSize: 14,
        }
    },
    icon: Schedule,
    category: 'interactive',
});
registerComponent({
    type: 'Date',
    component: DateInputWrapper,
    defaultProps: {
        label: 'label',
        position: 'column',
        type: 'date',
        fullWidth: true,
        width: '100%',
        styles: {} satisfies InputStyles,
        labelStyle: {
            fontSize: 14,
        }
    },
    icon: EventAvailable,
    category: 'interactive',
});
registerComponent({
    type: 'Slider',
    component: SliderInputWrapper,
    defaultProps: {
        label: 'label',
        position: 'column',
        fullWidth: true,
        width: '100%',
        labelStyle: {
            fontSize: 14,
        }
    },
    icon: LinearScale,
    category: 'interactive',
});
registerComponent({
    type: 'ToggleButtons',
    component: ToggleInputWrapper,
    defaultProps: {
        label: 'label',
        position: 'column',
        fullWidth: true,
        width: '100%',
        items: [
            { id: '1', label: 'test-1' },
            { id: '2', label: 'test-2' },
        ],
        labelStyle: {
            fontSize: 14,
        }
    },
    icon: RadioButtonChecked,
    category: 'interactive',
});
registerComponent({
    type: 'Switch',
    component: SwitchInputWrapper,
    defaultProps: {
        label: 'label',
        position: 'column',
        fullWidth: true,
        width: '100%',
        labelStyle: {
            fontSize: 14,
        }
    },
    icon: EditAttributes,
    category: 'interactive',
});
registerComponent({
    type: 'CheckBox',
    component: CheckBoxInputWrapper,
    defaultProps: {
        label: 'label',
        position: 'column',
        fullWidth: true,
        width: '100%',
        labelStyle: {
            fontSize: 14,
        }
    },
    icon: Check,
    category: 'interactive',
});
registerComponent({
    type: 'Select',
    component: SelectInputWrapper,
    defaultProps: {
        label: 'label',
        position: 'column',
        fullWidth: true,
        width: '100%',
        items: [
            { id: '1', label: 'test-1' },
            { id: '2', label: 'test-2' },
        ],
        labelStyle: {
            fontSize: 14,
        }
    },
    icon: ViewList,
    category: 'interactive',
});
registerComponent({
    type: 'AutoComplete',
    component: AutoCompleteInputWrapper,
    defaultProps: {
        label: 'label',
        position: 'column',
        fullWidth: true,
        width: '100%',
        options: [
            { id: '1', label: 'пики' },
            { id: '2', label: 'стволы' },
        ],
        labelStyle: {
            fontSize: 14,
        }
    },
    icon: FlashAuto,
    category: 'interactive',
});
registerComponent({
    type: 'File',
    component: FileInputWrapper,
    defaultProps: {
        label: 'label',
        position: 'column',
        fullWidth: true,
        width: '100%',
        labelStyle: {
            fontSize: 14,
        }
    },
    icon: Description,
    category: 'interactive',
});

// карусели (донастроить)
registerComponent({
    type: 'VerticalCarousel',
    component: VerticalCarouselWrapper,
    defaultProps: {
        fullWidth: true,
        width: '100%',
        items: [
            <img
                src='https://cs5.pikabu.ru/post_img/big/2015/06/04/11/1433446202_1725992411.jpg'

            />,
            <img style={{ width: '100%', height: 'auto' }} src='https://picsum.photos/600/600' alt="Slide 1" /> ,
            <img style={{ width: '100%', height: 'auto' }} src='https://picsum.photos/300/300' alt="Slide 1" /> 
        ]
    },
    icon: ViewCarousel,
    category: 'media',
});
registerComponent({
    type: 'HorizontCarousel',
    component: HorizontalCarouselWrapper,
    defaultProps: {
        fullWidth: true,
        width: '100%',
        style: {a:1},
        items: [
            <img
                src='https://cs5.pikabu.ru/post_img/big/2015/06/04/11/1433446202_1725992411.jpg'

            />,
            <img style={{ width: '100%', height: 'auto' }} src='https://picsum.photos/600/600' alt="Slide 1" /> ,
            <img style={{ width: '100%', height: 'auto' }} src='https://picsum.photos/300/300' alt="Slide 1" /> 
        ]
    },
    icon: ViewCarousel,
    category: 'media',
});
registerComponent({
    type: 'PromoBanner',
    component: PromoBannerWrapper,
    defaultProps: {
        fullWidth: true,
        width: '100%',
    },
    icon: ViewCarousel,
    category: 'media',
});


// any
registerComponent({
    type: 'Divider',
    component: DividerWrapper,
    defaultProps: {
        fullWidth: true,
        width: '100%',
    },
    icon: LinearScale,
    category: 'misc',
});


// complex
registerComponent({
    type: 'Accordion',
    component: AccordionWrapper,
    defaultProps: {
        fullWidth: true,
        width: '100%',
        activeIndexs: [],
        items: [
            {
                title: serializeJSX(<Box sx={{ml: 1.5}}>・test-1</Box>),
                content: serializeJSX(<Box sx={{m: 3}}>content</Box>)
            },
            {
                title: serializeJSX(<Box sx={{ml: 1.5}}>・test-2</Box>),
                content: serializeJSX(<Box sx={{m: 3}}>content</Box>)
            },
        ]
    },
    icon: ListAlt,
    category: 'complex',
});
registerComponent({
    type: 'Tabs',
    component: TabsWrapper,
    defaultProps: {
        fullWidth: true,
        width: '100%',
        items: [
            'one',
            'two',
            'three',
            'any position'
        ]
    },
    icon: Repartition,
    category: 'complex',
});
registerComponent({
    type: 'BottomNav',
    component: BottomNavWrapper,
    defaultProps: {
        fullWidth: true,
        width: '100%',
        items: [
            {icon: 'Home'},
            {icon: 'Add'},
            {icon: 'Settings'},
            {icon: 'Close'},
            {icon: 'Menu'}
        ]
    },
    icon: Repartition,
    category: 'complex',
});
// data table
registerComponent({
    type: 'DataTable',
    component: DataTableWrapper,
    defaultProps: {
        sourceType: 'google',
        source: '14Jy8ozyC4nmjopCdaCWBZ48eFrJE4BneWuA3CMrHodE',
        refreshInterval: 25000
    } satisfies DataSourceTableProps,
    icon: BackupTable,
    category: 'complex',
});

import React from 'react';
import { TextInput, NumberInput, PasswordInput, LoginInput, 
    DateInput, SliderInput, ToggleInput, SwitchInput, CheckBoxInput,
    SelectInput, AutoCompleteInput, FileInput
} from '../../index';
import { TextInputProps, NumberInputProps } from '../../index';
import { SxProps } from '@mui/material';
import { useEvent, useCtxBufer } from './utils/shared';
import { triggerFlyFromComponent } from './utils/anim';
import { iconsList } from '../../components/tools/icons';


type InputStyles = {
    form?: {
        borderStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset' | 'none'
        borderColor?: string | 'none'
        background?: string | 'none'
    }
    placeholder?: React.CSSProperties
    label?: React.CSSProperties
    icon?: React.CSSProperties
}
type TextWrapperProps = TextInputProps & {
    'data-id': number
    labelStyle?: SxProps
    functions: Record<string, string>,
    leftIcon?: string,
    label?: string,
    position: 'left' | 'right' | 'column'
    width: string | number
    styles?: InputStyles
}


// styles 
export const TextInputWrapper = React.forwardRef((props: TextWrapperProps, ref) => {
    const { 
        children, 
        ['data-id']: dataId, 
        labelStyle,
        functions,
        leftIcon,
        style,
        width,
        fullWidth,
        styles,
        ...otherProps
    } = props;
    
    
    const emiter = React.useMemo(() => useEvent(dataId), [dataId]);
    const storage = React.useMemo(() => useCtxBufer(dataId, otherProps.value), [dataId]);
    const LeftIcon = leftIcon && iconsList[leftIcon] ? iconsList[leftIcon] : null;

    return (
        <div 
            ref={ref}
            data-id={dataId}
            data-type='TextInput'
            style={{...style, width: '100%', display:'block'}}
        >
            <TextInput
                left={LeftIcon ? <LeftIcon/> : null}
                labelSx={labelStyle}
                onChange={(v)=> {
                    emiter('onChange', v);
                    storage(v);
                    if(globalThis.EDITOR) triggerFlyFromComponent(String(dataId));
                }}
                styles={styles}
                {...otherProps}
            />
        </div>
    );
});

export const NumberInputWrapper = React.forwardRef((props: TextWrapperProps, ref) => {
    const { 
        children, 
        ['data-id']: dataId, 
        labelStyle,
        functions,
        startIcon,
        styles,
        style,
        width,
        fullWidth,
        ...otherProps
    } = props;
    
    const emiter = React.useMemo(() => useEvent(dataId), [dataId]);
    const storage = React.useMemo(() => useCtxBufer(dataId, otherProps.value), [dataId]);
    //console.log(style);

    return (
        <div 
            ref={ref}
            data-id={dataId}
            data-type='Number'
            style={{...style, width: '100%', display:'block'}}
        >
            <NumberInput
                labelSx={labelStyle}
                onChange={(v)=> {
                    emiter('onChange', v);
                    storage(v);
                    if(globalThis.EDITOR) triggerFlyFromComponent(String(dataId));
                }}
                styles={styles}
                {...otherProps}
            />
        </div>
    );
});

export const DateInputWrapper = React.forwardRef((props: TextWrapperProps, ref) => {
    const { 
        children, 
        ['data-id']: dataId, 
        labelStyle,
        functions,
        startIcon,
        style,
        width,
        fullWidth,
        ...otherProps
    } = props;
    
    const emiter = React.useMemo(() => useEvent(dataId), [dataId]);
    const storage = React.useMemo(() => useCtxBufer(dataId, otherProps.value), [dataId]);
    

    return (
        <div 
            ref={ref}
            data-id={dataId}
            data-type={props['data-type']}
            style={{...style, width: '100%', display:'block'}}
        >
            <DateInput
                labelSx={labelStyle}
                onChange={(v)=> {
                    emiter('onChange', v);
                    storage(v);
                    if(globalThis.EDITOR) triggerFlyFromComponent(String(dataId));
                }}
                {...otherProps}
            />
        </div>
    );
});

export const SliderInputWrapper = React.forwardRef((props: TextWrapperProps, ref) => {
    const { 
        children, 
        ['data-id']: dataId, 
        labelStyle,
        functions,
        startIcon,
        style,
        width,
        fullWidth,
        ...otherProps
    } = props;
    
    const emiter = React.useMemo(() => useEvent(dataId), [dataId]);
    const storage = React.useMemo(() => useCtxBufer(dataId, otherProps.value), [dataId]);
    //console.log(style);

    return (
        <div 
            ref={ref}
            data-id={dataId}
            data-type='Slider'
            style={{...style, width: '100%', display:'block', marginLeft:'35px'}}
        >
            <SliderInput
                labelSx={labelStyle}
                onChange={(v)=> {
                    emiter('onChange', v);
                    storage(v);
                    if(globalThis.EDITOR) triggerFlyFromComponent(String(dataId));
                }}
                {...otherProps}
            />
        </div>
    );
});

export const CheckBoxInputWrapper = React.forwardRef((props: TextWrapperProps, ref) => {
    const [state, setState] = React.useState(false);
    const { 
        children, 
        ['data-id']: dataId, 
        labelStyle,
        functions,
        startIcon,
        style,
        width,
        fullWidth,
        ...otherProps
    } = props;
    
    const emiter = React.useMemo(() => useEvent(dataId), [dataId]);
    const storage = React.useMemo(() => useCtxBufer(dataId, otherProps.value), [dataId]);
    

    return (
        <div 
            ref={ref}
            data-id={dataId}
            data-type='CheckBox'
            style={{...style, width: '100%', display:'block', marginLeft:'35px'}}
        >
            <CheckBoxInput
                value={state}
                labelSx={labelStyle}
                onChange={(v)=> {
                    emiter('onChange', v);
                    storage(v);
                    if(globalThis.EDITOR) triggerFlyFromComponent(String(dataId));
                }}
                {...otherProps}
            />
        </div>
    );
});

export const SwitchInputWrapper = React.forwardRef((props: TextWrapperProps, ref) => {
    const { 
        children, 
        ['data-id']: dataId, 
        labelStyle,
        functions,
        startIcon,
        style,
        width,
        fullWidth,
        ...otherProps
    } = props;
    
    const emiter = React.useMemo(() => useEvent(dataId), [dataId]);
    const storage = React.useMemo(() => useCtxBufer(dataId, otherProps.value), [dataId]);

    return (
        <div 
            ref={ref}
            data-id={dataId}
            data-type='Switch'
            style={{...style, width: '100%', display:'block', marginLeft:'35px'}}
        >
            <SwitchInput
                labelSx={labelStyle}
                onChange={(v)=> {
                    emiter('onChange', v);
                    storage(v);
                    if(globalThis.EDITOR) triggerFlyFromComponent(String(dataId));
                }}
                {...otherProps}
            />
        </div>
    );
});

export const ToggleInputWrapper = React.forwardRef((props: TextWrapperProps, ref) => {
    const { 
        children, 
        ['data-id']: dataId, 
        labelStyle,
        functions,
        startIcon,
        style,
        width,
        fullWidth,
        ...otherProps
    } = props;
    
    const emiter = React.useMemo(() => useEvent(dataId), [dataId]);
    const storage = React.useMemo(() => useCtxBufer(dataId, otherProps.value), [dataId]);

    return (
        <div 
            ref={ref}
            data-id={dataId}
            data-type='ToggleButtons'
            style={{...style, width: '100%', display:'block', marginLeft:'35px'}}
        >
            <ToggleInput
                labelSx={labelStyle}
                onChange={(v)=> {
                    emiter('onChange', v);
                    storage(v);
                    if(globalThis.EDITOR) triggerFlyFromComponent(String(dataId));
                }}
                {...otherProps}
            />
        </div>
    );
});

export const SelectInputWrapper = React.forwardRef((props: TextWrapperProps, ref) => {
    const { 
        children, 
        ['data-id']: dataId, 
        labelStyle,
        functions,
        startIcon,
        style,
        styles,
        width,
        fullWidth,
        ...otherProps
    } = props;
    
    const emiter = React.useMemo(() => useEvent(dataId), [dataId]);
    const storage = React.useMemo(() => useCtxBufer(dataId, otherProps.value), [dataId]);

    return (
        <div 
            ref={ref}
            data-id={dataId}
            data-type='Select'
            style={{...style, width: '100%', display:'block'}}
        >
            <SelectInput
                labelSx={labelStyle}
                onChange={(v)=> {
                    emiter('onChange', v);
                    storage(v);
                    if(globalThis.EDITOR) triggerFlyFromComponent(String(dataId));
                }}
                styles={styles}
                {...otherProps}
            />
        </div>
    );
});

export const AutoCompleteInputWrapper = React.forwardRef((props: TextWrapperProps, ref) => {
    const { 
        children, 
        ['data-id']: dataId, 
        labelStyle,
        functions,
        startIcon,
        style,
        styles,
        width,
        fullWidth,
        ...otherProps
    } = props;
    
    const emiter = React.useMemo(() => useEvent(dataId), [dataId]);
    const storage = React.useMemo(() => useCtxBufer(dataId, otherProps.value), [dataId]);

    return (
        <div 
            ref={ref}
            data-id={dataId}
            data-type='AutoComplete'
            style={{...style, width: '100%', display:'block'}}
        >
            <AutoCompleteInput
                labelSx={labelStyle}
                styles={styles}
                placeholder='выбери из двух стульев'
                onChange={(v)=> {
                    emiter('onChange', v);
                    storage(v);
                    if(globalThis.EDITOR) triggerFlyFromComponent(String(dataId));
                }}
                {...otherProps}
            />
        </div>
    );
});

export const FileInputWrapper = React.forwardRef((props: TextWrapperProps, ref) => {
    const { 
        children, 
        ['data-id']: dataId, 
        labelStyle,
        functions,
        startIcon,
        styles,
        style,
        width,
        fullWidth,
        ...otherProps
    } = props;
    
    const emiter = React.useMemo(() => useEvent(dataId), [dataId]);
    const storage = React.useMemo(() => useCtxBufer(dataId, otherProps.value), [dataId]);

    return (
        <div 
            ref={ref}
            data-id={dataId}
            data-type='File'
            style={{...style, width: '100%', display:'block'}}
        >
            <FileInput
                labelSx={labelStyle}
                onUpload={(v)=> {
                    emiter('onChange', v);
                    storage(v);
                    if(globalThis.EDITOR) triggerFlyFromComponent(String(dataId));
                }}
                styles={styles}
                {...otherProps}
            />
        </div>
    );
});
import React from 'react';
import Imgix from 'react-imgix';
import { useComponentSize } from './utils/hooks';
import { VerticalCarousel, HorizontalCarousel, PromoBanner } from '../../index';
import Tollbar, { useToolbar } from './utils/Toolbar';
import { Settings } from '@mui/icons-material';


export const ImageWrapper = React.forwardRef((props: any, ref) => {
    const {
        src,
        alt = '',
        imgixParams = {},
        sizes = '100vw',
        objectFit = 'cover',
        style = {},
        ...otherProps
    } = props;

    const componentId = props['data-id'];
    const { width, height } = useComponentSize(componentId);

    const f = () => {
        if (!src || src.length === 0) return 'https://cs5.pikabu.ru/post_img/big/2015/06/04/11/1433446202_1725992411.jpg';
        else return src;
    }
    const combinedStyle = {
        width,
        //height: height-8,
        objectFit,
        display: 'block',
        ...style,
    };
    

    return (
        <Imgix
            //ref={ref}
            data-id={componentId}
            data-type="Image"
            src={f()}
            sizes={sizes}
            imgixParams={imgixParams}
            htmlAttributes={{
                width : width, 
                height : height - 8
            }}
        />
    );
});


export const VerticalCarouselWrapper = React.forwardRef((props: any, ref) => {
    const {
        items,
        style = {}, 
        autoplay = true,
        slidesToShow = 3,
        ...otherProps
    } = props;

    const componentId = props['data-id'];
    const { width, height } = useComponentSize(componentId);
   
    const createImgx = (src: string) => {
        return(
            <Imgix
                data-type="Image"
                src={src ?? 'https://cs5.pikabu.ru/post_img/big/2015/06/04/11/1433446202_1725992411.jpg'}
                sizes={'100vw'}
                imgixParams={{}}
                htmlAttributes={{
                    width: width,
                    height: (height / slidesToShow)
                }}
            />
        );
    }
    // дегидратор
    const parseItems = () => {
        const result = [];

        items.map((elem, index)=> {
            if(elem.type === 'img') {
                if(elem.props.src) result.push(
                    createImgx(elem.props.src)
                );
            }
        });

        return result;
    }

    return (
        <div
            ref={ref}
            data-type="VerticalCarousel"
            data-id={componentId}
            style={{
                width,
                display: 'block',
                height: '100%',
                overflow: 'hidden',
            }}
            {...otherProps}
        >
            <VerticalCarousel
                items={parseItems() ?? []}
                height={height}
                settings={{
                    autoplay,
                    slidesToShow
                }}
            />
        </div>
    );
});

// todo: сделать умный расчет по умолчанию сколько слайдов выводить
export const HorizontalCarouselWrapper = React.forwardRef((props: any, ref) => {
    const {
        items,
        fullWidth,
        autoplay = true,
        slidesToShow = 3,
        style = {}, 
        ...otherProps
    } = props;

    const componentId = props['data-id'];
    const { visible, context } = useToolbar(componentId);
    const { width, height } = useComponentSize(componentId);

    const createImgx = (src: string) => {
        return(
            <Imgix
                data-type="Image"
                src={src ?? 'https://cs5.pikabu.ru/post_img/big/2015/06/04/11/1433446202_1725992411.jpg'}
                sizes={'100vw'}
                imgixParams={{}}
                htmlAttributes={{
                    width: width,
                    height: height
                }}
            />
        );
    }
    // дегидратор
    const parseItems = () => {
        const result = [];

        items.map((elem, index)=> {
            if(elem.type === 'img') {
                if(elem.props.src) result.push(
                    createImgx(elem.props.src)
                );
            }
        });

        return result;
    }
    

    return (
        <div
            ref={ref}
            data-type="HorizontCarousel"
            data-id={componentId}
            style={{
                width,
                display: 'block',
                overflow: 'hidden',
                position: 'relative',
            }}
            {...otherProps}
        >
            <Tollbar 
                visible={visible}
                offsetY={0}
                options={[
                    { icon: <Settings/>,  },
                ]}
            />
            <HorizontalCarousel
                items={parseItems() ?? []}
                height={height-8}
                settings={{
                    autoplay,
                    slidesToShow
                }}
            />
        </div>
    );
});

export const PromoBannerWrapper = React.forwardRef((props: any, ref) => {
    const {
        items,
        fullWidth,
        style = {}, 
        ...otherProps
    } = props;

    const componentId = props['data-id'];
    const { visible, context } = useToolbar(componentId);
    const { width, height } = useComponentSize(componentId);
    

    return (
        <div
            ref={ref}
            data-type="PromoBanner"
            data-id={componentId}
            style={{
                display: 'block',
                overflow: 'hidden',
                position: 'relative'
            }}
            { ...otherProps }
        >
            <Tollbar 
                visible={visible}
                offsetY={0}
                options={[
                    { icon: <Settings/>,  },
                ]}
            />
            <PromoBanner
                items={items}
                style={style}
            />
        </div>
    );
});
import React, { useMemo, useCallback } from 'react';
import { Typography, Select, MenuItem, Divider } from '@mui/material';
import { createEditor, Descendant, Editor, Transforms, Element as SlateElement, Range } from 'slate';
import { Slate, Editable, withReact, useSlate } from 'slate-react';
import { withHistory } from 'slate-history';
import { useHookstate } from '@hookstate/core';
import { updateComponentProps } from '../utils/updateComponentProps';
import context, { infoState } from '../context'
import { Popover, IconButton, Stack, Tooltip, Box } from '@mui/material';
import { FormatBold, FormatItalic, FormatUnderlined, Title, FormatListBulleted, FormatListNumbered, 
    FormatQuote, FormatColorText, FormatColorFill, InsertLink, FormatAlignLeft, FormatAlignCenter, 
    FormatAlignRight, FormatAlignJustify
} from '@mui/icons-material';
import { RgbaColorPicker } from 'react-colorful';
import { useDebounced } from 'src/components/hooks/debounce';
import { withResetOnRightClick } from './utils/hooks';


const LIST_TYPES = ['numbered-list', 'bulleted-list'];
const fallbackValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
];

function renderInline(inlines: any[]): React.ReactNode {
    return inlines.map((leaf, i) => {
        let el: React.ReactNode = leaf.text;

        if (leaf.bold) el = <strong key={i}>{el}</strong>;
        if (leaf.italic) el = <em key={i}>{el}</em>;
        if (leaf.underline) el = <u key={i}>{el}</u>;
        if (leaf.color) el = <span key={i} style={{ color: leaf.color }}>{el}</span>;
        if (leaf.bgcolor) el = <span key={i} style={{ backgroundColor: leaf.bgcolor }}>{el}</span>;
        if (leaf.link?.href) {
            el = <a key={i} style={{ color: leaf.color }} href={leaf.link.href} target="_blank" rel="noopener noreferrer">{el}</a>;
        }
        if (leaf.fontFamily) {
            el = <span key={i} style={{ fontFamily: leaf.fontFamily }}>{el}</span>;
        }
        if (leaf.textAlign) {
            el = <span key={i} style={{ display: 'block', textAlign: leaf.textAlign }}>{el}</span>;
        }

        return <React.Fragment key={i}>{el}</React.Fragment>;
    });
}
function renderSlateContent(blocks: Descendant[]): React.ReactNode {
    return blocks.map((block, i) => {
        if (!block) return null;

        const key = `block-${i}`;
        const children = renderInline(block.children ?? []);

        switch (block.type) {
            case 'heading-one':
                return <h2 key={key}>{children}</h2>;
            case 'bulleted-list':
                return <ul key={key}>{block.children.map((li, j) => <li key={j}>{renderInline(li.children)}</li>)}</ul>;
            case 'numbered-list':
                return <ol key={key}>{block.children.map((li, j) => <li key={j}>{renderInline(li.children)}</li>)}</ol>;
            case 'blockquote':
                return <blockquote key={key}>{children}</blockquote>;
            default:
                return <p key={key}>{children}</p>;
        }
    });
}
const AlignToggleButton = () => {
    const editor = useSlate();
    const ALIGN_MODES = ['left', 'center', 'right', 'justify'] as const;
    const ALIGN_ICONS = {
        left: FormatAlignLeft,
        center: FormatAlignCenter,
        right: FormatAlignRight,
        justify: FormatAlignJustify
    }

    const getCurrentAlign = (): typeof ALIGN_MODES[number] => {
        const marks = Editor.marks(editor);
        return marks?.textAlign ?? 'left';
    }
    const handleToggleAlign = () => {
        const current = getCurrentAlign();
        const index = ALIGN_MODES.indexOf(current);
        const next = ALIGN_MODES[(index + 1) % ALIGN_MODES.length];
        Editor.addMark(editor, 'textAlign', next);
    }

    const CurrentIcon = ALIGN_ICONS[getCurrentAlign()];


    return (
        <Tooltip title="Выравнивание текста">
            <IconButton size="small" onClick={handleToggleAlign}>
                <CurrentIcon sx={{ fontSize: 16 }} />
            </IconButton>
        </Tooltip>
    );
}

const Toolbar = () => {
    const editor = useSlate();
    const [anchorText, setAnchorText] = React.useState<HTMLElement | null>(null);
    const [anchorBg, setAnchorBg] = React.useState<HTMLElement | null>(null);
    const [colorText, setColorText] = React.useState<string>(null);
    const [colorBg, setColorBg] = React.useState<string>(null);


    const handleFontChange = (font: string) => {
        Editor.addMark(editor, 'fontFamily', font);
    }
    const toggleMark = (format: string) => {
        const isActive = isMarkActive(editor, format);
        if (isActive) {
            Editor.removeMark(editor, format);
        } 
        else {
            Editor.addMark(editor, format, true);
        }
    }
    const toggleBlock = (format: string) => {
        const isList = LIST_TYPES.includes(format);
        const isActive = isBlockActive(editor, format);

        Transforms.unwrapNodes(editor, {
            match: n =>
                !Editor.isEditor(n) &&
                SlateElement.isElement(n) &&
                LIST_TYPES.includes(n.type as string),
            split: true,
        });

        if (isList) {
            if (!isActive) {
                Transforms.setNodes(editor, { type: 'list-item' });
                Transforms.wrapNodes(editor, {
                    type: format,
                    children: [],
                });
            } else {
                Transforms.setNodes(editor, { type: 'paragraph' });
            }
        } else {
            Transforms.setNodes(editor, {
                type: isActive ? 'paragraph' : format,
            });
        }
    }
    const isMarkActive = (editor: Editor, format: string) => {
        const marks = Editor.marks(editor);
        return marks ? marks[format] === true : false;
    }
    const isBlockActive = (editor: Editor, format: string) => {
        const [match] = Array.from(
            Editor.nodes(editor, {
                match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
            })
        );
        return !!match;
    }
    const handleColorChange = (color: { r: number, g: number, b: number, a: number }) => {
        const rgba = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
        setColorText(rgba);
        Editor.addMark(editor, 'color', rgba);
    }
    const handleBgChange = (color: { r: number, g: number, b: number, a: number }) => {
        const rgba = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
        setColorBg(rgba);
        Editor.addMark(editor, 'bgcolor', rgba);
    }


    return (
        <Box 
            sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 0.5, 
                border: '1px solid #d0d0d02d',
                py: 1,
                borderRadius: 1,
                background: '#0d0c0c40'
            }}
            onPointerEnter={() => context.dragEnabled.set(false)}
            onPointerLeave={() => context.dragEnabled.set(true)}
        >
            {/* Первая строка: базовые стили */}
            <Stack
                direction="row"
                spacing={0.5}
                sx={{
                    pb: 0.5,
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    maxWidth: '100%',
                    whiteSpace: 'nowrap',
                }}
            >
                <Tooltip title="Заголовок H4">
                    <IconButton size="small" onClick={() => toggleBlock('heading-one')}>
                        <Title sx={{ fontSize: 16 }} />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Жирный">
                    <IconButton size="small" onClick={() => toggleMark('bold')}>
                        <FormatBold sx={{ fontSize: 16 }} />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Курсив">
                    <IconButton size="small" onClick={() => toggleMark('italic')}>
                        <FormatItalic sx={{ fontSize: 16 }} />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Подчёркнутый">
                    <IconButton 
                        size="small" 
                        onClick={() => toggleMark('underline')}
                    >
                        <FormatUnderlined sx={{ fontSize: 16 }} />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Ссылка">
                    <IconButton style={{marginRight:'5px'}} size="small" 
                        onClick={() => {
                            const href = prompt('Вставьте ссылку:');
                            if (!href) return;

                            const { selection } = editor;
                            if (!selection || Range.isCollapsed(selection)) {
                                alert('Сначала выдели текст!');
                                return;
                            }

                            Editor.addMark(editor, 'link', { href });
                        }}
                        {...withResetOnRightClick((e) => setAnchorBg(e.currentTarget), editor, 'link')}
                    >
                        <InsertLink sx={{ fontSize: 16 }} />
                    </IconButton>
                </Tooltip>

                <Divider orientation="vertical" flexItem/>
                <AlignToggleButton />

                <Tooltip style={{marginLeft:'auto'}} title="Цвет текста">
                    <IconButton 
                        size="small" 
                        onClick={(e) => setAnchorText(e.currentTarget)}
                        {...withResetOnRightClick((e) => setAnchorText(e.currentTarget), editor, 'color')}
                        sx={{ color: colorText || 'inherit' }}
                    >
                        <FormatColorText sx={{ fontSize: 16 }} />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Фон текста">
                    <IconButton 
                        size="small" 
                        onClick={(e) => setAnchorBg(e.currentTarget)}
                        {...withResetOnRightClick((e) => setAnchorBg(e.currentTarget), editor, 'bgcolor')}
                        sx={{ color: colorBg || 'inherit' }}
                    >
                        <FormatColorFill sx={{ fontSize: 16 }} />
                    </IconButton>
                </Tooltip>
            </Stack>

            {/* Вторая строка: структура и блоки */}
            <Stack
                direction="row"
                spacing={0.5}
                sx={{
                    pt: 0.6,
                    borderTop: '1px dotted #d0cdcd29',
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    maxWidth: '100%',
                    whiteSpace: 'nowrap',
                }}
            >
                <Tooltip title="Маркированный список">
                    <IconButton size="small" onClick={() => toggleBlock('bulleted-list')}>
                        <FormatListBulleted sx={{ fontSize: 16 }} />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Нумерованный список">
                    <IconButton size="small" onClick={() => toggleBlock('numbered-list')}>
                        <FormatListNumbered sx={{ fontSize: 16 }} />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Цитата">
                    <IconButton size="small" onClick={() => toggleBlock('blockquote')}>
                        <FormatQuote sx={{ fontSize: 16 }} />
                    </IconButton>
                </Tooltip>
                <Select style={{marginLeft:'auto', marginRight:'5px'}}
                    size="small"
                    value=""
                    onChange={(e) => handleFontChange(e.target.value)}
                    displayEmpty
                    sx={{ fontSize: 10, height: 30, color: '#ccc', background: '#2a2a2a'}}
                >
                    <MenuItem value="" disabled>𝓣</MenuItem>
                    { globalThis.FONT_OPTIONS.map((font) => (
                        <MenuItem key={font} value={font} style={{ fontFamily: font }}>
                            {font}
                        </MenuItem>
                    ))}
                </Select>
            </Stack>

            <Popover
                open={Boolean(anchorText)}
                anchorEl={anchorText}
                onClose={() => setAnchorText(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Box sx={{ p: 2 }}>
                    <RgbaColorPicker onChange={handleColorChange} />
                </Box>
            </Popover>

            <Popover
                open={Boolean(anchorBg)}
                anchorEl={anchorBg}
                onClose={() => setAnchorBg(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Box sx={{ p: 2 }}>
                    <RgbaColorPicker onChange={handleBgChange} />
                </Box>
            </Popover>
        </Box>
    );
}



// ! не сохраняются изменения стилей
export const TextWrapper = React.forwardRef((props: any, ref) => {
    const editor = useMemo(() => withHistory(withReact(createEditor())), []);
    const [isEditing, setIsEditing] = React.useState(false);
    const { children, ['data-id']: dataId, ...otherProps } = props;
    const selected = useHookstate(infoState.select);

    const [value, setValue] = React.useState<Descendant[]>(() => {
        if (Array.isArray(props.childrenSlate)) return props.childrenSlate;
        if (typeof props.children === 'string') {
            return [{
            type: 'paragraph',
            children: [{ text: props.children }],
            }];
        }
        return fallbackValue;
    });

    const extractPlainText =(nodes: Descendant[]): string => {
        return nodes.map(node => {
            if ('text' in node) return node.text;
            if ('children' in node) return extractPlainText(node.children);
            return '';
        }).join('\n');
    }
    const debouncedUpdate = useDebounced((val: Descendant[]) => {
        const text = extractPlainText(val);
        const component = selected.content.get({ noproxy: true });

        if (component) {
            updateComponentProps({
                component,
                data: {
                    children: text,
                    childrenSlate: val
                },
            });
        }
    }, 400, [selected.content]);
    const renderLeaf = useCallback(({ attributes, children, leaf }) => {
        const style: React.CSSProperties = {};
        if (leaf.color) style.color = leaf.color;
        if (leaf.bgcolor) style.backgroundColor = leaf.bgcolor;

        if (leaf.bold) children = <strong>{children}</strong>;
        if (leaf.italic) children = <em>{children}</em>;
        if (leaf.underline) children = <u>{children}</u>;
        if (leaf.link?.href) {
            children = <a style={style} href={leaf.link.href} target="_blank" rel="noopener noreferrer">{children}</a>;
        }
        if (leaf.fontFamily) style.fontFamily = leaf.fontFamily;
        if (leaf.textAlign) {
            style.display = 'block';
            style.textAlign = leaf.textAlign;
        }

        return <span {...attributes} style={style}>{children}</span>;
    }, []);
    const renderElement = useCallback(({ attributes, children, element }) => {
        switch (element.type) {
            case 'heading-one':
                return <h4 {...attributes}>{children}</h4>;
            case 'bulleted-list':
                return <ul {...attributes}>{children}</ul>;
            case 'numbered-list':
                return <ol {...attributes}>{children}</ol>;
            case 'list-item':
                return <li {...attributes}>{children}</li>;
            case 'blockquote':
                return <blockquote {...attributes}>{children}</blockquote>;
            default:
                return <p {...attributes}>{children}</p>;
        }
    }, []);


    return(
        <div 
            data-id={dataId} 
            data-type="Text" 
            style={{ width: '100%' }}
        >
            { globalThis.EDITOR ? (
                <Slate 
                    editor={editor} 
                    initialValue={value} 
                    onChange={(val) => {
                        setValue(val);
                        debouncedUpdate(val);
                    }}
                >
                    { selected.content.get({noproxy:true})?.props?.['data-id'] === dataId && (
                        <Toolbar />
                    )}
                    <Editable
                        readOnly={!globalThis.EDITOR}
                        renderLeaf={renderLeaf}
                        renderElement={renderElement}
                        placeholder="Введите текст..."
                        onPointerEnter={() => context.dragEnabled.set(false)}
                        onPointerLeave={() => context.dragEnabled.set(true)}
                        spellCheck
                        autoFocus
                        onFocus={() => {
                            setIsEditing(true);
                            context.dragEnabled.set(false); // отключаем drag при редактировании
                        }}
                        onBlur={() => {
                            setIsEditing(false);
                            context.dragEnabled.set(true); // возвращаем drag после редактирования
                        }}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                const { selection } = editor;
                                if (!selection || !Range.isCollapsed(selection)) return;

                                const [match] = Editor.nodes(editor, {
                                    match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'list-item',
                                });

                                if (match) {
                                    event.preventDefault();
                                    const [node] = match;

                                    const isEmpty = Editor.isEmpty(editor, node);

                                    if (isEmpty) {
                                        // ВЫХОД ИЗ СПИСКА
                                        Transforms.setNodes(editor, { type: 'paragraph' });

                                        Transforms.unwrapNodes(editor, {
                                            match: n =>
                                                !Editor.isEditor(n) &&
                                                SlateElement.isElement(n) &&
                                                ['bulleted-list', 'numbered-list'].includes(n.type),
                                            split: true,
                                        });
                                    } else {
                                        // НОВЫЙ <li>
                                        Transforms.insertNodes(editor, {
                                            type: 'list-item',
                                            children: [{ text: '' }],
                                        });
                                    }
                                }
                            }
                        }}
                        style={{
                            outline: 'none',
                            padding: '4px 8px',
                            borderRadius: 4,
                            transition: 'box-shadow 0.2s ease',
                            boxShadow: isEditing ? '0 0 0 1px #1976d2' : 'none',
                            backgroundColor: 'transparent',
                            minHeight: 30,
                        }}
                    />
                </Slate>
            ) : (
                <>
                    { props.childrenSlate
                        ? renderSlateContent(props.childrenSlate)
                        : <p>{props.children}</p>
                    }
                </>
        )   }
        </div>
    );
});


export const TypographyWrapper = React.forwardRef((props: any, ref) => {
    const { children, ['data-id']: dataId, ...otherProps } = props;

    
    return(
        <Typography 
            ref={ref} 
            data-type="Typography" 
            {...otherProps}
        >
            { children }
        </Typography>
    );
});
import React from 'react';
import { componentMap, componentDefaults } from '../modules/utils/registry';



export function createComponentFromRegistry(type: string): React.ReactNode {
    const Component = componentMap[type];
    const props = { ...componentDefaults[type] };
  
    const id = Date.now();
    props['data-id'] = id;
    props['data-type'] = type;
  
    return <Component {...props} />;
}
import { renderState, cellsContent } from '../context';
import { Component } from '../type';
import { State } from '@hookstate/core';


export function getComponentById(id: number): Component | undefined {
    let result;

    renderState.get({ noproxy: true }).forEach((layer) => {
        const find = layer.content.find((elem)=> elem.props['data-id'] === id);
        if(find) result = find;
    });
    
    return result;
}
import { writeFile } from '../../app/plugins';
import { cellsContent, renderState } from '../context';


export const generateJSX = (type: string, propsRaw: Record<string, any> = {}, indent = 2): string => {
    const props = propsRaw || {};
    const spaces = ' '.repeat(indent);
    const attrs = Object.entries(props)
        .filter(([key]) => key !== 'children')
        .map(([key, value]) => {
            if (typeof value === 'string') return `${key}="${value}"`;
            if (typeof value === 'boolean' || typeof value === 'number') return `${key}={${value}}`;
            if (typeof value === 'object') return `${key}={${JSON.stringify(value)}}`;
            return '';
        })
        .join(' ');

    const children = props.children;
    const hasChildren = !!children && (Array.isArray(children) ? children.length > 0 : true);

    if (!hasChildren) {
        return `${spaces}<${type} ${attrs} />`;
    }

    const childrenCode = Array.isArray(children)
        ? children.map(child =>
            typeof child === 'object' && child?.props
                ? generateJSX(child.type?.name || 'div', child.props, indent + 2)
                : `${' '.repeat(indent + 2)}${child}`
        ).join('\n')
        : typeof children === 'object' && children?.props
            ? generateJSX(children.type?.name || 'div', children.props, indent + 2)
            : `${' '.repeat(indent + 2)}${children}`;

    return `${spaces}<${type} ${attrs}>
${childrenCode}
${spaces}</${type}>`;
};

export const exportAsJSX = async (name: string) => {
  const layout = renderState.get({ noproxy: true });
  const cells = cellsContent.get({ noproxy: true });

  const renderedBlocks = layout.map(cell => {
    const comps = cells[cell.i] ?? [];
    const children = comps.map(c =>
      generateJSX(c.props?.['data-type'] || 'div', c.props || {})
    ).join('\n');

    return `  <div data-id="${cell.i}">\n${children}\n  </div>`;
  });

  const output = `import React from 'react';

export default function Page() {
  return (
    <div>
${renderedBlocks.join('\n\n')}
    </div>
  );
}`;

  await writeFile('/exports/jsx', `${name}.tsx`, output);
};
import { Settings } from '@mui/icons-material';
import { Box } from '@mui/material';
import React from 'react';


export function sanitizeProps<T extends Record<string, any>>(props: T): T {
    return JSON.parse(
        JSON.stringify(props, (key, value) => {
            if (typeof value === 'function') return undefined;
            if (typeof value === 'symbol') return undefined;
            if (React.isValidElement(value)) return undefined;
            return value;
        })
    );
}


export function serializeJSX(node: any): any {
    const pType =(type: string | undefined)=> {
        if(type) return type.replace(/[0-9]/g, "");
    }
    const getName =()=> {
        const dataType = node.props['data-type'];
        const typeName = pType(node?.type?.name);
        const renederName = pType(node?.type?.render?.name);
        const displayName = pType(node?.type?.displayName);

        return (dataType ?? ((displayName ?? (typeName ?? renederName))) ?? 'Anonymous');
    }
    
    
    const deepSerialize = (value: any): any => {
        if (React.isValidElement(value)) {
            return serializeJSX(value);
        }
        if (Array.isArray(value)) {
            return value.map(deepSerialize);
        }
        if (typeof value === 'object' && value !== null) {
            const result: Record<string, any> = {};

            for (const [k, v] of Object.entries(value)) {
                result[k] = deepSerialize(v);
            }
            return result;
        }
        return value;
    }

    if (React.isValidElement(node)) {
        const type = typeof node.type === 'string' ? node.type : getName();
        const rawProps = { ...node.props };
        const props = deepSerialize(rawProps); // 👈 сериализуем все поля

        return {
            $$jsx: true,
            type,
            props
        };
    } 
    else if (
        typeof node === 'string' ||
        typeof node === 'number' ||
        node === null
    ) {
        return node;
    }

    return node;
}
export function deserializeJSX(node: any, maps?: Record<string, any>): any {
    if (node === null || typeof node === 'string' || typeof node === 'number') {
        return node;
    }

    if (typeof node === 'object' && node.$$jsx) {
        const { type, props } = node;
        const resolvedProps = { ...props };
       
        const getType =()=> {
            if(maps && maps[type]) return maps[type];
            else if(!maps) return type;
            else {
                console.warn('🚨 type компонента не найден в переданной карте!!');
                return type;
            }
        }

        if (props.children) {
            if (Array.isArray(props.children)) {
                resolvedProps.children = props.children.map(child => deserializeJSX(child, maps));
            } 
            else {
                resolvedProps.children = deserializeJSX(props.children, maps);
            }
        }
        
        return React.createElement(getType(), resolvedProps);
    }

    return node;
}

import React from 'react';
import { Component, ComponentSerrialize } from '../type';
import context, { cellsContent, infoState, renderState } from '../context';

type Params = {
    component: Component;
    data: Record<string, any>;
    rerender?: boolean;
}


/** Запись свойств в  */
export function updateComponentProps({ component, data, rerender = true }: Params) {
    const id = component?.props?.['data-id'];
    const cellId = context.currentCell.get()?.i;
    
    if (!id || !cellId) {
        console.warn('updateComponentProps: отсутствует data-id или data-cell');
        return;
    }

    // 🧠 Обновляем данные в hookstate-кэше
    cellsContent.set((old) => {
        const index = old[cellId]?.findIndex((c) => c.id === id);
        if (index !== -1) {
            Object.entries(data).forEach(([key, value]) => {
                old[cellId][index].props[key] = value;
            });
        }
        return old;
    });

    // 🔁 Обновляем визуальный рендер через context.render
    if (rerender) renderState.set((layers) => {
        console.log('update props: ', component, data)
        const updated = layers.map((layer) => {
            if (!Array.isArray(layer.content)) return layer;

            const i = layer.content.findIndex((c) => c?.props?.['data-id'] === id);
            if (i === -1) return layer;

            const current = layer.content[i];
            if (!current) {
                console.warn('updateComponentProps: компонент не найден в render');
                return layer;
            }

            try {
                const updatedComponent = React.cloneElement(current, {
                    ...current.props,
                    ...data,
                });

                infoState.select.content.set(updatedComponent);         // fix
                layer.content[i] = updatedComponent;
            } catch (e) {
                console.error('❌ Ошибка при клонировании компонента:', e, current);
            }

            return layer;
        });

        return [...updated];
    });
}
import React, { useRef } from 'react';
import { IconButton, Paper, Typography } from '@mui/material';
import { useDroppable, DndContext, useSensors, useSensor, PointerSensor, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { arrayMove } from '@dnd-kit/sortable';
import { useHookstate } from '@hookstate/core';
import { infoState, renderState } from '../../context';
import { SortableItem } from '../../Sortable';
import { useParentCellSize } from '../utils/hooks';
import { deserializeJSX } from '../../utils/sanitize';
import { componentMap } from '../utils/registry';
import context, { cellsContent } from '../../context';
import { Delete } from '@mui/icons-material';
import { createPortal } from 'react-dom';
const iconRoot = document.getElementById('editor-delete-root'); 

export type BlockWrapperProps = {
    elevation: number
    direction: 'row' | 'column'
    padding: number
    background: string
}


/**
 * 
 */
export const BlockWrapper = React.forwardRef((props: BlockWrapperProps, ref) => {
    const localRef = useRef<HTMLDivElement>(null);
    const refs = useRef<Record<number, HTMLElement | null>>({});
    const selected = useHookstate(infoState.select);
    const curCell = useHookstate(context.currentCell);
    const [hovered, setHovered] = React.useState<number | null>(null);
    const {
        elevation = 2,
        direction = 'column',
        padding = 16,
        background = '#ffffff17',
        gap = 2,
        content = [],
        style = {},
        ...rest
    } = props;

    const id = props['data-id'];
    const { setNodeRef } = useDroppable({ id: `block-${id}` });
    const selectedContent = selected.content.get({ noproxy: true });
    const { width } = useParentCellSize(localRef);

    const layoutStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: direction,
        padding,
        gap,
        background,
        borderRadius: 8,
        width: width - 4,
        border: selectedContent?.props?.['data-id'] === id && '2px solid #90caf9',
        transition: 'border 0.3s',
        minHeight: 60,
        ...style,
    }
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
    );
    const resolvedContent = content.map((item) =>
        React.isValidElement(item) ? item : deserializeJSX(item, componentMap)
    );
    const handleInnerDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!active || !over || active.id === over.id) return;

        const oldIndex = resolvedContent.findIndex((c) => c.props['data-id'] === active.id);
        const newIndex = resolvedContent.findIndex((c) => c.props['data-id'] === over.id);
        console.log('🔥 DRAG END');
        console.log('active', active.id);
        console.log('over', over.id);
        if (oldIndex === -1 || newIndex === -1) return;

        const updated = arrayMove(resolvedContent, oldIndex, newIndex);

        renderState.set((prev) => {
            const updatedRender = [...prev];
            const layer = updatedRender.find((l) => l.i === curCell.get()?.i);
            if (!layer) return prev;

            const blockIndex = layer.content.findIndex((comp) => comp?.props?.['data-id'] === id);
            if (blockIndex === -1) return prev;

            const block = layer.content[blockIndex];

            const newBlock = React.cloneElement(block, {
                ...block.props,
                content: updated,
            });

            layer.content[blockIndex] = newBlock;
            return updatedRender;
        });
    }
    const handleDeleteChild = (childId: number) => {
        renderState.set((prev) => {
            const updated = [...prev];
            const layer = updated.find((l) => l.i === curCell.get()?.i);
            if (!layer) return prev;

            const blockIndex = layer.content.findIndex(
                (comp) => comp?.props?.['data-id'] === id
            );
            if (blockIndex === -1) return prev;

            const block = layer.content[blockIndex];

            const updatedContent = block.props.content.filter(
                (child) => child.props['data-id'] !== childId
            );

            const updatedBlock = React.cloneElement(block, {
                ...block.props,
                content: updatedContent,
            });

            layer.content[blockIndex] = updatedBlock;
            return updated;
        });
        cellsContent.set((prev) => {
            const cellId = curCell.get()?.i;
            if (!cellId) return prev;

            const layer = prev[cellId];
            if (!layer) return prev;

            const block = layer.find((c) => c.props['data-id'] === id);
            if (!block) return prev;

            if (!Array.isArray(block.props.content)) return prev;

            block.props.content = block.props.content.filter(
                (child) => child.props['data-id'] !== childId
            );

            return prev;
        });

        infoState.select.content.set(null);
    }
    const onPointerLeave = (e: React.PointerEvent) => {
        const related = e.relatedTarget as HTMLElement | null;

        // Проверяем: если ушли НЕ на иконку и НЕ на компонент
        const isStillInside = related?.closest('[data-id="' + hovered + '"]') ||
            related?.closest('.block-delete-btn');

        if (!isStillInside) {
            setHovered(null);
        }
    }


    return (
        <>
            <Paper
                ref={(node) => {
                    setNodeRef(node);
                    localRef.current = node;
                    if (ref) {
                        if (typeof ref === 'function') ref(node);
                        else (ref as React.RefObject<any>).current = node;
                    }
                }}
                data-id={id}
                data-type="Block"
                elevation={elevation}
                style={layoutStyle}
                {...rest}
            >
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleInnerDragEnd}
                >
                    <SortableContext
                        items={resolvedContent.map((child) => child.props['data-id'])}
                        strategy={rectSortingStrategy}
                        id={`block-${id}`}
                    >
                        { resolvedContent.length > 0 ? (
                            resolvedContent.map((child: any) => (
                                <SortableItem 
                                    key={child.props['data-id']} 
                                    id={child.props['data-id']}
                                    onPointerEnter={() => setHovered(child.props['data-id'])}
                                    onPointerLeave={onPointerLeave}
                                >
                                    {React.cloneElement(child, {
                                        ref: (el: HTMLElement | null) => {
                                            refs.current[child.props['data-id']] = el;
                                        }
                                    })}
                                </SortableItem>
                            ))
                        ) : (
                            <Typography variant="caption" color="textSecondary">
                                Здесь можно размешать компоненты
                            </Typography>
                        )}
                    </SortableContext>
                </DndContext>
            </Paper>

            { hovered !== null && refs.current?.[hovered] && iconRoot &&
                createPortal(
                    <IconButton
                        className="block-delete-btn"
                        size="small"
                        onClick={() => handleDeleteChild(hovered)}
                        onPointerEnter={() => {}}
                        onPointerLeave={onPointerLeave}
                        sx={{
                            position: 'absolute',
                            top: refs.current[hovered]?.getBoundingClientRect().top + window.scrollY-10 ?? 0,
                            left: refs.current[hovered]?.getBoundingClientRect().left + refs.current[hovered]?.getBoundingClientRect().width - 18 ?? 0,
                            zIndex: 9999,
                            background: '#282828',
                            border: '1px solid #05050545',
                            p: 0.5
                        }}
                    >
                        <Delete sx={{color:'#fc1d1d'}} fontSize="small" />
                    </IconButton>,
                    iconRoot
                )
            }
        </>
    );
});

import React from 'react';
import { IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import { FormatListBulleted, FormatListNumbered } from '@mui/icons-material';
import { useSlate } from 'slate-react';
import { Editor, Transforms } from 'slate';

const listTypes = [
  { label: '● Круги', value: 'disc' },
  { label: '■ Квадраты', value: 'square' },
  { label: '– Чёрточки', value: 'dash' },
  { label: '1. Цифры', value: 'decimal' },
];

export const ListStyleToolbar: React.FC = () => {
  const editor = useSlate();
  const [anchor, setAnchor] = React.useState<null | HTMLElement>(null);

  const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchor(e.currentTarget);
  };

  const handleSelect = (style: string) => {
    const [match] = Editor.nodes(editor, {
      match: n => !Editor.isEditor(n) && n.type === 'bulleted-list',
    });

    if (match) {
      Transforms.setNodes(
        editor,
        { listStyleType: style },
        { match: n => !Editor.isEditor(n) && n.type === 'bulleted-list' }
      );
    }
    setAnchor(null);
  };

  return (
    <>
      <Tooltip title="Стиль маркера">
        <IconButton size="small" onClick={handleOpen}>
          <FormatListBulleted sx={{ fontSize: 16 }} />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
      >
        {listTypes.map((item) => (
          <MenuItem key={item.value} onClick={() => handleSelect(item.value)}>
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
const testId = '14Jy8ozyC4nmjopCdaCWBZ48eFrJE4BneWuA3CMrHodE';


/** только для публичной */
export async function fetchGoogleSheet(sheetId?: string): Promise<any[]> {
    try {
        const url = `https://docs.google.com/spreadsheets/d/${sheetId??testId}/gviz/tq?tqx=out:json`;
        const res = await fetch(url);
        const text = await res.text();

        const jsonText = text.match(/google\.visualization\.Query\.setResponse\((.*)\);?/s)?.[1];
        if (!jsonText) throw new Error('Не удалось извлечь JSON');

        const json = JSON.parse(jsonText);
        const rows = json.table.rows;

        // ⚠ Берем первую строку как заголовки
        const headerRow = rows[0].c.map(cell => cell?.v ?? '');
        const dataRows = rows.slice(1);

        const result = dataRows.map((row) => {
            const obj: Record<string, any> = {};
            row.c.forEach((cell, i) => {
                const header = headerRow[i];
                obj[header] = cell?.v ?? '';
            });
            return obj;
        });

        return result;
    } 
    catch (err) {
        console.warn('⚠️ Ошибка загрузки Google Sheets: ', err);
    }
}

export async function fetchJson(source: string) {
    try {
        const res = await fetch(source);
        return await res.json();
    }
    catch (err) {
        console.warn('⚠️ Ошибка загрузки JSON: ', err);
    }
}

export async function loadTableData(sourceType: 'json' | 'google' | 'json-url', source: string): Promise<any[]> {
    try {
        if (sourceType === 'json') {
            return JSON.parse(source);
        }
        if (sourceType === 'json-url') {
            return await fetchJson(source);
        }
        if (sourceType === 'google') {
            return await fetchGoogleSheet(source);
        }

        throw new Error(`Неподдерживаемый sourceType: ${sourceType}`);
    } 
    catch (err) {
        return [];
    }
}
import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { DataTable, DataTableProps } from '../../../index';
import { ComponentProps } from '../../type';
import { deserializeJSX } from '../../utils/sanitize';
import { iconsList } from '../../../components/tools/icons';
import { Column } from 'primereact/column';
import { useHookstate } from '@hookstate/core';
import { loadTableData } from './providers';


export type DataSourceTableProps = {
    dataId: string | number
    style?: React.CSSProperties
    sourceType?: 'json' | 'google' | 'json-url'
    refreshInterval?: number;           // интервал в миллисекундах
    source: string                      // URL или JSON-строка
    header?: null       // пока отключен
    footer?: null       // пока отключен
    // клик по row
    onSelect: (data: Record<string, any>)=> void
}
type ColumnData = {
    field: string 
    header: string
}


export default function({ style, dataId, sourceType, source, refreshInterval, ...props }: DataSourceTableProps) {
    const [data, setData] = React.useState([]);
    const [columns, setColumns] = React.useState<ColumnData[]>([]);         // схема колонок
    const [loading, setLoading] = React.useState(false);
    

    // генератор схемы колонок из data, если нет схемы
    const inferColumns = (data: any[]) => {
        const result = [];
        const first = data[0];

        Object.keys(first).map((key) => {
            if(key.length > 0) result.push({
                field: key,
                header: key.toUpperCase(),
            })
        });

        return result;
    }
    // props.onLoad && props.onLoad();
    const load = React.useCallback(async () => {
        setLoading(true);
        const rows = await loadTableData(sourceType, source);
        setData(rows);
        setLoading(false);
       
    }, [sourceType, source]);

    React.useEffect(()=> {
        load(); // первичная загрузка

        if (!refreshInterval || refreshInterval < 1000) return;

        const id = setInterval(() => {
            load();
        }, refreshInterval);

        return () => clearInterval(id);
    }, [dataId, source]);
    React.useEffect(()=> {
        if (data.length > 0 && columns.length === 0) {
            const inferred = inferColumns(data);
            setColumns(inferred);
        }
    }, [data]);
    

    return(
        <DataTable
            data-id={dataId}
            data-type='DataTable'
            style={{ ...style, width: props.width, height: props.height-15, display: 'block' }}
            value={data}
            onRowClick={(e)=> props?.onSelect?.(e.data)}
            header={
                <div style={{ fontSize: 12, color: 'gray' }}>
                    { loading && <><CircularProgress size='13'/> Обновление данных...</> }
                </div>
            }
        >
            { columns.map((col) => (
                <Column 
                    sortable
                    key={col.field} 
                    field={col.field} 
                    header={col.header} 
                />
            ))}
        </DataTable>
    );
}
import { createRoot } from 'react-dom/client';
import { motion, useAnimation } from 'framer-motion';
import React, { useEffect } from 'react';



const FlyingFFromElement = ({ element, onComplete }) => {
    const controls = useAnimation();

    useEffect(() => {
        const rect = element.getBoundingClientRect();
        const startX = rect.left + rect.width / 2;
        const startY = rect.top + rect.height / 2;

        controls.set({ x: startX, y: startY, rotate: 0, scale: 1, opacity: 1 });

        controls.start({
            x: startX + 200,
            y: startY - 150,
            rotate: 720,
            scale: 0,
            opacity: 0,
            transition: {
                duration: 1.2,
                ease: 'easeOut',
            },
        }).then(() => onComplete?.());
    }, []);

    return (
        <motion.div
            animate={controls}
            initial={false}
            style={{
                position: 'fixed',
                fontSize: '24px',
                fontWeight: 'bold',
                color: 'deepskyblue',
            }}
        >
            F
        </motion.div>
    );
}

export function triggerFlyFromComponent(dataId: string) {
    const el = document.querySelector(`[data-id="${dataId}"]`);
    if (!el) return;

    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '9999';
    document.body.appendChild(container);

    const root = createRoot(container);

    root.render(
        <FlyingFFromElement element={el} onComplete={() => {
            root.unmount();
            container.remove();
        }} />
    );
}
import React from 'react';
import { cellsContent } from '../../context';
import { Editor} from 'slate';

type CellContext = {
    cellId: string | null;
    componentIndex: number | null;
    components: any[];
    cellRect: DOMRect | null;
    cellRef: HTMLElement | null;
}


/**
 * Возвращает информацию о ячейке, в которой находится компонент
 * @param componentId ID компонента (`data-id`)
 * @param includeSelf включать ли сам компонент в список окружения
 */
const useCellContext = ( componentId: string, includeSelf: boolean = true ): CellContext => {
    const [cellId, setCellId] = React.useState<string | null>(null);
    const [componentIndex, setComponentIndex] = React.useState<number | null>(null);
    const [cellRef, setCellRef] = React.useState<HTMLElement | null>(null);
    const [cellRect, setCellRect] = React.useState<DOMRect | null>(null);
    const [components, setComponents] = React.useState<any[]>([]);

    
    React.useEffect(() => {
        const cells = cellsContent.get({ noproxy: true });

        for (const [id, comps] of Object.entries(cells)) {
            const index = comps.findIndex((comp) => comp?.props?.['data-id'] === componentId);
            if (index !== -1) {
                setCellId(id);
                setComponentIndex(index);

                const filtered = includeSelf
                    ? comps
                    : comps.filter((comp) => comp?.props?.['data-id'] !== componentId);

                setComponents(filtered);
                break;
            }
        }
    }, [componentId, includeSelf]);
    React.useEffect(() => {
        if (!cellId) return;

        const el = document.querySelector(`[data-id="${cellId}"]`) as HTMLElement | null;
        if (!el) return;

        setCellRef(el);
        setCellRect(el.getBoundingClientRect());

        const resizeObserver = new ResizeObserver(() => {
            setCellRect(el.getBoundingClientRect());
        });

        resizeObserver.observe(el);
        return () => resizeObserver.disconnect();
    }, [cellId]);


    return {
        cellId,
        componentIndex,
        components,
        cellRect,
        cellRef
    };
}

/**
 * информация по размерам которые занимает компонент
 * @param componentId D компонента (`data-id`)
 * @returns 
 */
export const useComponentSize = (componentId: string) => {
    const { cellRef, components, componentIndex } = useCellContext(componentId, true);
    const [size, setSize] = React.useState({ width: 0, height: 0 });

    React.useEffect(() => {
        if (!cellRef || componentIndex === null) return;

        const calcSize = () => {
            const siblingsBefore = components.slice(0, componentIndex);

            const usedHeight = siblingsBefore.reduce((acc, comp) => {
                const id = comp.props['data-id'];
                const el = document.querySelector(`[data-id="${id}"]`) as HTMLElement;
                return acc + (el?.offsetHeight || 0);
            }, 0);

            const cellRect = cellRef.getBoundingClientRect();
            const availableHeight = cellRect.height - usedHeight;
            //const width = cellRect.width;

            const usedWidth = siblingsBefore.reduce((acc, comp) => {
                const id = comp?.props?.['data-id'];
                const el = document.querySelector(`[data-id="${id}"]`) as HTMLElement;
                return acc + (el?.offsetWidth || 0);
            }, 0);
            
            const availableWidth = cellRect.width - usedWidth;
            //console.log(availableWidth)

            setSize({
                width: Math.max(0, availableWidth),
                height: Math.max(0, availableHeight),
            });
        };

        calcSize();
        const resizeObserver = new ResizeObserver(calcSize);
        resizeObserver.observe(cellRef);

        return () => resizeObserver.disconnect();
    }, [cellRef, componentIndex, components]);

    return size; // { width, height }
}


export function useParentCellSize(ref: React.RefObject<HTMLElement>) {
    const [size, setSize] = React.useState({ width: 0, height: 0 });

    React.useEffect(() => {
        const node = ref.current;
        if (!node) return;

        let parentCell = node.closest('[data-id]');

        while (parentCell && parentCell.getAttribute('data-type') === 'Block') {
            parentCell = parentCell.parentElement?.closest('[data-id]');
        }

        if (!parentCell) return;

        const update = () => {
            const rect = parentCell!.getBoundingClientRect();
            setSize({ width: rect.width, height: rect.height });
        };

        update();
        const observer = new ResizeObserver(update);
        observer.observe(parentCell);

        return () => observer.disconnect();
    }, [ref]);

    return size;
}


/**
 * Позволяет навесить сброс marks по ПКМ на любую кнопку
 * @param onClick обычный обработчик ЛКМ
 * @param editor slate editor instance
 * @param marks mark или список marks, которые будут сброшены по ПКМ
 */
export const withResetOnRightClick = (
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void,
    editor: Editor,
    marks: string | string[]
) => {
    const marksToClear = Array.isArray(marks) ? marks : [marks];

    return {
        onClick,
        onContextMenu: (e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            for (const mark of marksToClear) {
                Editor.removeMark(editor, mark);
            }
        },
    };
};
import React from 'react';

type ComponentDefinition = {
    type: string;
    component: React.FC<any>;
    defaultProps?: Record<string, any>;
    icon?: React.FC;
    category?: 'block' | 'interactive' | 'media' | 'complex' | 'misc';
    description?: string;
}


const internalComponentMap: Record<string, React.FC<any>> = {};
const defaultPropsMap: Record<string, Record<string, any>> = {};
const registry: Record<string, Omit<ComponentDefinition, 'component' | 'defaultProps'>> = {};

export function registerComponent(def: ComponentDefinition) {
    internalComponentMap[def.type] = def.component;
    defaultPropsMap[def.type] = def.defaultProps ?? {};
    
   
    registry[def.type] = {
        type: def.type,
        icon: def.icon,
        category: def.category,
        description: def.description ?? def.type,
    };
}

// Экспортируем доступ
export const componentRegistry = registry;
export const componentMap = internalComponentMap;
export const componentDefaults = defaultPropsMap;
import { hookstate } from "@hookstate/core";
import { infoState } from '../../context';
import EventEmitter from "../../../app/emiter";
import { DataEmiters } from "../../type";


// shared storage 
export const sharedContext = hookstate({
    all: {}
});
export const sharedEmmiter = new EventEmitter();



// создание shared storage 
export const useCtxBufer = (id: number, initValue: any) => {
    const uid = `${id}`;
    const ref = document.querySelector(`[data-id='${uid}']`);

    // создаст storage в shared storage 
    sharedContext.set((prev)=> {
        if(prev[uid]) console.warn('Перезаписан bufer storage: ', uid);

        prev[uid] = initValue;
        return prev;
    });

    return (newValue: any)=> {
        sharedContext.set((prev)=> {
            infoState.inspector.lastData.set({
                mutation: uid,
                prev: prev,
                new: newValue,
                ref
            });

            prev[uid] = newValue;
            return prev;
        });
    }
}
//  компонент создает эммитер
export const useEvent = (id: string | number) => {
    const uid = `${id}`;

    // label - это как класификатор уточнение
    return (label: DataEmiters, data: any)=> {
        sharedEmmiter.emit(uid, { label, data });
    }
}
import React from 'react';
import { Box, IconButton, Paper } from '@mui/material';
import context, { infoState, cellsContent } from '../../context';
import { useHookstate } from '@hookstate/core';


export type ToolbarOption = {
    icon: React.ReactNode;
    action: () => void;
    tooltip?: string;
}
export type ContextualToolbarProps = {
    options: ToolbarOption[];
    align?: 'top' | 'bottom';
    offsetY?: number;
    visible?: boolean;
    position?: 'center' | 'left' | 'right';
}
export function useToolbar(id: number, onVisibleChange?: (v: boolean)=> void, alwaysVisible = false) {
    const selected = useHookstate(infoState.select.content);
    const [visible, setVisible] = React.useState(false);


    React.useEffect(() => {
        const isSelected = selected.get({noproxy:true})?.props?.['data-id'] === id;
        const show = alwaysVisible || isSelected;
        setVisible(show);
        onVisibleChange?.(show);
    }, [selected, id, alwaysVisible]);


    return { visible, selected, context, cellsContent };
}


const ContextualToolbar: React.FC<ContextualToolbarProps> = ({
    options,
    align = 'top',
    offsetY = -30,
    visible = true,
    position = 'right',
    width = '200px'
}) => {
    if (!visible) return null;

    let justifyContent: 'flex-start' | 'center' | 'flex-end' = 'center';
    if (position === 'left') justifyContent = 'flex-start';
    if (position === 'right') justifyContent = 'flex-end';


    return (
        <Box
            sx={{
                position: 'absolute',
                [align]: offsetY,
                [position]: 0, 
                top: 0,
                display: 'flex',
                justifyContent,
                width,
                gap: 0.5, 
                flexDirection: 'row',  
                py: 1,
                borderRadius: 2,
                backdropFilter: 'blur(10px)',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: `
                    0px 2px 4px 0px rgba(0, 0, 0, 0.3),
                    0px 1px 5px 0px rgba(0, 0, 0, 0.2)`,
                zIndex: 100,
                pointerEvents: 'auto',
            }}
            style={{padding: '6px'}}
        >
            { options.map((opt, i) => (
                <IconButton
                    key={i}
                    size="small"
                    onClick={opt.action}
                    sx={{ color: '#ccc', fontSize: 14, height: 24, width:24 }}
                >
                    { opt.icon }
                </IconButton>
            ))}
        </Box>
    );
}


export default ContextualToolbar;