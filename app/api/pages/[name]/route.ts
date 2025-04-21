import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

interface Params {
	params: {
		scope: string;
		name: string;
	};
}


export async function GET(_: Request, { params }: Params) {
	const { name } = params;
	const filePath = path.join(process.cwd(), 'public', 'pages', `${name}.json`);

	try {
		if (!await fs.promises.access(filePath).then(() => true).catch(() => false)) {
			return NextResponse.json({ error: 'Файл не найден' }, { status: 404 });
		}

		const content = await fs.promises.readFile(filePath, 'utf8');
		const data = JSON.parse(content);

		return NextResponse.json(data);
	}
	catch (err) {
		console.error(`❌ Ошибка при чтении блока "${name}" из scope "${scope}":`, err);
		return NextResponse.json({ error: 'Ошибка при чтении файла' }, { status: 500 });
	}
}