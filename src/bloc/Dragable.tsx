import React from 'react';
import { useDraggable, useDroppable, Modifier } from '@dnd-kit/core';
import { DropSlotProps, ContextSlotProps, ProxyComponentName, ComponentSerrialize } from './type';
import { Box, IconButton } from '@mui/material';
import { Add, Input } from '@mui/icons-material';
import MiniRender from './nest-slot/MiniRender';
import { createStore } from 'statekit-lite';
import { componentMap } from './modules/helpers/registry';

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
            { React.isValidElement(activeDragElement)
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
export function ContextSlot({ idParent, idSlot, nestedComponentsList, data, type, style }: ContextSlotProps) {
    const handle = () => EVENT.emit('addGridContext', {
        nestedComponentsList,
        data: data ?? {},
        idParent,
        idSlot,
        isArea: type === 'Area'
    });
    
    const getStyle =()=> {
        if(type && type ==='Frame') return {
            position: 'absolute'
        }
    }
    

    return (
        <div
            style={{
                transition: 'background 0.15s',
                width: '100%',
                position: (type === 'Accordion') ? 'relative' : 'static',
                height: (type === 'Frame' || type === 'Area') ? '100%' : 'fit-content',
                background: '#00000026',
                marginTop: (type === 'Accordion') && 10,
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '45%',
                    zIndex: 9999,
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
                    type={type}
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
