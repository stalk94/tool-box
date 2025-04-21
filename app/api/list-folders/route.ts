import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

// получить массив папок проектов block editor
export async function GET() {
    const basePath = path.join(process.cwd(), 'public', 'blocks');

    try {
        const scopes = fs.readdirSync(basePath, { withFileTypes: true })
            .filter(entry => entry.isDirectory())
            .map(entry => entry.name);

        const result: Record<string, { name: string; data: any }[]> = {};

        for (const scope of scopes) {
            const folderPath = path.join(basePath, scope);
            const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.json'));

            result[scope] = files.map((file) => {
                const fullPath = path.join(folderPath, file);
                const content = fs.readFileSync(fullPath, 'utf8');
                return {
                    name: file.replace(/\.json$/, ''),
                    data: JSON.parse(content)
                };
            });
        }

        return NextResponse.json(result);
    } 
    catch (err) {
        console.error('❌ Ошибка при чтении папок:', err);
        return NextResponse.json({ error: 'Ошибка при чтении папок и файлов' }, { status: 500 });
    }
}
