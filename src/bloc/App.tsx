'use client'
import colorLog from '../app/helpers/console';
import React from "react";
import { useSnackbar } from 'notistack';
import type { BlockData } from './type';
import { createTheme } from '@mui/material';
import { DataRegisterComponent, ComponentSerrialize, ComponentProps, Events, SlotDataBus, DataNested, LayoutsBreackpoints } from './type';
import { DndContext, DragOverlay, DragEndEvent, PointerSensor, useSensors, useSensor, DragStartEvent, pointerWithin } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, rectSortingStrategy } from '@dnd-kit/sortable';
import "react-grid-layout/css/styles.css";
import { editorContext, infoSlice, cellsSlice, nestedContextSlice, bufferSlice, settingsSlice } from "./context";
import { createComponentFromRegistry } from './helpers/createComponentRegistry';
import { ToolBarInfo } from './Top-bar';
import { componentMap } from './modules/helpers/registry';
import LeftToolBar from './Left-bar';
import LeftToolBarSettings from './left-bar/Left-bar-settings';
import GridComponentEditor from './Editor-grid';
import Settings from './left-bar/Settings';
import { saveBlockToFile, fetchFolders } from "./helpers/export";
import { getComponentById } from "./helpers/editor";
import { serializeJSX, serrialize as serrializeCopy } from './helpers/sanitize';
import EventEmitter from "../app/emiter";
import { DragItemCopyElement, activeSlotState } from './Dragable';
import { updateComponentProps, updateProjectState } from './helpers/updateComponentProps';
import NestedContext from './nest-slot/App';
import { taskadeTheme, lightTheme, darkTheme } from 'src/theme';
import { useKeyboardListener, story } from './helpers/hooks';
import { setPadding } from './helpers/hotKey';
import Preview from './export/Page';
import { db } from "./helpers/export";



/////////////////////////////////////////////////////////////////////////////
if(!globalThis.EVENT) globalThis.EVENT = new EventEmitter<Events>();
globalThis.ZOOM = 1; 
colorLog();
/////////////////////////////////////////////////////////////////////////////



