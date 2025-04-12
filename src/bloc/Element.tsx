import React from "react";
import Draggable, { DraggableData } from 'react-draggable';
import context, { cellsContent, infoState } from './context';
import { hookstate, useHookstate } from "@hookstate/core";
import { Component, DraggbleElementProps } from './type';
import { throttle } from "lodash";
import { utill } from "./config/utill";


const DragableElement = ({ component, index, cellId, useStop }: DraggbleElementProps) => {
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
    const handlerStop = throttle((data: DraggableData, component: Component, axis: 'x' | 'y')=> {
        onStop(data, component, axis);

        const refWrapper = refWrapperX.current;
        const refCellContainer = document.querySelector(`[data-id="${cellId}"]`);

        if(refCellContainer) {
            const wrX = refCellContainer.querySelectorAll(`.Wrapper-x`);
            const wrY = refCellContainer.querySelectorAll(`.Wrapper-y`);

            [...wrX].map((el)=> {
                if(el.id !== String(index)) {
                    //const result = utill.getOverlap(refWrapperX.current, el);

                }
            });
        }
    }, 200)
    const useSetClassRef = (id: number | string, className: string) => {
        const ref = document.querySelector(`[data-id="${id}"]`);

        setTimeout(() => {
            if (ref) ref.classList.add('editor-' + className);
        }, 500);
    }
    const useRemoveClassRef = (id: number | string | 'all', className?: string) => {
        if(id === 'all') Object.keys(cellsCache.get()).forEach((idCell)=> {
            cellsCache.get()[idCell].forEach((content)=> {
                const ref = document.querySelector(`[data-id="${content.id}"]`);

                if (ref) ref.classList.forEach((className: string) => {
                    if (className.includes('editor-')) ref.classList.remove(className);
                });
            });
        });
        else {
            const ref = document.querySelector(`[data-id="${id}"]`);
            if (ref) ref.classList.forEach((className: string) => {
                if (className.includes('editor-')) ref.classList.remove(className);
            });
        }
    }
    React.useEffect(()=> {
        console.log('rerender')
        
    }, []);
    
    

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
                useSetClassRef(component.props['data-id'], 'blink');
            }}
            onStop={(e, data) => handlerStop(data, component, 'y')}
        >
            <div 
                id={index}
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
                    onStart={(e, data) => {
                        component._store.index = index;
                        info.select.content.set(component);
                        useRemoveClassRef('all');
                        useSetClassRef(component.props['data-id'], 'blink');
                    }}
                    onStop={(e, data) => handlerStop(data, component, 'x')}
                >
                <div 
                    id={index}
                    className="Wrapper-x" 
                    //ref={refWrapperX} 
                    style={{width: 'fit-content'}}
                >
                    { component }
                </div>
                </Draggable>
            </div>

        </Draggable>
    );
}


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