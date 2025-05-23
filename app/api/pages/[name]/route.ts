import fs from 'fs';
import path from 'path';
import { NextResponse, NextRequest } from 'next/server';


export async function GET(_: Request, context: { params: { name: string } }) {
	const params = await Promise.resolve(context.params);
  	const name = params.name;

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
		console.error(`❌ ошибка записи:`, err);
		return NextResponse.json({ error: 'Ошибка при записи файла' }, { status: 500 });
	}
}

export async function POST(req: NextRequest, context: { params: { name: string } }) {
	const params = await Promise.resolve(context.params);
  	const name = params.name;
	const filePath = path.join(process.cwd(), 'public', 'pages', `${name}.json`);

	
	try {
		const body = await req.json(); // Получаем JSON из запроса

		// Создаём директорию при необходимости
		const dir = path.dirname(filePath);
		await fs.promises.mkdir(dir, { recursive: true });

		// Запись файла
		await fs.promises.writeFile(filePath, JSON.stringify(body, null, 2), 'utf8');

		return NextResponse.json({ status: 'ok', savedAs: `${name}.json` });
	} 
	catch (err) {
		console.error(`❌ Ошибка при записи файла "${name}.json":`, err);
		return NextResponse.json({ error: 'Ошибка при записи файла' }, { status: 500 });
	}
}

export async function DELETE(_: Request, context: { params: { name: string } }) {
	const params = await Promise.resolve(context.params);
	const filePath = path.join(process.cwd(), 'public', 'pages', `${params.name}.json`);

	try {
		await fs.promises.unlink(filePath);
		return NextResponse.json({ success: true });
	} 
	catch (err) {
		console.error('[DELETE PAGE ERROR]', err);
		return NextResponse.json({ success: false, error: 'Не удалось удалить страницу' }, { status: 500 });
	}
}