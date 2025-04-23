import { writeFile } from '../../app/plugins';
import context, { cellsContent, renderState } from '../context';


const isVite = typeof import.meta !== 'undefined' && !!import.meta.env?.DEV;
const isNext = !isVite;
const API_BASE = isVite ? '' : '/api';


//-----------------------------------------------------------------------------
//      [?] тестовый код 
//-----------------------------------------------------------------------------
export const generateJSX = (type: string, propsRaw: Record<string, any> = {}, indent = 2): string => {
	const props = propsRaw || {};
	const spaces = ' '.repeat(indent);
	const attrs = Object.entries(props)
		.filter(([key]) => key !== 'children')
		.map(([key, value]) => {
			if (typeof value === 'string') return `${key}="${value}"`;
			if (typeof value === 'boolean' || typeof value === 'number') return `${key}={${value}}`;
			if (typeof value === 'object') return `${key}={${JSON.stringify(value)}}`;
			return '';
		})
		.join(' ');

	const children = props.children;
	const hasChildren = !!children && (Array.isArray(children) ? children.length > 0 : true);

	if (!hasChildren) {
		return `${spaces}<${type} ${attrs} />`;
	}

	const childrenCode = Array.isArray(children)
		? children.map(child =>
			typeof child === 'object' && child?.props
				? generateJSX(child.type?.name || 'div', child.props, indent + 2)
				: `${' '.repeat(indent + 2)}${child}`
		).join('\n')
		: typeof children === 'object' && children?.props
			? generateJSX(children.type?.name || 'div', children.props, indent + 2)
			: `${' '.repeat(indent + 2)}${children}`;

	return `${spaces}<${type} ${attrs}>
${childrenCode}
${spaces}</${type}>`;
}

export const exportAsJSX = async (name: string) => {
	const layout = context.render.get({ noproxy: true });
	const cells = cellsContent.get({ noproxy: true });

	const renderedBlocks = layout.map(cell => {
		const comps = cells[cell.i] ?? [];
		const children = comps.map(c =>
			generateJSX(c.props?.['data-type'] || 'div', c.props || {})
		).join('\n');

		return `  <div data-id="${cell.i}">\n${children}\n  </div>`;
	});

	const output = `import React from 'react';

export default function Page() {
  return (
    <div>
${renderedBlocks.join('\n\n')}
    </div>
  );
}`;

	await writeFile('/exports/jsx', `${name}.tsx`, output);
}



// ----------------------------------------------------------------------------
//      работа с файлами editor (next or vite) (! отключить доступ в продакшене)
// ----------------------------------------------------------------------------

export const saveBlockToFile = async (scope: string, name: string) => {
	const data = {
		layout: context.layout.get({ noproxy: true }),		// текушая сетка
		content: cellsContent.get({ noproxy: true }),		// список компонентов в ячейках
		meta: {
			scope,
			name,
			updatedAt: Date.now(),
			preview: `snapshots/${scope}-${name}.png`
		},
		size: {
			width: context.size.width.get(),
			height: context.size.height.get()
		}
	};

	const body = {
		folder: `public/blocks/${scope}`,
		filename: `${name}.json`,
		content: JSON.stringify(data, null, 2)
	};

	const res = await fetch(`${API_BASE}/write-file`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body)
	});

	if (!res.ok) {
		console.error('❌ Ошибка при сохранении блока');
	} 
	else {
		console.log('✅ Блок сохранён');
	}
}

export const createBlockToFile = async (scope: string, name: string) => {
	const data = {
		layout: [],
		content: {},
		meta: {
			scope,
			name,
			updatedAt: Date.now(),
			preview: ''
		},
		size: {
			width: context.size.width.get(),
			height: context.size.height.get()
		}
	};

	const body = {
		folder: `public/blocks/${scope}`,
		filename: `${name}.json`,
		content: JSON.stringify(data, null, 2)
	};

	//! надо полифил на next и слшать этот маршрут
	const res = await fetch(`${API_BASE}/write-file`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body)
	});

	if (!res.ok) {
		console.error('❌ Ошибка при сохранении блока');
	} 
	else {
		console.log('✔️ Блок создан');
	}
}

export const fetchFolders = async (): Promise<string[]> => {
    const res = await fetch(`${API_BASE}/list-folders`);
    if (!res.ok) throw new Error('Ошибка загрузки');
    return res.json();
}