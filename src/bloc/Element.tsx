import React from "react";
import Draggable, { DraggableData } from 'react-draggable';
import context, { cellsContent, infoState } from './context';
import { hookstate, useHookstate } from "@hookstate/core";
import { Component, DraggbleElementProps } from './type';
import { throttle } from "lodash";


// ! убираем пока второй draggable
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
    
            const refWrapper = refWrapperX.current;
            const refCellContainer = document.querySelector(`[data-id="${cellId}"]`);
    
            if (refCellContainer) {
                const wrX = refCellContainer.querySelectorAll(`.Wrapper-x`);
                const wrY = refCellContainer.querySelectorAll(`.Wrapper-y`);
    
                [...wrX].forEach((el) => {
                    if (el.id !== String(index)) {
                        // const result = utill.getOverlap(refWrapperX.current, el);
                    }
                });
            }
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
                <Draggable ref={refWrapperX}
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