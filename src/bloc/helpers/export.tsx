import { editorContext, infoSlice, cellsSlice } from "../context";
import { formatJsx } from '../modules/export/utils';
import type { ComponentSerrialize } from '../type';


const isVite = typeof import.meta !== 'undefined' && !!import.meta.env?.DEV;
const isNext = !isVite;
const isElectron = typeof window !== 'undefined' && !!window.electronAPI;
const API_BASE = isVite ? '' : '/api';
const API_DB = isVite ? '' : '/api/db';



// ----------------------------------------------------------------------------
//      работа с файлами editor (next or vite) (! отключить доступ в продакшене)
// ----------------------------------------------------------------------------

export const saveBlockToFile = async (scope: string, name: string, clb?:(msg: string, type: 'error'|'success')=> void) => {
	const layouts = editorContext.layouts.get();
	const size = editorContext.size.get();
	

	const data = {
		layouts: layouts,					// сетки
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
			breackpoint: size.breackpoint
		}
	};

	// electron
	if (typeof window !== 'undefined' && window.electronAPI?.writeFile) {
		const relativePath = `blocks/${scope}/${name}.json`;
		const content = JSON.stringify(data, null, 2);

		try {
			await window.electronAPI.writeFile(relativePath, content);
			console.log('✅ Page сохранён через Electron');
			clb?.('Page сохранён', 'success');
		} 
		catch (err) {
			console.error('❌ Electron write error', err);
			clb?.('Ошибка при сохранении page', 'error');
		}
		return;
	}

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
		console.error('❌ Ошибка при сохранении page');
		if(clb) clb('Ошибка при сохранении page', 'error');
	} 
	else {
		console.log('✅ Page сохранён');
		if(clb) clb('Page сохранён', 'success');
	}
}
export const createBlockToFile = async (scope: string, name: string) => {
	const size = editorContext.size.get();
	
	const data = {
		layouts: {lg: [], md: [], sm: [], xs: []},
		content: {},
		meta: {
			scope,
			name,
			updatedAt: Date.now()
		},
		size: {
			width: size.width,
			height: size.height,
			breackpoint: size.breackpoint
		}
	}

	if (typeof window !== 'undefined' && window.electronAPI?.writeFile) {
		const relativePath = `blocks/${scope}/${name}.json`;
		const content = JSON.stringify(data, null, 2);

		try {
			await window.electronAPI.writeFile(relativePath, content);
			console.log('✅ Page создан через Electron');
		} 
		catch (err) {
			console.error('❌ Electron write error', err);
		}
		return;
	}

	const body = {
		folder: `public/blocks/${scope}`,
		filename: `${name}.json`,
		content: JSON.stringify(data, null, 2)
	}

	//! надо полифил на next и слшать этот маршрут
	const res = await fetch(`${API_BASE}/write-file`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body)
	});

	if (!res.ok) {
		console.error('❌ Ошибка при сохранении page');
	} 
	else {
		console.log('✔️ Page создан');
	}
}


export const exportLiteralToFile = async (path: string[], fileName: string, fileData: string) => {
	if (typeof window !== 'undefined' && window.electronAPI?.writeFile) {
		const relativePath = `${path}/${fileName}`;
		
		try {
			const res = await window.electronAPI.writeFile(relativePath, fileData);
			console.log('✅ export code: ', res);
		} 
		catch (err) {
			console.error('❌ Electron write error', err);
		}
		return;
	}

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


export const buildComponent = async(tag: string, component: ComponentSerrialize, theme?: string) => {
	const res = await fetch('/build', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			tag: tag,
			theme: theme ?? 'darkTheme',
			schema: component
		}),
	});

	if (!res.ok) {
		console.error('❌ Ошибка при сохранении блока');
	} 
	else {
		const json = await res.json();
		console.log('✅ build component: ', json.path);
		return json.path;
	}
}
export const fetchFolders = async () => {
	if (window.electronAPI?.listFolders) {
		try {
			return await window.electronAPI.listFolders();
		} 
		catch (err) {
			console.error('❌ Ошибка через IPC:', err);
			throw new Error('Ошибка загрузки папок');
		}
	}

    const res = await fetch(`${API_BASE}/list-folders`);
    if (!res.ok) throw new Error('Ошибка загрузки');
    return res.json();
}

export const db = {
	async set(key: string, value: any) {
		if (isElectron) {
			return window.electronAPI!.db.set(key, value);
		}
		
		await fetch(`${API_DB}/write`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ key, value })
		});
	},
	async get(key: string) {
		if (isElectron) {
			const result = await window.electronAPI!.db.get(key);
			console.log('DB GET [Electron]:', result);
			return result;
		}

		const res = await fetch(`${API_DB}/read?key=${key}`);
		const data = await res.json();
		console.log('DB GET [fetch]:', data);
		return data;
	}
}

