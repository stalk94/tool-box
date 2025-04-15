import React from 'react';
import { ContentFromCell, ComponentSerrialize } from '../type';

type Params = {
    component: ContentFromCell,
    data: Record<string, any>,
    cellId: string,
    cellsCache: any,
    setRender: React.Dispatch<React.SetStateAction<any>>,
    rerender?: boolean
}

//! иногда бывает фатальный вылет либо не применяются на дампе изменения редактора (надо выловить)
export function updateComponentProps({component, data, cellId, cellsCache, setRender, rerender = true}: Params) {
    const id = component.props['data-id'];
    
    if (!id) {
        console.warn('updateComponentProps: компонент без data-id');
        return;
    }

    // Обновляем в hookstate (данные)
    cellsCache.set((old) => {
        const index = old[cellId]?.findIndex((c) => c.id === id);

        if (index !== -1) {
            Object.entries(data).forEach(([key, value]) => {
                old[cellId][index].props[key] = value;
            });
        }
        return old;
    });

    if (!rerender) return;

    // Обновляем в render (визуально)
    setRender((layers) => {
        const updated = layers.map((layer) => {
            if (!Array.isArray(layer.content)) return layer;

            const i = layer.content.findIndex((c) => c?.props?.['data-id'] === id);
            if (i === -1) return layer;

            const current = layer.content[i];
            if (!current) {
                console.warn('updateComponentProps: компонент не найден в render');
                return layer;
            }

            try {
                const updatedComponent = React.cloneElement(current, {
                    ...current.props,
                    ...data
                });
                layer.content[i] = updatedComponent;
            } catch (e) {
                console.error('❌ Ошибка при клонировании компонента:', e, current);
            }

            return layer;
        });

        return [...updated];
    });
}