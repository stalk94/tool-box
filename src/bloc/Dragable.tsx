import React from 'react';
import { useDraggable, useDroppable, Modifier } from '@dnd-kit/core';
import { DropSlotProps, ContextSlotProps } from './type';
import { hookstate } from '@hookstate/core';
import { IconButton } from '@mui/material';
import { Add } from '@mui/icons-material';
import MiniRender from './nest-slot/MiniRender';
export const activeSlotState = hookstate(null);



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
    
    return(
        <div 
            style={{ 
                transform: 'scale(0.9)', 
                pointerEvents: 'none',
                border: '1px solid #f7c640',
                borderRadius: '5px'
            }}
        >
            { React.cloneElement(activeDragElement) }
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
        activeSlotState.set({
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
// data - данные сетки слота
export function ContextSlot({ idParent, idSlot, nestedComponentsList, children, data }: ContextSlotProps) {
    const handle = () => EVENT.emit('addGridContext', {
        nestedComponentsList,
        data: data ?? {},
        idParent,
        idSlot
    });

    return (
        <div
            style={{
                border: '1px dashed #4b9ec85a',
                transition: 'background 0.15s',
                inset: 0,
                zIndex: 9999,
                display: 'flex'
            }}
        >
            {!data.layout &&
                <IconButton sx={{ margin:'auto' }}
                    onClick={handle}
                >
                    <Add />
                </IconButton>
            }

            {data.layout &&  
                <MiniRender
                    onClick={handle}
                    size={data.size}
                    layouts={data.layout}
                />
            }
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
        activeSlotState.set(null);
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
