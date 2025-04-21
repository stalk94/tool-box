import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';



// ! не доделан
export async function GET(_: Request) {
    const folderPath = path.join(process.cwd(), 'public', 'pages');

    try {
        if (!fs.existsSync(folderPath)) {
            return NextResponse.json({ error: 'Папка не найдена' }, { status: 404 });
        }

        const files = fs.readdirSync(folderPath).filter(file => file.endsWith('.json'));

        const blocks = files.map(file => {
            const fullPath = path.join(folderPath, file);
            const content = fs.readFileSync(fullPath, 'utf8');
            
            return {
                name: file.replace('.json', ''),
                data: JSON.parse(content)
            };
        });

        return NextResponse.json(blocks);
    } 
    catch (err) {
        console.error(`❌ Ошибка при чтении блоков в scope "${scope}":`, err);
        return NextResponse.json({ error: 'Ошибка при чтении файлов' }, { status: 500 });
    }
}