'use client'
import colorLog from '../app/helpers/console';
import React from "react";
import { Provider } from 'react-redux';
import { useSnackbar } from 'notistack';
import { LayoutCustom, ComponentSerrialize, Component, Events, SlotDataBus, DataNested } from './type';
import { DndContext, DragOverlay, DragEndEvent, PointerSensor, useSensors, useSensor, DragStartEvent, pointerWithin } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, rectSortingStrategy } from '@dnd-kit/sortable';
import "react-grid-layout/css/styles.css";
import { editorContext, infoSlice, renderSlice, cellsSlice, nestedContextSlice } from "./context";
import { createComponentFromRegistry } from './helpers/createComponentRegistry';
import { ToolBarInfo } from './Top-bar';
import { componentMap, componentsRegistry } from './modules/helpers/registry';
import LeftToolBar from './Left-bar';
import GridComponentEditor from './Editor-grid';
import { saveBlockToFile, fetchFolders } from "./helpers/export";
import { serializeJSX, serrialize as serrializeCopy } from './helpers/sanitize';
import EventEmitter from "../app/emiter";
import { DragItemCopyElement, activeSlotState } from './Dragable';
import { updateComponentProps } from './helpers/updateComponentProps';
import NestedContext from './nest-slot/App';
import GridTest2 from 'public/export/home/root/index';
import "../style/edit.css";


/////////////////////////////////////////////////////////////////////////////
if (!window.next) {
    import('./modules/index').then((mod) => {
        console.gray('Модуль подгружен:', mod);
    })
    .catch((err) => {
        console.error('❌ Ошибка при загрузке модуля:', err);
    });
}

if(!globalThis.EVENT) globalThis.EVENT = new EventEmitter<Events>();
globalThis.ZOOM = 1; 
colorLog();
/////////////////////////////////////////////////////////////////////////////



