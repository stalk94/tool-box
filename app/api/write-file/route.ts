import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';



export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { folder = 'public', filename, content, settings } = body;

        if (!filename || !content) {
            return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
        }

        const dirPath = path.join(process.cwd(), folder);
        const filePath = path.join(dirPath, filename);

        if (!await fs.promises.access(dirPath).then(() => true).catch(() => false)) {
            await fs.promises.mkdir(dirPath, { recursive: true });
        }

        if (settings?.image || settings?.binary) {
            const base64Data = content.split(',')[1];
            await fs.promises.writeFile(filePath, base64Data, 'base64');
        } 
        else {
            await fs.promises.writeFile(filePath, content, 'utf8');
        }

        const relativePath = path.posix.join('/', folder.replace(/^public\/?/, ''), filename);
        return NextResponse.json({ path: relativePath });
    } 
    catch (err) {
        console.error('❌ Error writing file:', err);
        return NextResponse.json({ error: 'Error writing file' }, { status: 500 });
    }
}
