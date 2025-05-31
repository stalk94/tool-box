import React from "react";
import { NestedContext, ComponentSerrialize, ComponentProps, DataRegisterComponent } from '../type';
import { DndContext, DragOverlay, DragEndEvent, PointerSensor, useSensors, useSensor, DragStartEvent, pointerWithin } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, rectSortingStrategy } from '@dnd-kit/sortable';
import "react-grid-layout/css/styles.css";
import { editorSlice, infoSlice, renderSlice, cellsSlice } from "./context";
import { createComponentFromRegistry } from '../helpers/createComponentRegistry';
import { serializeJSX } from '../helpers/sanitize';


import { DragItemCopyElement } from './Dragable';
import { ToolBarInfo } from './Top-bar';
import LeftToolBar from './Left-bar';
import GridComponentEditor from './Editor-grid';



// это редактор блоков сетки
export default function Block({ useBackToEditorBase, data, nestedComponentsList, onChange, isArea }: NestedContext) {
    globalThis.ZOOM = 1;                                           // в редакторе блоков зум отключаем
    const cacheDrag = React.useRef<HTMLDivElement>(null);
    const [activeDragElement, setActiveDragElement] = React.useState<React.ReactNode | null>(null);
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
    );
   
    
    const createDataComponent = (rawProps: ComponentProps, cellId: string): ComponentSerrialize => {
        const type = rawProps['data-type'];
        const id = Date.now();

        if (rawProps.ref) delete rawProps.ref;
        const cleanedProps = serializeJSX(rawProps);

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
    const addComponentToCell = (cellId: string, component: DataRegisterComponent) => {
        const { Component, props } = component;
        const data = createDataComponent(props, cellId);

        editorSlice.layout.set((prevRender) => {
            const copy = structuredClone(prevRender);
            const findIndex = prevRender.findIndex((cell) => cell.i === cellId);

            if (findIndex !== -1) {
                const targetCell = copy[findIndex];

                if (Array.isArray(targetCell.content)) {
                    targetCell.content.push(data);
                }
                else targetCell.content = [data];
            }

            return copy;
        });
        renderSlice.set(editorSlice.layout.get(true));

        
        cellsSlice.set((old) => {
            if(Array.isArray(old[cellId])) old[cellId].push(data);
            else old[cellId] = [data];

            return old;
        });
    }
    const handleDragEndOld = (event: DragEndEvent, cellId: string) => {
        const { active, over } = event;
        if (!active || !over || active.id === over.id) return;

        const currentList = cellsSlice.get(true);
        const oldIndex = currentList[cellId].findIndex((comp) => comp.props['data-id'] === active.id);
        const newIndex = currentList[cellId].findIndex((comp) => comp.props['data-id'] === over.id);

        if (oldIndex === -1 || newIndex === -1) return;

        // 🔁 Обновляем стейты
        renderSlice.set((prev) => {
            const target = prev.find((cell) => cell.i === cellId);

            if (target?.content) {
                target.content = arrayMove(target.content, oldIndex, newIndex);
            }

            return prev;
        });
        editorSlice.layout.set((prev) => {
            return prev.map((lay) => {
                if (lay.i === cellId) {
                    lay.content = arrayMove(lay.content, oldIndex, newIndex);
                }
                return lay;
            });
        });
        cellsSlice.set((old) => {
            old[cellId] = arrayMove(old[cellId], oldIndex, newIndex);

            return old;
        });


        if (cacheDrag.current) {
            cacheDrag.current.classList.add('editor-selected');
            const find = renderSlice.get().find(el => el.i === cellId);

            if (find && Array.isArray(find.content)) {
                const findChild = find.content.find(child => child.props['data-id'] == +cacheDrag.current.getAttribute('ref-id'));
                console.red('FIND SELECT CONTENT: ', findChild)
                if (findChild) requestIdleCallback(() => infoSlice.select.content.set(findChild));
            }
        }
    }
    const handleDragStart = (event: DragStartEvent) => {
        const elActivator = event.activatorEvent.target as HTMLElement;
        const container = elActivator.closest('[ref-id]') as HTMLElement | null;
        cacheDrag.current = container;
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
        else if (over?.id) {
            const dragged = active.data?.current?.element;
            const type = active.data?.current?.type;
            const accepts = over?.data?.current?.dataTypesAccepts;

            // добавление из галереи компонентов
            if(dragged && type === 'element' && !accepts) {
                editorSlice.currentCell.set({ i: over.id });

                const ref = document.querySelector(`[data-id="${over.id}"]`);
                infoSlice.select.cell.set(ref);
                
                addComponentToCell(
                    over.id, 
                    createComponentFromRegistry(active.id)
                );
            }
        }

        setActiveDragElement(null); // очистка
    }

    React.useEffect(()=> {
        //if(isArea) editorSlice.dragEnabled.set(false);
        //else editorSlice.dragEnabled.set(true);
        
        editorSlice.currentCell.set(undefined);
        infoSlice.set({
            container: {
                width: 0,
                height: 0,
            },
            select: {
                cell: {},
                panel: {
                    lastAddedType: '',
                },
            },
            project: {}
        });
        
        //infoSlice.project.set(data);
        editorSlice.dragEnabled.set(true);

        return ()=> {
            cellsSlice.set({});
            renderSlice.set([]);
            editorSlice.layout.set([]);
            editorSlice.currentCell.set(undefined);
            infoSlice.select.content.set(null);
        }
    }, []);
    


    return(
        <DndContext 
            collisionDetection={pointerWithin}
            sensors={sensors}
            onDragStart={(event) => {
                const dragged = event.active.data?.current?.element;
                const dragData = event.active.data?.current;

                if(dragData.type === 'sortable') handleDragStart(event);
                if (dragged) setActiveDragElement(dragged);
            }}
            onDragEnd={handleDragEnd}
        >
            <DragOverlay dropAnimation={null}>
                { activeDragElement && <DragItemCopyElement activeDragElement={activeDragElement} /> }
            </DragOverlay>

            <div style={{width: '100%', height: '100%', display: 'flex', flexDirection: 'row'}}>
                <LeftToolBar 
                    componentMap={nestedComponentsList}
                    onChange={onChange}
                />
                
                <div style={{width: '80%', height: '100%', display: 'flex', flexDirection: 'column'}}>
                    <ToolBarInfo setShowBlocEditor={useBackToEditorBase} />         
                    <GridComponentEditor
                        nestedData={data}
                        isArea={isArea}
                    />
                    
                </div>
            </div>
        </DndContext>
    );
}



/**
 *  const findIndex = ctx.layout.get({noproxy: true}).findIndex((el)=> el.i === cellId);
                    if(findIndex !== -1) {
                        ctx.layout.set((old)=> {
                            old[findIndex].content?.push(component);
                            return old;
                        });
                    }
 */