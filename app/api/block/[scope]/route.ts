import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

interface Params {
	params: {
		scope: string;
	};
}


export async function GET(_: Request, context: { params: { scope: string } }) {
	const params = await Promise.resolve(context.params);
	const folderPath = path.join(process.cwd(), 'public', 'blocks', params.scope);

	try {
		const exists = await fs.promises.access(folderPath).then(() => true).catch(() => false);
		if (!exists) {
			return NextResponse.json({ error: 'Папка не найдена' }, { status: 404 });
		}

		const filesRaw = await fs.promises.readdir(folderPath);
		const files = filesRaw.filter(file => file.endsWith('.json'));

		const blocks = await Promise.all(
			files.map(async (file) => {
				const fullPath = path.join(folderPath, file);
				const content = await fs.promises.readFile(fullPath, 'utf8');

				return {
					name: file.replace('.json', ''),
					data: JSON.parse(content),
				};
			})
		);

		return NextResponse.json(blocks);
	} 
	catch (err) {
		console.error(`❌ Ошибка при чтении блоков в scope "${scope}":`, err);
		return NextResponse.json({ error: 'Ошибка при чтении файлов' }, { status: 500 });
	}
}