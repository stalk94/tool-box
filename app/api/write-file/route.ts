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

        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        if (settings?.image || settings?.binary) {
            const base64Data = content.split(',')[1];
            fs.writeFileSync(filePath, base64Data, 'base64');
        } 
        else {
            fs.writeFileSync(filePath, content, 'utf8');
        }

        return NextResponse.json({ path: `/${folder.replace('public/', '')}/${filename}` });
    } 
    catch (err) {
        console.error('❌ Error writing file:', err);
        return NextResponse.json({ error: 'Error writing file' }, { status: 500 });
    }
}
