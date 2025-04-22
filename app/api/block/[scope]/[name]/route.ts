import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';



export async function GET(request: Request, { params }: { params: { scope: string; name: string } }) {
	const { scope, name } = await params;
	const filePath = path.join(process.cwd(), 'public', 'blocks', scope, `${name}.json`);

	try {
		
		try {
			await fs.promises.access(filePath);
		} 
		catch {
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