function EditorGlobal({ setShowBlocEditor, dumpRender }) {  
    const { enqueueSnackbar } = useSnackbar();
    const cacheDrag = React.useRef<HTMLDivElement>(null);                                  
    const [activeDragElement, setActiveDragElement] = React.useState<React.ReactNode | null>(null);
    const refs = React.useRef({});                                   // список всех рефов на все компоненты
    const mod = editorContext.mod.use();
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
    );
   

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
        const serialized = serrialize(component, cellId);
        const clone = React.cloneElement(component, {
            'data-id': serialized.id,
            ref: (el) => {
                if (el) refs.current[serialized.id] = el;
            }
        });

        renderSlice.set((prevRender) => {
            const findIndex = prevRender.findIndex((cell) => cell.i === cellId);

            if (findIndex !== -1) {
                const targetCell = prevRender[findIndex];

                if (Array.isArray(targetCell.content)) {
                    targetCell.content.push(clone);
                }
                else targetCell.content = [clone];
            }

            return prevRender;
        });

        cellsSlice.set((old) => {
            old[cellId].push(serialized);
            return old;
        });
    }
    const handleDragEndOld = (event: DragEndEvent, cellId: string) => {
        const { active, over } = event;
        if (!active || !over || active.id === over.id) return;

        const currentList = cellsSlice.get();
        const oldIndex = currentList[cellId].findIndex((comp) => comp.props['data-id'] === active.id);
        const newIndex = currentList[cellId].findIndex((comp) => comp.props['data-id'] === over.id);

        if (oldIndex === -1 || newIndex === -1) return;

        // 🔁 Обновляем стейты
        renderSlice.set((prev) => {
            const target = prev.find((cell) => cell.i === cellId);

            if (target?.content) {
                target.content = arrayMove(target.content, oldIndex, newIndex);
            }
        });
        editorContext.layout.set((prev) => {
            prev.map((lay) => {
                if (lay.i === cellId) {
                    lay.content = arrayMove(lay.content, oldIndex, newIndex);
                }
                return lay;
            });
        });
        cellsSlice.set((old) => {
            old[cellId] = arrayMove(old[cellId], oldIndex, newIndex);
        });


        if (cacheDrag.current) {
            cacheDrag.current.classList.add('editor-selected');
            const find = renderSlice.get().find(el => el.i === cellId);

            if (find && Array.isArray(find.content)) {
                const findChild = find.content.find(child => child.props['data-id'] == +cacheDrag.current.getAttribute('ref-id'));
                if (findChild) requestIdleCallback(() => infoSlice.select.content.set(findChild));
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
            const slot = activeSlotState.get();
            const dataType = dragData.dataType;
            
            if(slot?.dataTypesAccepts && dataType && slot?.dataTypesAccepts?.includes(dataType) ) {
                slot.onAdd(createComponentFromRegistry(dataType));
            }
        }
        else if (over?.id) {
            const dragged = active.data?.current?.element;
            const type = active.data?.current?.type;
            const accepts = over?.data?.current?.dataTypesAccepts;

            // добавление из галереи компонентов
            if (dragged && type === 'element' && !accepts) {
                editorContext.currentCell.set({ i: over.id });

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
    const handleKeyboard =(e: KeyboardEvent)=> {
        if (e.ctrlKey && e.key.toLowerCase() === 'c') {
            const select = infoSlice.select.content?.get();

            if(select) {
                editorContext.buffer.set(serrializeCopy(select));
                enqueueSnackbar('скопирован', {variant: 'default'});
            }
        }
    }
    React.useEffect(()=> {
        window.addEventListener('keydown', handleKeyboard);

        return ()=> window.removeEventListener('keydown', handleKeyboard);
    }, []);
    

    return (
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

            <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'row' }}>
                <LeftToolBar
                    desserealize={desserealize}
                    useDump={dumpRender}
                />

                <div style={{ width: '80%', maxHeight: '100%', display: 'flex', flexDirection: 'column' }}>
                    <ToolBarInfo setShowBlocEditor={setShowBlocEditor} />
                    
                    {mod === 'preview'
                        ? <GridTest2 />
                        : <GridComponentEditor
                            desserealize={desserealize}
                        />
                    }

                </div>
            </div>
        </DndContext>
    );
}


export default function EditorApp({ setShowBlocEditor }) {
    const { enqueueSnackbar } = useSnackbar();
    const [isLoad, setIsLoad] = React.useState(false);
    const [enableContext, setEnable] = React.useState(false);
    const meta = editorContext.meta.use();
    const nestedContext = nestedContextSlice.use();


    const fileSaveFromDumpRender = () => {
        const name = editorContext.meta.name.get();
        const scope = editorContext.meta.scope.get();
        //snapshotAndUpload(`${scope}-${name}`);
        saveBlockToFile(scope, name, (msg, type)=> {
            enqueueSnackbar(msg, {variant: type});
        });
    }
    const findById = (idToFind: number): ComponentSerrialize | undefined => {
        const rawCache = cellsSlice.get();

        for (const layerKey in rawCache) {
            const list = rawCache[layerKey];
            const found = list.find((obj) => obj.id === idToFind);
            if (found) return found;
        }

        return undefined;
    }
    const handleChangeNestedContext = (editData: DataNested) => {
        const idComponent = nestedContextSlice.currentData.idParent.get();
        const idSlot = nestedContextSlice.currentData.idSlot.get();
        const findComponentSerrialize = findById(idComponent);
        console.red('CHANGE CONTEXT:', editData);

        if (findComponentSerrialize) updateComponentProps({
            component: findComponentSerrialize,
            data: {
                slots: {
                    ...findComponentSerrialize.props?.slots,
                    [idSlot]: { ...editData }
                }
            },
            rerender: true
        });
    }
    const useGetDataFileDir = async() => {
         try {
            const data = await fetchFolders();
            
            if (data) {
                infoSlice.project.set(data);
                editorContext.dragEnabled.set(true);
            }
        }
        catch (e) {
            console.error("❗❗❗ fetchFolders error:", e);
        }
    }
    React.useLayoutEffect(()=> {
        useGetDataFileDir()
            .then(()=> setIsLoad(true))
            .catch(()=> console.error('🚨 data projects not load'));
    }, [])
    React.useEffect(()=> {
        const handle = (data: SlotDataBus) => {
            console.green('GET GRID CONTEXT =>', data);
            fileSaveFromDumpRender();

            nestedContextSlice.set({
                isEnable: true,
                currentData: structuredClone(data)
            });

            setTimeout(() => setEnable(true), 100);
        }
        
        EVENT.on('addGridContext', handle);
        return ()=> EVENT.off('addGridContext', handle);
    }, []);
    React.useEffect(()=> {
        setIsLoad(false);

        // 🧹 Чистим старое
        cellsSlice.set({});
        renderSlice.set([]);
        editorContext.layout.set([]);
        editorContext.currentCell.set(undefined); // ⬅️ важно, иначе останется старый cellId
        editorContext.size.set({ width: 0, height: 0, breackpoint: 'lg' });

        setTimeout(() => setIsLoad(true), 200);
    }, [meta.name, meta.scope]);


    return(
        <>
            { (enableContext && isLoad) &&
                <NestedContext
                    key={`nested-${nestedContext.currentData.idParent}-${nestedContext.currentData.idSlot}`}
                    useBackToEditorBase={(editData)=> {
                        setEnable(false);
                        handleChangeNestedContext(editData);
                    }}
                    nestedComponentsList={nestedContext.currentData.nestedComponentsList}
                    data={nestedContext.currentData.data}
                    onChange={handleChangeNestedContext}
                />
            }
            { !enableContext && isLoad && 
                <EditorGlobal 
                    setShowBlocEditor={setShowBlocEditor} 
                    dumpRender={fileSaveFromDumpRender}
                />
            }
        </>
    );
}