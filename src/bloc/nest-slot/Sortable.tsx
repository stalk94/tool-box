import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { editorSlice, infoSlice, renderSlice, cellsSlice } from "./context";
import { Component } from '../type';
import useContextMenu from '@components/context-main';
import { updateComponentProps, SlotToolBar } from './shim';
import { Delete, Edit, Star } from '@mui/icons-material';
import { serrialize } from '../helpers/sanitize';




export function SortableItem({ id, children, cellId }: { id: number, children: Component, cellId: string }) {;
    const itemRef = React.useRef<HTMLDivElement>(null);
    const dragEnabled = editorSlice.dragEnabled.use();
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ 
        id ,
        data: {
            type: 'sortable',
            cellId,
            element: children
        },
        disabled: !dragEnabled        // ✅ глобальный флаг
    });
    
    
    const styleWrapper: React.CSSProperties = {
        position: 'relative',
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        width: children.props.fullWidth ? '100%' : (children.props.width ?? 300),
        display: 'flex',
        cursor: dragEnabled ? 'grab' : 'default',
        alignItems: 'center',
        borderRight: '1px dotted #8580806b',
        transformOrigin: 'center',
        flexShrink: 0,
        flexBasis: children.props.fullWidth ? '100%' : (children.props.width ?? 100),
        maxWidth: '100%',
    }
    const useDegidratationHandler = (code: string) => {
        console.log(code)
    }
    const iseDeleteComponent = (ids: number) => {
        const removeCoponentFromCells = (componentIndex: number) => {
            cellsSlice.set((old) => {
                old[cellId].splice(componentIndex, 1);
                return old;
            });
        }
        const removeComponentFromCell = (cellId: string, componentIndex: number) => {
            renderSlice.set((prevRender) => {
                const cellIndex = prevRender.findIndex(item => item.i === cellId);

                if (cellIndex !== -1) {
                    if (Array.isArray(prevRender[cellIndex]?.content)) {
                        prevRender[cellIndex]?.content?.splice(componentIndex, 1);
                        removeCoponentFromCells(componentIndex);
                    }
                }
            });
        }

        const render = renderSlice.get();

        if (!id) return;

        const cellId = render.find((layer) =>
            layer.content?.some?.((c) => c.props?.['data-id'] === ids)
        )?.i;

        if (!cellId) return;

        const index = render.find((layer) => layer.i === cellId)
            ?.content?.findIndex((c) => c.props?.['data-id'] === ids);
        if (index === -1 || index === undefined) return;

        removeComponentFromCell(cellId, index);
        infoSlice.select.content.set(null);
    }
    const handleClick = (target: HTMLDivElement) => {
        const selectContent = infoSlice.select.content;
        
        requestIdleCallback(()=> {
            target.classList.add('editor-selected');
            selectContent.set(children);
        });
        
        document.querySelectorAll('[ref-id]').forEach(el => {
            if(el != target) el.classList.remove('editor-selected');
        });
    }

    
    const { menu, handleOpen } = useContextMenu([
        { 
            label: <div style={{color:'gold',fontSize:14}}>export code</div>, 
            icon: <Star sx={{color:'gold',fontSize:18}} />, 
            onClick: (id)=> {
                sharedEmmiter.emit('degidratation.'+id, {
                    call: useDegidratationHandler
                });
            }
        },
        { 
            label: <div style={{color:'#a8de82',fontSize:14}}>edit</div>, 
            icon: <Edit sx={{color:'#a8de82',fontSize:18}} />, 
            onClick: (id)=> EVENT.emit('jsonRender', {
                call: (data)=> updateComponentProps({
                    component: { props: children.props }, 
                    data: {...data}
                }),
                data: serrialize(children, cellId).props
            }), 
        },
        { 
            label: <div style={{color:'red',fontSize:14}}>Удалить</div>, 
            icon: <Delete sx={{color:'red',fontSize:18}} />, 
            onClick: (id)=> iseDeleteComponent(id), 
        },
    ]);
    
    

    return (
        <React.Fragment>
            <div
                ref-id={id}
                ref-parent={children.type.parent}
                ref={(node) => {
                    setNodeRef(node);
                    itemRef.current = node;
                }}
                style={styleWrapper}
                {...attributes}
                {...(dragEnabled ? listeners : {})}
                onClick={(e)=> handleClick(e.currentTarget)} 
                onContextMenu={(e)=> {
                    e.stopPropagation();
                    handleOpen(e, {id, type: children.props['data-type']});
                    handleClick(e.currentTarget);
                }}
            >
                <SlotToolBar
                    dataId={children.props['data-id']}
                    type={children.props['data-type']}
                    onChange={console.log}
                />
                
                { children }
            </div>
            { menu }
        </React.Fragment>
    );
}