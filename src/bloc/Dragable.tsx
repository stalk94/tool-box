import React from 'react';
import { useDraggable, useDroppable, Modifier } from '@dnd-kit/core';
import { DropSlotProps, ContextSlotProps, ProxyComponentName } from './type';
import { Box, IconButton } from '@mui/material';
import { Add, Input } from '@mui/icons-material';
import MiniRender from './nest-slot/MiniRender';
import { createStore } from 'statekit-lite';

export const activeSlotState = createStore({} as {
    type: 'slot'
    dataTypesAccepts: ProxyComponentName[]
    onAdd: (component: Component) => void
});



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
        <span
            data-slot-id={id}
            ref={setNodeRef}
            style={{
                border: canDrop ? '1px dashed #4caf50' : '0px dashed #999',
                transition: 'background 0.15s',
                inset: 0,
                zIndex: 9999
            }}
        >
            { children }
        </span>
    );
}
// data - данные сетки слота
export function ContextSlot({ idParent, idSlot, nestedComponentsList, data }: ContextSlotProps) {
    const handle = () => EVENT.emit('addGridContext', {
        nestedComponentsList,
        data: data ?? {},
        idParent,
        idSlot
    });
    

    return (
        <div
            style={{
                position: 'relative',
                transition: 'background 0.15s',
                width: '100%',
                height: '100%',
                background: '#00000026',
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    transform: 'translate(-50%, -50%)',
                    top: '50%',
                    left: '50%',
                    zIndex: 4,
                }}
            >
                <IconButton
                    sx={{
                        border: '1px solid #ffffff7c',
                        background: '#ffffff12',
                        borderRadius: 2,
                        padding: '2px 12px',
                        cursor: 'pointer',
                        zIndex: 5,
                        opacity: 0.3,
                        fontSize: 14,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        transition: 'all 0.2s ease',
                        backdropFilter: 'blur(12px)',
                        '&:hover': {
                            opacity: 1,
                        }
                    }}
                    onClick={handle}
                >
                    <Input sx={{ color: '#ffffff9f' }} />
                </IconButton>
            </Box>

            { data.layout && data.layout[0] &&
                <MiniRender
                    size={data.size}
                    layouts={data.layout}
                    cellsContent={data.content}
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
