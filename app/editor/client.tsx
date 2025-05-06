'use client'
import dynamic from 'next/dynamic';

const Project = dynamic(() => import('../components/Editor'), { ssr: false });


export default function ProjectEditorPage({ listsPages }) {
    return <Project listsPages={listsPages} />;
}