import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useEditorContext, useRenderState, useCellsContent, useInfoState } from "./context";
import { useHookstate } from '@hookstate/core';
import { Component } from './type';
import useContextMenu from '@components/context-main';
import { updateComponentProps } from './utils/updateComponentProps';
import { Delete, Edit, Star } from '@mui/icons-material';
import { db } from "./utils/export";
import { serializeJSX, serrialize } from './utils/sanitize';
import { LinktoolBar, SlotToolBar } from './modules/utils/Toolbar';



export function SortableItem({ id, children, cellId }: { id: number, children: Component, cellId: string }) {
    const info = useHookstate(useInfoState());
    const context = useHookstate(useEditorContext());
    const renderState = useHookstate(useRenderState());
    const cellsContent = useHookstate(useCellsContent());
    const itemRef = React.useRef<HTMLDivElement>(null);
    const selectContent = info.select.content;
    const dragEnabled = context.dragEnabled;
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ 
        id ,
        data: {
            type: 'sortable',
            cellId,
            element: children
        },
        disabled: !dragEnabled.get()        // ✅ глобальный флаг
    });
    

    if(children.props.width) console.log(children.props);
    //console.log(EDITOR);

    const styleWrapper: React.CSSProperties = {
        position: 'relative',
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        width: children.props.fullWidth ? '100%' : (children.props.width ?? 300),
        display: 'flex',
        cursor: dragEnabled.get() ? 'grab' : 'default',
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
        const removeComponentFromCell = (cellId: string, componentIndex: number) => {
            renderState.set((prev) => {
                const updatedRender = [...prev];
                const cellIndex = updatedRender.findIndex(item => item.i === cellId);

                if (cellIndex !== -1) {
                    if (Array.isArray(updatedRender[cellIndex]?.content)) {
                        // Удаляем компонент из ячейки
                        updatedRender[cellIndex]?.content?.splice(componentIndex, 1);
                        // обновим наш dump
                        cellsContent.set((old) => {
                            old[cellId].splice(componentIndex, 1);

                            return old;
                        });
                    }
                }

                return updatedRender;
            });
        }

        const render = renderState.get({ noproxy: true });

        if (!id) return;

        const cellId = render.find((layer) =>
            layer.content?.some?.((c) => c.props?.['data-id'] === ids)
        )?.i;

        if (!cellId) return;

        const index = render.find((layer) => layer.i === cellId)
            ?.content?.findIndex((c) => c.props?.['data-id'] === ids);
        if (index === -1 || index === undefined) return;

        removeComponentFromCell(cellId, index);
        selectContent.set(null);
    }
    const useAddToCollection = (ids: number) => {
        const serialize =()=> {
            const rawProps = { ...children.props };
            const type = rawProps['data-type'];
            const id = rawProps['data-id'];

            delete rawProps.ref;
            const cleanedProps = serializeJSX(rawProps);
            console.log(cleanedProps)

            return {
                id,
                props: {
                    ...cleanedProps,
                    'data-id': id,
                    'data-type': type,
                }
            };
        }

        const name = prompt('Введите key name для компонента (не менее 3х символов)');
        if(name && name.length > 3) db.set(`blank.${name}`, serialize());
    }
    const handleClick = (target: HTMLDivElement) => {
        requestIdleCallback(()=> {
            target.classList.add('editor-selected');
            selectContent.set(children);

            EVENT.emit('leftBarChange', {
                currentToolPanel: 'component'
            })
        });
        
        document.querySelectorAll('[ref-id]').forEach(el => {
            if(el != target) el.classList.remove('editor-selected');
        });
    }
    React.useEffect(() => {
        const handler = (cellId)=> {
            document.querySelectorAll('[ref-id]').forEach(el => {
                if(el.getAttribute('ref-parent') !== String(cellId)) {
                    el.classList.remove('editor-selected');
                }
            });
        }

        EVENT.on('onSelectCell', handler);
        return ()=> EVENT.off('onSelectCell', handler);
    }, []);

    
    const { menu, handleOpen } = useContextMenu([
        { 
            label: <div style={{color:'gold',fontSize:14}}>В заготовки</div>, 
            icon: <Star sx={{color:'gold',fontSize:18}} />, 
            onClick: (id)=> useAddToCollection(id), 
            showIf: (type)=> type==='Card' 
        },
        { 
            label: <div style={{color:'gold',fontSize:14}}>export code</div>, 
            icon: <Star sx={{color:'gold',fontSize:18}} />, 
            onClick: (id)=> {
                sharedEmmiter.emit('degidratation.'+id, {call: useDegidratationHandler})
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
                {...(dragEnabled.get() ? listeners : {})}
                onClick={(e)=> handleClick(e.currentTarget)} 
                onContextMenu={(e)=> {
                    e.stopPropagation();
                    handleOpen(e, {id, type: children.props['data-type']});
                    handleClick(e.currentTarget);
                }}
            >
                { context.mod.get() === 'link' &&
                    <LinktoolBar 
                        dataId={children.props['data-id']}
                        subs={children.props['data-subs'] ?? []}
                        onChange={(data)=> updateComponentProps({component:children, data})}
                    />
                }
               
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