import React from 'react';
import { useDraggable, useDroppable, Modifier } from '@dnd-kit/core';
import { DropSlotProps, ComponentSerrialize } from '../type';
import { createStore } from 'statekit-lite';
import { componentMap } from '../modules/helpers/registry';

const activeSlot = createStore({});


export function DraggableToolItem({ id, type, dataType, element }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id,
        data: { 
            dataType,
            type,
            element 
        },
    });
    
    const style = {
        transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
        opacity: isDragging ? 0 : 1,
        zIndex: 1000,
        width: '100%'
    }


    return (
        <div 
            ref={setNodeRef} 
            {...attributes} 
            {...listeners} 
            style={style}
        >
            { element }
        </div>
    );
}
export function DragItemCopyElement({ activeDragElement }) {
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
                {...props}
            />
        );
    }

    return(
        <div 
            style={{ 
                transform: 'scale(0.9)', 
                pointerEvents: 'none',
                border: '1px solid #f7c640',
                borderRadius: '5px'
            }}
        >
            {React.isValidElement(activeDragElement)
                ? React.cloneElement(activeDragElement)
                : desserealize(activeDragElement)
            }
        </div>
    )
}



export function DropSlot({ id, dataTypesAccepts, children, onAdd }: DropSlotProps) {
    const { setNodeRef, isOver, active } = useDroppable({ 
        id,
        data: {
            type: 'slot',
            dataTypesAccepts,
            onAdd 
        }
    });
    
    const currentType = active?.data?.current?.dataType;
    const canDrop = isOver && dataTypesAccepts.includes(currentType);
    React.useEffect(() => {
        activeSlot.set({
            type: 'slot',
            dataTypesAccepts,
            onAdd
        });
    }, [isOver]);

    return (
        <div
            data-slot-id={id}
            ref={setNodeRef}
            style={{
                border: canDrop ? '1px dashed #4caf50' : '0px dashed #999',
                minHeight: 60,
                height: '100%',
                transition: 'background 0.15s',
                inset: 0,
                zIndex: 9999
            }}
        >
            { children }
        </div>
    );
}
export function DroppableCell({ id, children }) {
    const { setNodeRef, isOver, active } = useDroppable({ 
        id,
        data: {
            type: 'cell'
        },
    });
    
    //const style
    React.useEffect(() => {
        activeSlot.set(null);
    }, [isOver]);

    return (
        <div
            ref={setNodeRef}
            style={{
                border: isOver && '1px dashed lime',
                height: '100%',
                display: 'inline-flex',
                width: '100%',
                flexWrap: 'wrap',
                alignItems: 'stretch',
                alignContent: 'flex-start'
            }}
        >
            { children }
        </div>
    );
}
