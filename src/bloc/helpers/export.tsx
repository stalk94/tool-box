import { writeFile } from '../../app/plugins';
import { editorContext, infoSlice, renderSlice, cellsSlice } from "../context";
import { formatJsx } from '../modules/export/utils';


const isVite = typeof import.meta !== 'undefined' && !!import.meta.env?.DEV;
const isNext = !isVite;
const API_BASE = isVite ? '' : '/api';
const API_DB = isVite ? '' : '/api/db';


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
	const layout = renderSlice.get();
	const cells = cellsSlice.get();

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

export const saveBlockToFile = async (scope: string, name: string, clb?:(msg: string, type: 'error'|'success')=> void) => {
	const layouts = editorContext.layout.get();
	const size = editorContext.size.get();
	

	const data = {
		layout: layouts,		// текушая сетка
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
		if(clb) clb('Ошибка при сохранении блока', 'error');
	} 
	else {
		console.log('✅ Блок сохранён');
		if(clb) clb('Блок сохранён', 'success');
	}
}
export const exportLiteralToFile = async (path: string[], fileName: string, fileData: string) => {
	const body = {
		folder: `public/export/${path[0]}/${path[1]}`,
		filename: `${fileName}.tsx`,
		content: await formatJsx(fileData)
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
		console.log('✅ export file');
		return `/${path[1]}/${fileName}.tsx`;
	}
}
/** добавляет в главный index.tsx записи */
export const addModuleToIndex = async(strImport: string) => {
	const res = await fetch(`${API_BASE}/get-index`);
	const text = await res.text();

	if(!text.includes(strImport)) {
		const newTextRaw = text + '\n' + strImport;;

		const lines = newTextRaw
			.split(/\r?\n/)
			.map(line => line.trim())
			.filter(line => line.startsWith('import'));

		const variableNames = lines.map(line => {
			const match = line.match(/^import\s+(\w+)\s+from\s+['"](.+)['"];?$/);
			return match ? match[1] : null;
		}).filter(Boolean);

		const importSection = lines.join('\n');
		const exportSection = `\n\nexport default {\n  ${variableNames.join(',\n  ')}\n};`;
		const finalText = importSection + exportSection;


		const res = await fetch(`${API_BASE}/write-file`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				folder: `public/export`,
				filename: `index.tsx`,
				content: finalText
			})
		});

		if (!res.ok) {
			console.error('❌ Ошибка при сохранении блока');
		}
		else console.log('✅ index file change');
	}
}
export const createBlockToFile = async (scope: string, name: string) => {
	const size = editorContext.size.get();
	
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
			width: size.width,
			height: size.height
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

export const db = {
	async set(key: string, value: any) {
		const res = await fetch(`${API_DB}/write`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				key: key,
				value: value,
			})
		});
	},
	async get(key: string) {
		const res = await fetch(`${API_DB}/read?key=${key}`);
		const data = await res.json();
		console.log('DB GET: ', data)
		return data;
	}
}