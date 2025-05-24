import React from 'react';
import { Component, ComponentSerrialize } from '../type';
import { editorContext, infoSlice, renderSlice, cellsSlice } from "../context";


type Params = {
    component: Component;
    data: Record<string, any>;
    rerender?: boolean;
}


///////////////////////////////////////////////////////////////////////////////////
// ВАЖНАЯ ФУНКЦИЯ ЖИЗНЕННОГО ЦИКЛА
///////////////////////////////////////////////////////////////////////////////////
export function updateComponentProps({ component, data, rerender = true }: Params) {
    const id = component?.props?.['data-id'];
    const cellId = editorContext.currentCell.get()?.i;

    if (!id || !cellId) {
        console.warn('updateComponentProps: отсутствует data-id или data-cell');
        return;
    }
    
    cellsSlice.set((old) => {
        const index = old[cellId]?.findIndex((c) => c.id === id);

        if (index !== -1) {
            Object.entries(data).forEach(([key, value]) => {
                old[cellId][index].props[key] = value;
            });
        }
        return old;
    });

    // 🔁 Обновляем визуальный рендер через context.render
    let updatedComponent: React.ReactElement | null = null;
    const render = renderSlice.get();

    const updated = render.map((layer) => {
        if (!Array.isArray(layer.content)) return layer;

        const i = layer.content.findIndex((c) => c?.props?.['data-id'] === id);
        if (i === -1) return layer;

        const current = layer.content[i];
        if (!current) return layer;

        try {
            const { ref, ...safeProps } = current.props ?? {};

            updatedComponent = React.cloneElement(current, {
                ...safeProps,
                ...data
            });

            const newContent = [
                ...layer.content.slice(0, i),
                updatedComponent,
                ...layer.content.slice(i + 1),
            ];

            console.log(newContent);

            return {
                ...layer,
                content: newContent
            }
        }
        catch (e) {
            console.error('❌ Ошибка при клонировании компонента:', e, current);
            return layer;
        }
    });

    renderSlice.set(updated);
    

    // 🛠 вне renderSlice.set()
    if (updatedComponent) {
        infoSlice.select?.content?.set(updatedComponent);
    }
}

// !
export function updateCelltProps(data) {
    const cellId = editorContext.currentCell.get()?.i;

    if (!cellId) {
        console.warn('updateCellProps: отсутствует data-cell');
        return;
    }
    
    // 🔁 Обновляем визуальный рендер через context.render
    renderSlice.set((layers) => {
        const updated = layers.map((layer) => {
            if (layer.i !== cellId) return layer;
           
            const newLayerProps = { ...layer.props, ...data }

            return { ...layer, props: newLayerProps };
        });

        editorContext.layout.set(updated);
        return [...updated];
    });
}