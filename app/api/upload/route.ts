import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';


export async function POST(req: Request) {
    const formData = await req.formData();
    const file = formData.get('image') as File;

    if (!file) {
        return NextResponse.json({ error: 'Файл не получен' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(process.cwd(), 'public', 'snapshots', file.name);

    try {
        await fs.mkdir(path.dirname(filePath), { recursive: true });
        await fs.writeFile(filePath, buffer);
        return NextResponse.json({ status: 'ok', savedAs: `/snapshots/${file.name}` });
    } 
    catch (err) {
        console.error('❌ Ошибка при сохранении файла:', err);
        return NextResponse.json({ error: 'Ошибка при сохранении' }, { status: 500 });
    }
}