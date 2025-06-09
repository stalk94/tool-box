import fs from 'fs/promises';
import path from 'path';
import { DataRenderPage } from '../types';


const CONFIG_DIR = path.join(process.cwd(), 'public', 'config');


export async function loadProjectConfig() {
    const raw = await fs.readFile(path.join(CONFIG_DIR, 'pages.json'), 'utf-8');
    return JSON.parse(raw);
}

export async function loadLayoutConfig() {
    const raw = await fs.readFile(path.join(CONFIG_DIR, 'layout.json'), 'utf-8');
    return JSON.parse(raw);
}

export async function loadPageSchema(fileName: string): Promise<DataRenderPage> {
    const raw = await fs.readFile(path.join(process.cwd(), 'public/pages', fileName), 'utf-8');
    return JSON.parse(raw);
}