import React, { useRef } from 'react';
import { IconButton, Paper, Typography } from '@mui/material';
import { useDroppable, DndContext, useSensors, useSensor, PointerSensor, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { arrayMove } from '@dnd-kit/sortable';
import { useHookstate } from '@hookstate/core';
import { infoState, renderState } from '../../context';
import { SortableItem } from '../../Sortable';
import { useParentCellSize } from '../utils/hooks';
import { deserializeJSX } from '../../utils/sanitize';
import { componentMap } from '../utils/registry';
import context, { cellsContent } from '../../context';
import { Delete } from '@mui/icons-material';
import { createPortal } from 'react-dom';
const iconRoot = document.getElementById('editor-delete-root'); 

export type BlockWrapperProps = {
    elevation: number
    direction: 'row' | 'column'
    padding: number
    background: string
}


/**
 * 
 */
export const BlockWrapper = React.forwardRef((props: BlockWrapperProps, ref) => {
    const localRef = useRef<HTMLDivElement>(null);
    const refs = useRef<Record<number, HTMLElement | null>>({});
    const selected = useHookstate(infoState.select);
    const curCell = useHookstate(context.currentCell);
    const [hovered, setHovered] = React.useState<number | null>(null);
    const {
        elevation = 2,
        direction = 'column',
        padding = 16,
        background = '#ffffff17',
        gap = 2,
        content = [],
        style = {},
        ...rest
    } = props;

    const id = props['data-id'];
    const { setNodeRef } = useDroppable({ id: `block-${id}` });
    const selectedContent = selected.content.get({ noproxy: true });
    const { width } = useParentCellSize(localRef);

    const layoutStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: direction,
        padding,
        gap,
        background,
        borderRadius: 8,
        width: width - 4,
        border: selectedContent?.props?.['data-id'] === id && '2px solid #90caf9',
        transition: 'border 0.3s',
        minHeight: 60,
        ...style,
    }
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
    );
    const resolvedContent = content.map((item) =>
        React.isValidElement(item) ? item : deserializeJSX(item, componentMap)
    );
    const handleInnerDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!active || !over || active.id === over.id) return;

        const oldIndex = resolvedContent.findIndex((c) => c.props['data-id'] === active.id);
        const newIndex = resolvedContent.findIndex((c) => c.props['data-id'] === over.id);
        console.log('🔥 DRAG END');
        console.log('active', active.id);
        console.log('over', over.id);
        if (oldIndex === -1 || newIndex === -1) return;

        const updated = arrayMove(resolvedContent, oldIndex, newIndex);

        renderState.set((prev) => {
            const updatedRender = [...prev];
            const layer = updatedRender.find((l) => l.i === curCell.get()?.i);
            if (!layer) return prev;

            const blockIndex = layer.content.findIndex((comp) => comp?.props?.['data-id'] === id);
            if (blockIndex === -1) return prev;

            const block = layer.content[blockIndex];

            const newBlock = React.cloneElement(block, {
                ...block.props,
                content: updated,
            });

            layer.content[blockIndex] = newBlock;
            return updatedRender;
        });
    }
    const handleDeleteChild = (childId: number) => {
        renderState.set((prev) => {
            const updated = [...prev];
            const layer = updated.find((l) => l.i === curCell.get()?.i);
            if (!layer) return prev;

            const blockIndex = layer.content.findIndex(
                (comp) => comp?.props?.['data-id'] === id
            );
            if (blockIndex === -1) return prev;

            const block = layer.content[blockIndex];

            const updatedContent = block.props.content.filter(
                (child) => child.props['data-id'] !== childId
            );

            const updatedBlock = React.cloneElement(block, {
                ...block.props,
                content: updatedContent,
            });

            layer.content[blockIndex] = updatedBlock;
            return updated;
        });
        cellsContent.set((prev) => {
            const cellId = curCell.get()?.i;
            if (!cellId) return prev;

            const layer = prev[cellId];
            if (!layer) return prev;

            const block = layer.find((c) => c.props['data-id'] === id);
            if (!block) return prev;

            if (!Array.isArray(block.props.content)) return prev;

            block.props.content = block.props.content.filter(
                (child) => child.props['data-id'] !== childId
            );

            return prev;
        });

        infoState.select.content.set(null);
    }
    const onPointerLeave = (e: React.PointerEvent) => {
        const related = e.relatedTarget as HTMLElement | null;

        // Проверяем: если ушли НЕ на иконку и НЕ на компонент
        const isStillInside = related?.closest('[data-id="' + hovered + '"]') ||
            related?.closest('.block-delete-btn');

        if (!isStillInside) {
            setHovered(null);
        }
    }


    return (
        <>
            <Paper
                ref={(node) => {
                    setNodeRef(node);
                    localRef.current = node;
                    if (ref) {
                        if (typeof ref === 'function') ref(node);
                        else (ref as React.RefObject<any>).current = node;
                    }
                }}
                data-id={id}
                data-type="Block"
                elevation={elevation}
                style={layoutStyle}
                {...rest}
            >
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleInnerDragEnd}
                >
                    <SortableContext
                        items={resolvedContent.map((child) => child.props['data-id'])}
                        strategy={rectSortingStrategy}
                        id={`block-${id}`}
                    >
                        { resolvedContent.length > 0 ? (
                            resolvedContent.map((child: any) => (
                                <SortableItem 
                                    key={child.props['data-id']} 
                                    id={child.props['data-id']}
                                    onPointerEnter={() => setHovered(child.props['data-id'])}
                                    onPointerLeave={onPointerLeave}
                                >
                                    {React.cloneElement(child, {
                                        ref: (el: HTMLElement | null) => {
                                            refs.current[child.props['data-id']] = el;
                                        }
                                    })}
                                </SortableItem>
                            ))
                        ) : (
                            <Typography variant="caption" color="textSecondary">
                                Здесь можно размешать компоненты
                            </Typography>
                        )}
                    </SortableContext>
                </DndContext>
            </Paper>

            { hovered !== null && refs.current?.[hovered] && iconRoot &&
                createPortal(
                    <IconButton
                        className="block-delete-btn"
                        size="small"
                        onClick={() => handleDeleteChild(hovered)}
                        onPointerEnter={() => {}}
                        onPointerLeave={onPointerLeave}
                        sx={{
                            position: 'absolute',
                            top: refs.current[hovered]?.getBoundingClientRect().top + window.scrollY-10 ?? 0,
                            left: refs.current[hovered]?.getBoundingClientRect().left + refs.current[hovered]?.getBoundingClientRect().width - 18 ?? 0,
                            zIndex: 9999,
                            background: '#282828',
                            border: '1px solid #05050545',
                            p: 0.5
                        }}
                    >
                        <Delete sx={{color:'#fc1d1d'}} fontSize="small" />
                    </IconButton>,
                    iconRoot
                )
            }
        </>
    );
});
