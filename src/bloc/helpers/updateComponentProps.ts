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

    const render = renderSlice.get(true);

    const updated = render.map((layer) => {
        if (!Array.isArray(layer.content)) return layer;

        const i = layer.content.findIndex((c) => c?.props?.['data-id'] === id);
        if (i === -1) return layer;

        const current = layer.content[i];
        if (!current) return layer;

        try {
            const newComponent = {
                id: current.id,
                parent: current.parent,
                props: {
                    ...current.props,
                    ...data
                }
            };

            layer.content[i] = newComponent;
            return layer;
        }
        catch (e) {
            console.error('❌ Ошибка при клонировании компонента:', e, current);
            return layer;
        }
    });

    renderSlice.set(updated);
}


/** обновить slice project */
export const updateProjectState = (scope: string, name: string) => {
	const layouts = editorContext.layout.get();
	const size = editorContext.size.get();

	infoSlice.project.set((prev)=> {
		const data = {
			layout: layouts,					// текушая сетка
			content: cellsSlice.get(true),		// список компонентов в ячейках
			meta: {
				scope,
				name,
				updatedAt: Date.now(),
				preview: `snapshots/${scope}-${name}.png`
			},
			size: {
				width: size.width,
				height: size.height
			}
		}

		const currentScope = prev?.[scope];

		if(currentScope) {
			const findIndex = currentScope?.findIndex((x) => x.name === name);

			if(findIndex !== -1) {
				currentScope[findIndex].data = data;
			}
		}

		return prev;
	});
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