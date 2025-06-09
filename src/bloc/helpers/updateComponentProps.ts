import React from 'react';
import { Component, ComponentSerrialize } from '../type';
import { editorContext, infoSlice, cellsSlice } from "../context";


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
        const index = old[cellId]?.findIndex((component) => component.id === id);

        if (index !== -1) {
            Object.entries(data).forEach(([key, value]) => {
                old[cellId][index].props[key] = value;
            });
        }

        return old;
    });
}


/** обновить slice project */
export const updateProjectState = (scope: string, name: string) => {
	const layouts = editorContext.layouts.get();
	const size = editorContext.size.get();

	infoSlice.project.set((prev)=> {
		const data = {
			layouts: layouts,					// текушая сетка
			content: cellsSlice.get(true),		// список компонентов в ячейках
			meta: {
				scope,
				name,
				updatedAt: Date.now(),
				preview: `snapshots/${scope}-${name}.png`
			},
			size: {
				width: size.width,
				height: size.height,
				breackpoint: 'lg'
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


export function updateCelltProps(data) {
    const cellId = editorContext.currentCell.get()?.i;

    if (!cellId) {
        console.warn('updateCellProps: отсутствует data-cell');
        return;
    }
}