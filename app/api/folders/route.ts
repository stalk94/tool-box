import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

// получить массив папок проектов block editor
export async function GET() {
    const basePath = path.join(process.cwd(), 'public', 'blocks');

    try {
        const entries = fs.readdirSync(basePath, { withFileTypes: true });

        const folders = entries
            .filter((entry) => entry.isDirectory())
            .map((entry) => entry.name);

        return NextResponse.json(folders);
    } 
    catch (error) {
        return NextResponse.json(
            { error: 'Failed to read folders', details: error },
            { status: 500 }
        );
    }
}