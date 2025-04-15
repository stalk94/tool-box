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


export function updateComponentProps({component, data, cellId, cellsCache, setRender, rerender = true}: Params) {
    const id = component.props['data-id'];

    // обновляем данные в store
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

    // обновляем рендер
    setRender((layers) => {
        const updated = layers.map((layer) => {
            if (Array.isArray(layer.content)) {
                const i = layer.content.findIndex((c) => c.props['data-id'] === id);
                if (i !== -1) {
                    const updatedComponent = React.cloneElement(component, {
                        ...component.props,
                        ...data
                    });
                    layer.content[i] = updatedComponent;
                }
            }
            return layer;
        });

        return [...updated];
    });
}