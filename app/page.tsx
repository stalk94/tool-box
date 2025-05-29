import React from 'react';
import { loadProjectConfig, loadLayoutConfig, loadPageSchema } from './[page]/helpers';
import EditorClient from './client';


export default async function RootPage() {
    
    return (
        <EditorClient />
    );
}