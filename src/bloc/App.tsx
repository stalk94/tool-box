'use client'
import React from "react";
import { LayoutCustom, ComponentSerrialize, Component, Events, SlotDataBus, DataNested } from './type';
import { DndContext, DragOverlay, DragEndEvent, PointerSensor, useSensors, useSensor, DragStartEvent, pointerWithin } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, rectSortingStrategy } from '@dnd-kit/sortable';
import "react-grid-layout/css/styles.css";
import { useEditorContext, useRenderState, useCellsContent, useInfoState, useNestedContext } from "./context";
import { hookstate, useHookstate } from "@hookstate/core";
import { createComponentFromRegistry } from './utils/createComponentRegistry';
import { ToolBarInfo } from './Top-bar';
import { componentMap, componentsRegistry } from './modules/utils/registry';
import LeftToolBar from './Left-bar';
import GridComponentEditor from './Editor-grid';
import { saveBlockToFile, fetchFolders } from "./utils/export";
import { serializeJSX } from './utils/sanitize';
import EventEmitter from "../app/emiter";
import {  useSafeAsyncEffect } from "./utils/usePopUp";
import { DragItemCopyElement, activeSlotState } from './Dragable';
import { updateComponentProps } from './utils/updateComponentProps';
import NestedContext from './nest-slot/App';
import GridTest from 'public/export/test/header/index.tsx';
import GridTest2 from 'public/export/home/root/index';
import "../style/edit.css";




if (!window.next) {
    import('./modules/index').then((mod) => {
        console.log('Модуль подгружен:', mod);
    })
    .catch((err) => {
        console.error('❌ Ошибка при загрузке модуля:', err);
    });
}

// ANCHOR - СИТЕМНЫЙ ЭММИТЕР
if(!globalThis.EVENT) globalThis.EVENT = new EventEmitter<Events>();