function EditorGlobal({ setShowBlocEditor, dumpRender }) {  
    const { enqueueSnackbar } = useSnackbar();
    const [theme, setTheme] = React.useState(lightTheme);
    const [currentToolPanel, setCurrentToolPanel] = React.useState<'base'|'theme'>('base');
    const cacheDrag = React.useRef<HTMLDivElement>(null);                                  
    const [activeDragElement, setActiveDragElement] = React.useState<React.ReactNode | null>(null);
    const refs = React.useRef({});                                   // список всех рефов на все компоненты
    const mod = editorContext.mod.use();
    const ctxTheme = settingsSlice.theme.use();
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
    );
   
    
    const desserealize = (component: ComponentSerrialize) => {
        const { id, props, parent } = component;
        const type = props["data-type"];
        
        const Component = componentMap[type];
        Component.displayName = type;
    
        if (!Component) {
            console.warn(`Компонент типа "${type}" не найден в реестре`);
            return null;
        }
        
        return (
            <Component
                { ...props }
                data-parent={parent}
                ref={(el) => {
                    if (el) refs.current[id] = el;
                }}
            />
        );
    }
    const addBlockToGrid = (data: BlockData) => {
        const newid = `cell-${Date.now()}`;
        
        Object.keys(data.layouts).forEach((breackpoint: 'lg'|'md'|'sm'|'xs') =>
            editorContext.layouts[breackpoint]?.set((prev) => {
                const layout = data.layouts[breackpoint];
                layout.i = newid;
                prev.push(layout);
            })
        );
        cellsSlice.set((next) => {
            next[newid] = data.content;
            return next;
        });
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
    const addComponentToCell = (cellId: string, component: DataRegisterComponent, nestedId?: number) => {
        const { Component, props } = component;
        const data = createDataComponent(props, cellId);

        cellsSlice.set((next) => {
            if (nestedId !== undefined) {
                next[cellId][nestedId].push(data);
            }
            else if(Array.isArray(next[cellId])) next[cellId].push(data);
            else next[cellId] = [data];
            
            return next;
        });
    }
    const useChangeIndex = (event: DragEndEvent, cellId: string) => {
        const { active, over } = event;
        if (!active || !over || active.id === over.id) return;

        const currentList = cellsSlice.get(true);
        const cell = currentList[cellId];

        // 🔍 Универсальный поиск в 1D или 2D массиве
        const findIndexes = (list: any) => {
            if (Array.isArray(list[0])) {
                // 2D
                for (let i = 0; i < list.length; i++) {
                    const idx = list[i].findIndex(comp => comp.props['data-id'] === active.id);
                    if (idx !== -1) {
                        return { outer: i, inner: idx, type: '2d' };
                    }
                }
            } 
            else {
                // 1D
                const idx = list.findIndex(comp => comp.props['data-id'] === active.id);
                if (idx !== -1) return { index: idx, type: '1d' };
            }
            return null;
        };
        const findTargetIndex = (list: any) => {
            if (Array.isArray(list[0])) {
                for (let i = 0; i < list.length; i++) {
                    const idx = list[i].findIndex(comp => comp.props['data-id'] === over.id);
                    if (idx !== -1) {
                        return { outer: i, inner: idx };
                    }
                }
            } 
            else {
                const idx = list.findIndex(comp => comp.props['data-id'] === over.id);
                if (idx !== -1) return { index: idx };
            }
            return null;
        };

        const from = findIndexes(cell);
        const to = findTargetIndex(cell);
        if (!from || !to) return;

        // ✅ Перемещение
        cellsSlice.set((draft) => {
            if (from.type === '1d' && 'index' in to) {
                draft[cellId] = arrayMove(draft[cellId], from.index, to.index);
            } 
            else if (from.type === '2d' && 'outer' in from && 'outer' in to) {
                const item = draft[cellId][from.outer][from.inner];
                draft[cellId][from.outer].splice(from.inner, 1);
                draft[cellId][to.outer].splice(to.inner, 0, item);
            }
        });

        // 👁️ Восстановление выделения
        if (cacheDrag.current) {
            document.querySelectorAll('[ref-id]').forEach(el => {
                if (el !== cacheDrag.current) el.classList.remove('editor-selected');
            });
            cacheDrag.current.classList.add('editor-selected');
            const id = cacheDrag.current.getAttribute('ref-id');

            if (id) {
                const all = Array.isArray(cell[0]) ? cell.flat() : cell;
                const findChild = all.find(child => child.props['data-id'] == id);
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
            useChangeIndex(event, cellId);
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
        // сброс блока
        else if (dropMeta?.type === 'grid' && dragData.type === 'block') {
            addBlockToGrid(dragData.data);
        }
        else if (over?.id) {
            const dragged = active.data?.current?.element;
            const type = active.data?.current?.type;
            const accepts = over?.data?.current?.dataTypesAccepts;

            // добавление из галереи компонентов
            if (dragged && type === 'element' && !accepts) {
                if(dropMeta?.nested) over.id = over.id.split(':')[0];
    
                editorContext.currentCell.set({ i: over.id });

                const ref = document.querySelector(`[data-id="${over.id}"]`);
                infoSlice.select.cell.set(ref);

                addComponentToCell(
                    over.id,
                    createComponentFromRegistry(active.id),
                    dropMeta?.nested?.index ?? undefined
                );
            }
        }

        setActiveDragElement(null); // очистка
    }
    const handleKeyboard =(e: KeyboardEvent)=> {
        const isMac = navigator.platform.toUpperCase().includes('MAC');
        const ctrlKey = isMac ? e.metaKey : e.ctrlKey;

        if (ctrlKey && e.key.toLowerCase() === 'z') {
            e.preventDefault();
            if (e.shiftKey) story.redo();
            else story.undo();
        }
        else if (ctrlKey && e.key.toLowerCase() === 'c') {
            const select = infoSlice.select.content?.get();

            if(select) {
                bufferSlice.type.set('component');
                bufferSlice.data.set(serrializeCopy(select));
                enqueueSnackbar('скопирован', {variant: 'default'});
            }
        }
        else if (ctrlKey && e.key.toLowerCase() === 'v') {
            if(bufferSlice.type.get() === 'component') {
                const curCell = editorContext.currentCell.get(); 
                const clone = bufferSlice.data.get(true);
                if(!curCell.i || !clone) return;

                clone.parent = curCell.i;
                clone.props['data-id'] = Date.now(); 

                cellsSlice.set((next) => {
                    if(Array.isArray(next[curCell.i])) next[curCell.i].push(clone);
                    else next[curCell.i] = [clone];
                    
                    return next;
                });
            }
        }
    }

    const getPreview = React.useCallback(() => {
        const meta = editorContext.meta.get();
        const project = infoSlice.projects[meta.project].get();
        const header = project.system.header;
        const footer = project.system.footer;
        

        return {
            theme,
            data: {
                header: header,
                body: {
                    layouts: structuredClone(editorContext.layouts.get()),
                    content: cellsSlice.get(true),
                    size: editorContext.size.get()
                },
                footer: footer,
                meta
            },
            prev: ()=> editorContext.mod.set('block')
        }
    }, [ctxTheme, theme]);
    useKeyboardListener((key: string)=> {
        if(key === 'NumLock') editorContext.lock.set((p)=> p = !p);
        
        const select = infoSlice.select.content.get();
        if (!select) return;

        
        if(key === 'ArrowUp') {
            setPadding('Top', select, 'decrement');
        }
        else if(key === 'ArrowDown') {
            setPadding('Top', select, 'increment');
        }
        else if(key === 'ArrowLeft') {
            setPadding('Left', select, 'decrement');
        }
        else if(key === 'ArrowRight') {
            setPadding('Left', select, 'increment');
        }
    });
    React.useEffect(() => {
        const themes = { taskade: taskadeTheme, light: lightTheme, dark: darkTheme };

        db.get('themes').then((saveThemes) => {
            const ctxTheme = settingsSlice.theme.get();
            const themeName = ctxTheme.currentTheme ?? 'dark';

            if (saveThemes && saveThemes[themeName]) {
                const themeCreate = createTheme(saveThemes[themeName]);
                setTheme(themeCreate);
            }
            else setTheme(themes[themeName]);
        });
    }, [ctxTheme]);
    React.useEffect(()=> {
        if (typeof window === 'undefined') return;
        window.addEventListener('keydown', handleKeyboard);

        return ()=> window.removeEventListener('keydown', handleKeyboard);
    }, []);
    
    
    return (
        <>
            {mod !== 'preview' &&
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
                        { mod === 'settings' && 
                            <LeftToolBarSettings
                                mod={currentToolPanel}
                                setMod={setCurrentToolPanel}
                            /> 
                        }

                        <div style={{ width: '80%', maxHeight: '100%', display: 'flex', flexDirection: 'column' }}>
                            <ToolBarInfo setShowBlocEditor={setShowBlocEditor} />
                            
                            { (mod === 'block' || mod === 'grid' || mod === 'actions') && 
                                <GridComponentEditor 
                                    desserealize={desserealize} 
                                    theme={theme}
                                /> 
                            }
                            { mod === 'settings' && 
                                <Settings 
                                    mod={currentToolPanel}
                                /> 
                            }
                        </div>
                    </div>
                </DndContext>
            }
            {mod === 'preview' && 
                <Preview { ...getPreview() } />
            }
        </>
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
        
        return saveBlockToFile(scope, name, (msg, type) => {
            enqueueSnackbar(msg, { variant: type });
            updateProjectState(scope, name);
        });
    }
    const handleChangeNestedContext = (editData: DataNested) => {
        const idComponent = nestedContextSlice.currentData.idParent.get();
        const idSlot = nestedContextSlice.currentData.idSlot.get();
        const findComponentSerrialize = getComponentById(idComponent);
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

    React.useLayoutEffect(() => {
        if (!meta.project) editorContext.meta.project.set('test');

        db.get(`projects`)
            .then((data)=> {
                infoSlice.projects.set(data);
                editorContext.dragEnabled.set(true);
            })
            .catch((err)=> {
                enqueueSnackbar(err, {variant: 'error'});
            });
    }, []);
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
        const handleArrow = (e) => {
            const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab'];
            if (arrowKeys.includes(e.key)) {
                e.preventDefault();
            }
        }
        const handleSpecialBlock =(data)=> {
            fileSaveFromDumpRender().then((res)=> {
                editorContext.meta.scope.set('system');
                editorContext.meta.name.set(data.type);
            });
        }

        window.addEventListener('keydown', handleArrow);
        EVENT.on('addGridContext', handle);
        EVENT.on('blockSettings', handleSpecialBlock);
        return () => {
            EVENT.off('addGridContext', handle);
            EVENT.off('blockSettings', handleSpecialBlock);
        }
    }, []);
    React.useEffect(() => {
        // Очищаем перед установкой нового блока
        cellsSlice.set({});
        editorContext.layouts.set({lg:[], md:[], sm:[], xs:[]});
        editorContext.size.set({ width: 1200, height: 800, breackpoint: 'lg' });
        infoSlice.select.content.set(null);
        
        
        setTimeout(() => {
            const projectData = infoSlice.projects[meta.project].get();
            const dataScope = projectData[meta.scope];
            
            const data = dataScope[meta.name];
            if(!dataScope || !data) return;

            const content = data.content ?? {};
            const layouts = { lg:[], md:[], sm:[], xs:[], ...data.layouts };
            const size = { width: 1200, height: 800, breackpoint: 'lg', ...data.size };

            // Устанавливаем
            cellsSlice.set(content);
            editorContext.layouts.set(layouts);
            editorContext.size.set(size);
            setIsLoad(true);
        }, 500);
    }, [meta.name, meta.scope, meta.project]);
    


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
            <div className="hidden">
                btn btn-primary btn-secondary btn-accent btn-error btn-success btn-warning btn-info btn-neutral
                btn-outline btn-dash btn-soft btn-ghost btn-link
                btn-xs btn-sm btn-md btn-lg btn-xl
                text-success text-warning text-error
            </div>
        </>
    );
}



/** 
 *  editorContext.layouts[breackpoint]?.set((prev) => {
            prev.map((lay) => {
                if (lay.i === cellId) {
                    lay.content = arrayMove(lay.content, oldIndex, newIndex);
                }
                return lay;
            });
        });
 */