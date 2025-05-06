import React from 'react';
import { listPages } from '../api/loadPage';
import Project from './client';



export default async function ProjectEditorPage() {
    const lists = await listPages();
   

    return (
        <Project
            listsPages={lists}
        />
    );
}