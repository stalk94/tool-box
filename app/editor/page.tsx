import React from 'react';
import Project from '../components/PageProject';
import { listPages } from '../api/loadPage';


export default async function ProjectEditorPage() {
    const lists = await listPages();
   

    return (
        <Project
            listsPages={lists}
        />
    );
}