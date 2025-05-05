import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';



export async function GET(_: Request, context: { params: { scope: string, name: string } }) {
	const params = await Promise.resolve(context.params);
	const name = params.name;
  	const scope = params.scope;
	
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


export async function DELETE(_: Request, context: { params: { scope: string, name: string } }) {
	const params = await Promise.resolve(context.params);
	const { scope, name } = params;
	const filePath = path.join(process.cwd(), 'public', 'blocks', scope, `${name}.json`);

	
	try {
		await fs.promises.unlink(filePath);
		return NextResponse.json({ success: true });
	} 
	catch (err) {
		console.error('[DELETE BLOCK ERROR]', err);
		return NextResponse.json({ success: false, error: 'Не удалось удалить блок' }, { status: 500 });
	}
}