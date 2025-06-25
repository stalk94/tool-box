import { useEffect } from 'react';
import { editorContext, infoSlice, cellsSlice, settingsSlice } from "../context";
import { Story } from '../type';


export function useKeyboardListener(callback: (key: string) => void) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            callback(e.key);
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [callback]);
}


export const story = {
    max: 50,
    future: <Story[]>[],
    old: <Story[]>[],

    init() {
        const dump = settingsSlice.story.get(true);
        Object.assign(story, dump);
    },
    addOld() {
        story.old.push({
            ctx: structuredClone(editorContext.get()),
            cells: cellsSlice.get(true),
        });

        if (story.old.length > story.max) {
            story.old.shift(); // удаляем самый старый
        }

        // Сбросить future, если ты вносишь новое изменение
        story.future = [];
    },
    undo() {
        if (story.old.length === 0) return;

        story.future.push({
            ctx: structuredClone(editorContext.get()),
            cells: cellsSlice.get(true),
        });

        if (story.future.length > story.max) {
            story.future.shift();
        }

        const last = story.old.pop();
        if (!last) return;

        // Восстанавливаем всё аккуратно, по ключам (см. предыдущий ответ)
        editorContext.layouts.set(last.ctx.layouts);
        editorContext.size.set(last.ctx.size);
        cellsSlice.set(last.cells);
    },
    redo() {
        if (story.future.length === 0) return;

        story.old.push({
            ctx: structuredClone(editorContext.get()),
            cells: cellsSlice.get(true),
        });

        if (story.old.length > story.max) {
            story.old.shift();
        }

        const next = story.future.pop();
        if (!next) return;

        editorContext.layouts.set(next.ctx.layouts);
        editorContext.size.set(next.ctx.size);
        cellsSlice.set(next.cells);
    }
}