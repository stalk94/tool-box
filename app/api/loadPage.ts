import fs from 'fs/promises';
import path from 'path';


export async function listPages(): Promise<string[]> {
    const pagesDir = path.join(process.cwd(), 'public/pages');

    try {
        const files = await fs.readdir(pagesDir);
        return files
            .filter(file => file.endsWith('.json'))
            .map(file => file.replace('.json', ''));
    } 
    catch (err) {
        console.error('[listPages] Не удалось прочитать public/pages:', err);
        return [];
    }
}