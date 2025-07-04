import { Component, LayoutCustom } from '../type';
import { editorContext, infoSlice, cellsSlice } from "../context";
import { story } from './hooks';


type Params = {
    component: Component;
    data: Record<string, any>;
    undo?: boolean;
}


///////////////////////////////////////////////////////////////////////////////////
// ВАЖНАЯ ФУНКЦИЯ ЖИЗНЕННОГО ЦИКЛА
///////////////////////////////////////////////////////////////////////////////////
export function updateComponentProps({ component, data, undo }: Params) {
    const id = component?.props?.['data-id'];
    const cellId = editorContext.currentCell.get()?.i;
    
    if (!id || !cellId) {
        console.warn('updateComponentProps: отсутствует data-id или data-cell');
        return;
    }
	if(undo) story.addOld();

    cellsSlice.set((old) => {
		if (Array.isArray(old[cellId]?.[0])) {
			old[cellId].forEach((nest, i)=> {
				const index = nest?.findIndex((component) => component.id === id);
				
				if (index !== -1) {
					Object.entries(data).forEach(([key, value]) => {
						if(nest[index]) nest[index].props[key] = value;
					});
				}
			});
		}
		else {
			const index = old[cellId]?.findIndex((component) => component.id === id);

			if (index !== -1 && old[cellId]) {
				Object.entries(data).forEach(([key, value]) => {
					if(old[cellId][index]) old[cellId][index].props[key] = value;
				});
			}
		}

        return old;
    });
}


/** обновить slice project */
export const updateProjectState = (scope: string, name: string) => {
	const project = editorContext.meta.project.get();
	const layouts = editorContext.layouts.get();
	const size = editorContext.size.get();

	infoSlice.projects.set((prev)=> {
		const data = {
			layouts: layouts,					// текушая сетка
			content: cellsSlice.get(true),		// список компонентов в ячейках
			meta: {
				scope,
				name,
				updatedAt: Date.now()
			},
			size: {
				width: size.width,
				height: size.height,
				breackpoint: 'lg'
			}
		}

		prev[project][scope][name] = data;
		return prev;
	});
}


export const mergeBlockProps = (key: string, value: any, select: LayoutCustom) => {
	const clone = structuredClone(select);
	if (!clone) return;

	if (!clone.props) clone.props = { [key]: value };
	else if (typeof value !== 'object') clone.props[key] = value;
	else clone.props[key] = { ...clone.props[key], ...value };

	['lg', 'md', 'sm', 'xs'].forEach((breackpoint) =>
		editorContext.layouts[breackpoint]?.set((prev) => {
			const findex = prev.findIndex((lay) => lay.i === select.i);
			if (findex !== -1) prev[findex].props = clone.props;
		})
	);
	editorContext.currentCell.set(clone);
}