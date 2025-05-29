import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';


// получить массив папок проектов block editor
export async function GET() {
    const basePath = path.join(process.cwd(), 'public', 'export/index.tsx');

    try {
        const scopesRaw = await fs.promises.readFile(basePath, { encoding:'utf-8' });
        return NextResponse.json(scopesRaw);
    } 
    catch (err) {
        console.error('❌ Ошибка при чтении папок:', err);
        return NextResponse.json({ error: 'Ошибка при чтении папок и файлов' }, { status: 500 });
    }
}