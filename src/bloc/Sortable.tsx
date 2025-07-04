import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { editorContext, infoSlice, cellsSlice } from "./context";
import { SortableItemProps } from './type';
import useContextMenu from '@components/context-main';
import { updateComponentProps } from './helpers/updateComponentProps';
import { Delete, Edit, Star } from '@mui/icons-material';
import { db } from "./helpers/export";
import { specialComponents } from './config/category';
import { LinktoolBar, SlotToolBar } from './modules/helpers/Toolbar';
import { desserealize } from './helpers/sanitize';
import { statikRender } from './helpers/output';



export function SortableItem({ id, children, cellId, onSelectCell }: SortableItemProps) {
    const mod = editorContext.mod.use();
    const lock = editorContext.lock.use();
    const itemRef = React.useRef<HTMLDivElement>(null);
    const dragEnabled = editorContext.dragEnabled.use();
    const RenderElement = React.useMemo(() => desserealize(children), [children]);
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id,
        data: {
            type: 'sortable',
            cellId,
            element: children
        },
        disabled: (!dragEnabled || lock || mod === 'actions')        // ✅ глобальный флаг
    });
    

    const styleWrapper: React.CSSProperties = {
        boxSizing: 'border-box',
        position: 'relative',
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        width: children.props.fullWidth ? '100%' : (children.props.width ?? 300),
        //height: 'fit-content',
        display: 'flex',
        cursor: dragEnabled ? 'grab' : 'default',
        //alignItems: 'center',
        borderRight: !children.props.fullWidth && '1px dashed #98989810',
        transformOrigin: 'center',
        flexShrink: 0,
        flexBasis: children.props.fullWidth ? '100%' : (children.props.width ?? 30),
        maxWidth: '100%',
        padding: 1,
        pointerEvents: mod === 'grid' ? 'none' : 'auto'
    }
    const useDegidratationHandler = (code: string) => {
        console.log(code);
        statikRender(code, children);
    }
    const iseDeleteComponent = (ids: number) => {
        if (!id || !cellId) return;
        if (specialComponents.includes(children.props['data-type'])) return;

        cellsSlice.set((next) => {
            if (Array.isArray(next[cellId]?.[0])) {
                next[cellId].forEach((nest, index)=> {
                    next[cellId][index] = nest.filter((content) =>
                        content.props['data-id'] !== children.props?.['data-id']
                    );
                });
            }
            else next[cellId] = next[cellId].filter((content)=> 
                content.props['data-id'] !== children.props['data-id']
            );

            return next;
        });
        
        infoSlice.select.content.set(null);
    }
    // добавление в колекцию сохраненных
    const useAddToCollection = (ids: number) => {
        const name = prompt('Введите key name для компонента (не менее 3х символов)');
        if(name && name.length > 3) db.set(`blank.${name}`, children);
    }
    const handleClick = (target: HTMLDivElement) => {
        infoSlice.select.content.set(children);

        if (editorContext.currentCell.get()?.i !== cellId) {
            onSelectCell();
            const refCell = document.querySelector(`[data-id=${cellId}]`);

            if (refCell) infoSlice.select.cell.set(refCell);
            EVENT.emit('onSelectCell', cellId);
        }
        EVENT.emit('leftBarChange', {
            currentToolPanel: 'styles',
            force: true
        });

        requestIdleCallback(() => {
            target.classList.add('editor-selected');
        });

        document.querySelectorAll('[ref-id]').forEach(el => {
            if (el != target) el.classList.remove('editor-selected');
        });
    }
    const handleDoubleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        
        EVENT.emit('leftBarChange', {
            currentToolPanel: 'styles'
        });
    }
    const contextMenuItems = React.useMemo(() => [
        { 
            label: <div style={{color:'gold',fontSize:14}}>В заготовки</div>, 
            icon: <Star sx={{color:'gold',fontSize:18}} />, 
            onClick: (id)=> useAddToCollection(id), 
            showIf: (type)=> type === 'Card' 
        },
        { 
            label: <div style={{color:'gold',fontSize:14}}>export code</div>, 
            icon: <Star sx={{color:'gold',fontSize:18}} />, 
            onClick: (id)=> {
                sharedEmmiter.emit('degidratation.'+id, {
                    call: useDegidratationHandler
                })
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
                data: children.props
            }), 
        },
        { 
            label: <div style={{color:'red',fontSize:14}}>Удалить</div>, 
            icon: <Delete sx={{color:'red',fontSize:18}} />, 
            onClick: (id)=> iseDeleteComponent(id), 
        },
    ], [children]);
    const { menu, handleOpen } = useContextMenu(contextMenuItems);
    
    
    return (
        <React.Fragment>
            <div
                ref-id={id}
                ref-parent={children.parent}
                ref={(node) => {
                    setNodeRef(node);
                    itemRef.current = node;
                }}
                style={styleWrapper}
                {...attributes}
                {...(dragEnabled ? listeners : {})}
                onClick={(e)=> {
                    e.stopPropagation();
                    handleClick(e.currentTarget)
                }} 
                onDoubleClick={handleDoubleClick}
                onContextMenu={(e)=> {
                    e.stopPropagation();
                    handleClick(e.currentTarget);
                    handleOpen(e, {id, type: children.props['data-type']});
                }}
            >
                { mod === 'block' &&
                    <SlotToolBar
                        dataId={children.props['data-id']}
                        type={children.props['data-type']}
                        children={children}
                    />
                }
                
                { RenderElement }
            </div>
            
            { menu }
        </React.Fragment>
    );
}



/**
 *         { context.mod.get() === 'link' &&
                    <LinktoolBar 
                        dataId={children.props['data-id']}
                        subs={children.props['data-subs'] ?? []}
                        onChange={(data)=> updateComponentProps({component:children, data})}
                    />
                }
 */