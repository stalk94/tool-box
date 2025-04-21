import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';


// получить массив папок проектов block editor
export async function GET() {
    const basePath = path.join(process.cwd(), 'public', 'blocks');

    try {
        const scopesRaw = await fs.promises.readdir(basePath, { withFileTypes: true });
        const scopes = scopesRaw.filter(entry => entry.isDirectory()).map(entry => entry.name);
        const result: Record<string, { name: string; data: any }[]> = {};

        for (const scope of scopes) {
            const folderPath = path.join(basePath, scope);
            const filesRaw = await fs.promises.readdir(folderPath);
            const files = filesRaw.filter(f => f.endsWith('.json'));

            const data = await Promise.all(files.map(async (file) => {
                const fullPath = path.join(folderPath, file);
                const content = await fs.promises.readFile(fullPath, 'utf8');

                // todo: возможно надо JSON.parse в try/catce завернуть
                return {
                    name: file.replace(/\.json$/, ''),
                    data: JSON.parse(content),
                };
            }));

            result[scope] = data;
        }

        return NextResponse.json(result);
    } 
    catch (err) {
        console.error('❌ Ошибка при чтении папок:', err);
        return NextResponse.json({ error: 'Ошибка при чтении папок и файлов' }, { status: 500 });
    }
}