// это редактор блоков сетки
export default function Block({ setShowBlocEditor }) {
    globalThis.ZOOM = 1;   
    const [enableContext, setEnable] = React.useState(false);
    const nestedContext = useHookstate(useNestedContext());                                    
    const cacheDrag = React.useRef<HTMLDivElement>(null);
    const [activeDragElement, setActiveDragElement] = React.useState<React.ReactNode | null>(null);
    const ctx = useHookstate(useEditorContext());
    const mod = useHookstate(ctx.mod);
    const refs = React.useRef({});                                   // список всех рефов на все компоненты
    const render = useHookstate(useRenderState());
    const info = useHookstate(useInfoState());                             // данные по выделенным обьектам
    const curCell = ctx.currentCell;                                    // текушая выбранная ячейка
    const cellsCache = useHookstate(useCellsContent());                   // элементы в ячейках (dump из localStorage)
    const activeSlot = useHookstate(activeSlotState);
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
    );
   

    const dumpRender = () => {
        const name = ctx.meta.name.get();
        const scope = ctx.meta.scope.get();
        //snapshotAndUpload(`${scope}-${name}`);
        saveBlockToFile(scope, name);
    }
    const desserealize = (component: ComponentSerrialize) => {
        const { id, props, parent } = component;
        const type = props["data-type"];
        
        const Component = componentMap[type];
        Component.displayName = type;
        //Component.parent = parent;
    
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

                const clone = React.cloneElement(component, {
                    'data-id': serialized.id,
                    ref: (el) => {
                        if (el) refs.current[serialized.id] = el;
                    }
                });
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
    const handleDragEndOld = (event: DragEndEvent, cellId: string) => {
        const { active, over } = event;
      
        if (!active || !over || active.id === over.id) return;

        const currentList = cellsCache.get({ noproxy: true })[cellId];
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
            cellsCache.set((old) => {
                old[cellId] = arrayMove(old[cellId], oldIndex, newIndex);
                return old;
            });

            return updated;
        });

        if (cacheDrag.current) {
            cacheDrag.current.classList.add('editor-selected');
            const find = render.get({ noproxy: true }).find(el => el.i === cellId);

            if (find && Array.isArray(find.content)) {
                const findChild = find.content.find(child => child.props['data-id'] == +cacheDrag.current.getAttribute('ref-id'));
                if (findChild) requestIdleCallback(() => info.select.content.set(findChild));
            }
        }
    }
    const handleDragStart = (event: DragStartEvent) => {
        const elActivator = event.activatorEvent.target as HTMLElement;
        const container = elActivator.closest('[ref-id]') as HTMLElement | null;
        cacheDrag.current = container;

        document.querySelectorAll('[ref-id]').forEach(el => {
            el.classList.remove('editor-selected');
        });
    }
    const handleDragEnd =(event: DragEndEvent)=> {
        const { active, over } = event;
        setActiveDragElement(null);
        if(!active || !over) return;

        const dragData = active.data?.current;
        const dropMeta = over.data?.current;
        

        // перетаскивание внутри ячеек
        if (dragData?.type === 'sortable' && dropMeta?.type === 'sortable') {
            const cellId = dragData.cellId;
            handleDragEndOld(event, cellId);
            return;
        }
        // перетаскивание на слот
        else if (dropMeta?.type === 'sortable') {
            const slot = activeSlot.get({ noproxy: true });
            const dataType = dragData.dataType;
            
            if(slot?.dataTypesAccepts && dataType && slot?.dataTypesAccepts?.includes(dataType) ) {
                slot.onAdd(createComponentFromRegistry(dataType));
            }
        }
        else if (over?.id) {
            const dragged = active.data?.current?.element;
            const type = active.data?.current?.type;
            const accepts = over?.data?.current?.dataTypesAccepts;
            console.log(accepts)
            // добавление из галереи компонентов
            if(dragged && type === 'element' && !accepts) {
                curCell.set({ i: over.id });
                const ref = document.querySelector(`[data-id="${over.id}"]`);
                info.select.cell.set(ref);

                if(curCell.get()?.i) {
                    addComponentToCell(curCell.get().i, createComponentFromRegistry(active.id));
                }
            }
        }

        setActiveDragElement(null); // очистка
    }
    const findById = (idToFind: number): ComponentSerrialize | undefined => {
        const rawCache = cellsCache.get({ noproxy: true });

        for (const layerKey in rawCache) {
            const list = rawCache[layerKey];
            const found = list.find((obj) => obj.id === idToFind);
            if (found) return found;
        }

        return undefined;
    }
    const handleChangeNestedContext = (editData: DataNested) => {
        const idComponent = nestedContext.currentData.idParent.get();
        const idSlot = nestedContext.currentData.idSlot.get();
        const findComponentSerrialize = findById(idComponent);

        if (findComponentSerrialize) updateComponentProps({
            component: findComponentSerrialize,
            data: {
                slots: {
                    ...findComponentSerrialize.props?.slots,
                    [idSlot]: editData
                }
            },
            rerender: false
        });
    }
    useSafeAsyncEffect(async (isMounted) => {
        try {
            const data = await fetchFolders();
            
            if (isMounted() && data) {
                info.project.set(data);
                ctx.dragEnabled.set(true);
            }
        }
        catch (e) {
            console.error("fetchFolders error:", e);
        }
    }, []);
    React.useEffect(()=> {
        // нажат переход к вложенной сетке слота компонента
        EVENT.on('addGridContext', (data: SlotDataBus)=> {
            console.log('ADD GRID CONTEXT: ', data);

            nestedContext.set({
                isEnable: true,
                currentData: data
            });
            setTimeout(()=> setEnable(true), 100);
        });
    }, []);
    


    return(
        <>
            { enableContext &&
                <NestedContext
                    useBackToEditorBase={(editData)=> {
                        handleChangeNestedContext(editData);
                        setEnable(false)
                    }}
                    nestedComponentsList={nestedContext.currentData.nestedComponentsList.get({noproxy: true})}
                    data={nestedContext.currentData.data.get({noproxy: true})}
                    onChange={handleChangeNestedContext}
                />
            }
            { !enableContext && 
                <DndContext
                    collisionDetection={pointerWithin}
                    sensors={sensors}
                    onDragStart={(event) => {
                        const dragged = event.active.data?.current?.element;
                        const dragData = event.active.data?.current;

                        if (dragData.type === 'sortable') handleDragStart(event);
                        if (dragged) setActiveDragElement(dragged);
                    }}
                    onDragEnd={handleDragEnd}
                >
                    <DragOverlay dropAnimation={null}>
                        {activeDragElement && <DragItemCopyElement activeDragElement={activeDragElement} />}
                    </DragOverlay>

                    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'row' }}>
                        <LeftToolBar
                            desserealize={desserealize}
                            useDump={dumpRender}
                        />

                        <div style={{ width: '80%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <ToolBarInfo setShowBlocEditor={setShowBlocEditor} />
                            {mod.get() === 'preview'
                                ? <GridTest2 />
                                : <GridComponentEditor
                                    desserealize={desserealize}
                                />
                            }

                        </div>
                    </div>
                </DndContext>
            }
        </>
    );
}



/**
 *   React.useEffect(()=> {
        const call =(data)=> {
            const cell = curCell.get();
            addComponentToCell(cell.i, data);
        }

        // ! data bus, вставка компонента в тек. выделенную ячейку
        EVENT.on('addComponentToCell', call);
        return ()=> EVENT.off('addComponentToCel', call);
    }, []);
 */
/**
 *   addComponentToLayout={(elem)=> {
                    if(curCell.get()?.i) addComponentToCell(curCell.get().i, elem);
                }}
 */