'use client'
import React from "react";
import * as htmlToImage from 'html-to-image';
import { LayoutCustom, ComponentSerrialize, Component } from './type';
import "react-grid-layout/css/styles.css";
import { useEditorContext, useRenderState, useCellsContent, useInfoState } from "./context";
import { hookstate, useHookstate } from "@hookstate/core";
import { ToolBarInfo } from './Top-bar';
import { componentMap } from './modules/utils/registry';
import Tools from './Left-bar';
import GridComponentEditor from './Editor-grid';
import { saveBlockToFile, fetchFolders } from "./utils/export";
import { serializeJSX } from './utils/sanitize';
import EventEmitter from "../app/emiter";
import { useSafeAsync, useSafeAsyncEffect } from "./utils/usePopUp";


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
if(!globalThis.EVENT) globalThis.EVENT = new EventEmitter();



// это редактор блоков сетки
export default function Block({ setShowBlocEditor }) {
    globalThis.ZOOM = 1;                                                // в редакторе блоков зум отключаем
    const ctx = useHookstate(useEditorContext());
    const refs = React.useRef({});                                   // список всех рефов на все компоненты
    const render = useHookstate(useRenderState());
    const info = useHookstate(useInfoState());                             // данные по выделенным обьектам
    const curCell = ctx.currentCell;                                    // текушая выбранная ячейка
    const cellsCache = useHookstate(useCellsContent());                   // элементы в ячейках (dump из localStorage)
    
   
    const snapshotAndUpload = async (name: string) => {
        const node = document.querySelector('.GRID-EDITOR') as HTMLElement | null;

        if (!node) {
            console.warn('❗ Элемент .GRID-EDITOR не найден');
            return;
        }

        try {
            const dataUrl = await htmlToImage.toPng(node, {
                cacheBust: true,
                backgroundColor: '#222222',
            });

            // Преобразуем base64 в Blob
            const res = await fetch(dataUrl);
            const blob = await res.blob();

            const formData = new FormData();
            formData.append('image', blob, `${name}.png`);

            const uploadRes = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const result = await uploadRes.json();
            console.log('✅ Успешно загружено:', result);
        } 
        catch (err) {
            console.error('❌ Ошибка при создании или загрузке изображения:', err);
        }
    }
    const dumpRender = () => {
        const name = ctx.meta.name.get();
        const scope = ctx.meta.scope.get();
        snapshotAndUpload(`${scope}-${name}`);
        saveBlockToFile(scope, name);
    }
    const desserealize = (component: ComponentSerrialize) => {
        const { id, props, functions, parent } = component;
        const type = props["data-type"];
        //console.log(component)
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
  


    return(
        <div style={{width: '100%', height: '100%', display: 'flex', flexDirection: 'row'}}>
            <Tools
                desserealize={desserealize}
                useDump={dumpRender}
                addComponentToLayout={addComponentToLayout}
            />
            <div style={{width: '80%', height: '100%', display: 'flex', flexDirection: 'column'}}>
                <ToolBarInfo setShowBlocEditor={setShowBlocEditor} />
                
                <GridComponentEditor
                    desserealize={desserealize}
                />
            </div>
        </div>
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