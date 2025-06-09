import React from 'react';
//import { loadProjectConfig, loadLayoutConfig, loadPageSchema } from './[page]/helpers';
import EditorClient from './client';
import testData from '../public/blocks/home/root.json';
import GridRender from './components/GridAdapter';
import { headers } from 'next/headers';



// проводим тест render
export default async function RootPage() {
    const headerList = headers();
    const userAgent = headerList.get('user-agent') || '';
    const isMobile = /Mobi|Android/i.test(userAgent);
    const breakpoint = isMobile ? 'sm' : 'lg';


    return (
        <EditorClient
            curBreacpoint={breakpoint}
            layouts={testData.layouts}
            contentCells={testData.content}
        />
    );
}