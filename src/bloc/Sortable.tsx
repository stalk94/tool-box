import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import context, { infoState, renderState } from './context'; 

type Props = {
    id: string;
    children: React.ReactNode;
}


export function SortableItem({ id, children }: Props) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        width: '100%',
        cursor: 'grab',
    }
    const handleClick = () => {
        // Ищем компонент в render по id
        const all = renderState.get({ noproxy: true });
        const found = all
            .flatMap(layer => layer.content ?? [])
            .find(comp => comp?.props?.['data-id'] === id);

        if (found) {
            infoState.select.content.set(found);

            // Визуально подсветим
            document.querySelectorAll('[data-id]').forEach(el => {
                el.classList.remove('editor-selected');
            });
            const el = document.querySelector(`[data-id="${id}"]`);
            if (el) el.classList.add('editor-selected');
        }
    }


    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={handleClick} 
        >
            { children }
        </div>
    );
}