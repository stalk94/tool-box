import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';



export async function GET() {
    const basePath = path.join(process.cwd(), 'public', 'blocks');

    try {
        const scopes = fs.readdirSync(basePath, { withFileTypes: true })
            .filter(entry => entry.isDirectory())
            .map(entry => entry.name);

        return NextResponse.json(scopes);
    } 
    catch (err) {
        console.error('❌ Ошибка при чтении public/blocks:', err);
        return NextResponse.json(
            { error: 'Ошибка при чтении папок' },
            { status: 500 }
        );
    }
}