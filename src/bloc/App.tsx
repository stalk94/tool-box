'use client'
import colorLog from '../app/helpers/console';
import React from "react";
import { useSnackbar } from 'notistack';
import { DataRegisterComponent, ComponentSerrialize, ComponentProps, Events, SlotDataBus, DataNested } from './type';
import { DndContext, DragOverlay, DragEndEvent, PointerSensor, useSensors, useSensor, DragStartEvent, pointerWithin } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, rectSortingStrategy } from '@dnd-kit/sortable';
import "react-grid-layout/css/styles.css";
import { editorContext, infoSlice, renderSlice, cellsSlice, nestedContextSlice } from "./context";
import { createComponentFromRegistry } from './helpers/createComponentRegistry';
import { ToolBarInfo } from './Top-bar';
import { componentMap } from './modules/helpers/registry';
import LeftToolBar from './Left-bar';
import LeftToolBarSettings from './Left-bar-settings';
import GridComponentEditor from './Editor-grid';
import PreviewTheme from './utils/Preview-theme';
import { saveBlockToFile, fetchFolders } from "./helpers/export";
import { serializeJSX, serrialize as serrializeCopy } from './helpers/sanitize';
import EventEmitter from "../app/emiter";
import { DragItemCopyElement, activeSlotState } from './Dragable';
import { updateComponentProps, updateProjectState } from './helpers/updateComponentProps';
import NestedContext from './nest-slot/App';
import inputsIndex from 'public/export/index';
import './modules/index';
import "../style/edit.css";


/////////////////////////////////////////////////////////////////////////////
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
    // получает конкретный импорт превью из ранее экспортированных литералов
    const getPreview =()=> {
        const meta = editorContext.meta.get();
        const path = `${meta.scope}_${meta.name}`;

        if(inputsIndex[path]) return (
            <div style={{marginTop: '65px'}}>
                { inputsIndex[path]() }
            </div>
        );
        else return (
            <div style={{marginTop: '65px', marginLeft: '30px'}}>
                not path import preview
            </div>
        );
    }
    const createDataComponent = (rawProps: ComponentProps, cellId: string): ComponentSerrialize => {
        const type = rawProps['data-type'];
        const id = Date.now();

        if(rawProps.ref) delete rawProps.ref;
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

        renderSlice.set((prevRender) => {
            const findIndex = prevRender.findIndex((cell) => cell.i === cellId);

            if (findIndex !== -1) {
                const targetCell = prevRender[findIndex];

                if (Array.isArray(targetCell.content)) {
                    targetCell.content.push(data);
                }
                else targetCell.content = [data];
            }

            return prevRender;
        });

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

            return old;
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
        console.red('DRAG START')
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
        if (typeof window === 'undefined') return;
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
                { mod !== 'settings' &&
                    <LeftToolBar
                        desserealize={desserealize}
                        useDump={dumpRender}
                    />
                }
                { mod === 'settings' && <LeftToolBarSettings/> }

                <div style={{ width: '80%', maxHeight: '100%', display: 'flex', flexDirection: 'column' }}>
                    <ToolBarInfo setShowBlocEditor={setShowBlocEditor} />
                    
                    { mod === 'preview' && getPreview() }
                    { (mod === 'block' || mod === 'grid') && <GridComponentEditor desserealize={desserealize} /> }
                    { mod === 'settings' && <PreviewTheme /> }
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
        saveBlockToFile(scope, name, (msg, type) => {
            enqueueSnackbar(msg, { variant: type });
            updateProjectState(scope, name);
        });
    }
    const getDataFromCurrentScope =()=> {
        const scope = editorContext.meta.scope.get();
        const name = editorContext.meta.name.get();
        const project = infoSlice.project.get();

        const currentScope = project?.[scope];
        const found = currentScope?.find((x) => x.name === name);
        if (!found?.data) return;

        return found.data;
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
                    [idSlot]: JSON.parse(JSON.stringify(editData))
                }
            },
            rerender: true
        });

        setEnable(false);
    }
    const useGetDataFileDir = async () => {
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

    React.useLayoutEffect(() => {
        console.gray('layout effect');
        
        useGetDataFileDir()
            .then(() => setIsLoad(true))
            .catch(() => console.error('🚨 data projects not load'));
    }, [])
    React.useEffect(() => {
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
        return () => EVENT.off('addGridContext', handle);
    }, []);
    React.useEffect(() => {
        // 🔁 Очищаем перед установкой нового блока
        renderSlice.set([]);
        cellsSlice.set({});
        editorContext.layout.set([]);
        editorContext.size.set({ width: 0, height: 0, breackpoint: 'lg' });
        infoSlice.select.content.set(null);
        
        setTimeout(() => {
            const data = getDataFromCurrentScope();
            if(!data) return;

            const content = data.content ?? {};
            const layout = data.layout ?? [];

            // Устанавливаем
            cellsSlice.set(data.content);
            editorContext.layout.set(layout);
            editorContext.size.set(data.size ?? { width: 0, height: 0, breackpoint: 'lg' });

            // 🎯 Собираем renderSlice
            const result = layout.map((layer) => {
                const cellContent = content[layer.i] ?? [];
                const children = cellContent.map((cmp) => {
                    const C = componentMap[cmp.props['data-type']];
                    if (!C) return null;

                    return cmp;
                }).filter(Boolean);

                return {
                    ...layer,
                    content: children,
                };
            });

            //console.red('INIT EFFECT', result)
            renderSlice.set(result);
        }, 500);
    }, [meta.name, meta.scope]);
    


    return(
        <>
            { (enableContext && isLoad) &&
                <NestedContext
                    key={`nested-${nestedContext.currentData.idParent}-${nestedContext.currentData.idSlot}`}
                    useBackToEditorBase={(editData)=> {
                        handleChangeNestedContext(editData);
                    }}
                    nestedComponentsList={nestedContext.currentData.nestedComponentsList}
                    data={nestedContext.currentData.data}
                    onChange={handleChangeNestedContext}
                    isArea={nestedContext.currentData?.isArea}
                />
            }
            { !enableContext && isLoad && 
                <EditorGlobal 
                    key={Date.now()}
                    setShowBlocEditor={setShowBlocEditor} 
                    dumpRender={fileSaveFromDumpRender}
                />
            }
        </>
    );
}