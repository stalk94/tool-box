import React from 'react';
import ResponsiveRenderPage from './[page]/ResponsiveRender';
import { DataRenderPage } from './types/page';
import fs from 'fs/promises';
import path from 'path';



export default async function RootPage() {
    const filePath = path.join(process.cwd(), 'public/pages/home.json');        // или любой дефолт
    const raw = await fs.readFile(filePath, 'utf-8');
    const schema: DataRenderPage = JSON.parse(raw);


    return (
        <ResponsiveRenderPage 
            schema={schema} 
        />
    );
}