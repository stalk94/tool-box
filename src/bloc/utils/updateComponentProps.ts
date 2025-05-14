import React from 'react';
import { Component, ComponentSerrialize } from '../type';
import { useEditorContext, useRenderState, useCellsContent, useInfoState } from "../context";

type Params = {
    component: Component;
    data: Record<string, any>;
    rerender?: boolean;
}


/** Запись свойств в компонент и список */
export function updateComponentProps({ component, data, rerender = true }: Params) {
    const context = useEditorContext();
    const cellsContent = useCellsContent();
    const infoState = useInfoState();
    const renderState = useRenderState();
    const id = component?.props?.['data-id'];
    const cellId = context.currentCell.get()?.i;

    if (!id || !cellId) {
        console.warn('updateComponentProps: отсутствует data-id или data-cell');
        return;
    }
    
    // 🧠 Обновляем данные в hookstate-кэше
    cellsContent.set((old) => {
        const index = old[cellId]?.findIndex((c) => c.id === id);
        if (index !== -1) {
            Object.entries(data).forEach(([key, value]) => {
                old[cellId][index].props[key] = value;
            });
        }
        return old;
    });

    // 🔁 Обновляем визуальный рендер через context.render
    if (rerender) renderState.set((layers) => {
        console.log('update props: ', component, data);
        
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
                    ...data,
                });

                console.log(updatedComponent)
                infoState.select?.content?.set(updatedComponent);         // fix
                layer.content[i] = updatedComponent;
            } 
            catch (e) {
                console.error('❌ Ошибка при клонировании компонента:', e, current);
            }

            return layer;
        });

        return [...updated];
    });
}