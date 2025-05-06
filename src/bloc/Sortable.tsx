import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useEditorContext, useRenderState, useCellsContent, useInfoState } from "./context";
import { useHookstate } from '@hookstate/core';
import { Component } from './type';
import useContextMenu from '@components/context-main';
import { Delete, Edit } from '@mui/icons-material';


//! особые условия стилей для компонентов (!это костыли, вся логика в обертки идет)
class Styler {
    ref: Element
    styleWrapper: React.CSSProperties
    children: Component

    constructor(children, styleWrapper) {
        this.ref = document.querySelector(`[data-id="${children.props['data-id']}"]`);
        this.styleWrapper = styleWrapper;
        this.children = children;
        this.type = this.children.props['data-type'];
        this.init();
    }
    Typography() {
        this.ref.style.width = '100%'
    }
    init() {
        const childProps = this.children.props;

        if(childProps.style) {
            const style = childProps.style;
            
            if(childProps.fullWidth) {
                this.styleWrapper.display === 'block'
                this.styleWrapper.display = 'flex';
                this.styleWrapper.width = '100%';

                if(this.ref) {
                    if(this[this.type]) this[this.type]();
                    // что бы кнопка с иконками не ратекелась
                    this.ref.style.display = 'flex';
                }
            }
        }
    }
}


export function SortableItem({ id, children }: { id: number, children: Component }) {
    const info = useHookstate(useInfoState());
    const context = useHookstate(useEditorContext());
    const renderState = useHookstate(useRenderState());
    const cellsContent = useHookstate(useCellsContent());
    const itemRef = React.useRef<HTMLDivElement>(null);
    const selectContent = info.select.content;
    const dragEnabled = context.dragEnabled;
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ 
        id ,
        disabled: !dragEnabled.get()        // ✅ глобальный флаг
    });

   
    const styleWrapper: React.CSSProperties = {
        position: 'relative',
        transform: CSS.Transform.toString(transform),
        transition,
        //marginTop: 3,
        opacity: isDragging ? 0.5 : 1,
        width: children.props.fullWidth ? (children.props.width ?? '100%') : 'fit-content',
        height: 'fit-content',
        display: 'inline-flex',
        verticalAlign: 'top',
        cursor: dragEnabled.get() ? 'grab' : 'default',
        // для отладки
        //paddingTop: 3,
        //paddingBottom: 3,
        borderRight: '1px dotted #8580806b',
        transformOrigin: 'center',
        
    }
    const iseDeleteComponent =(ids: number)=> {
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
            label: <div style={{color:'red',fontSize:14}}>Удалить</div>, 
            icon: <Delete sx={{color:'red',fontSize:18}} />, 
            onClick: (id)=> iseDeleteComponent(id), 
        }
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
                    handleOpen(e, id);
                    handleClick(e.currentTarget);
                }}
            >
                { children }
            </div>
            { menu }
        </React.Fragment>
    );
}