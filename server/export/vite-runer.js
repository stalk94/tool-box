import { build } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

function toPascalCase(name) {
    return name
        .replace(/(^\w|-\w)/g, (m) => m.replace('-', '').toUpperCase());
}


export async function buildWebComponent(tag, entryPath) {
    const safeName = toPascalCase(tag); 

    await build({
        configFile: false,
        plugins: [react()],
        build: {
            copyPublicDir: false,
            lib: {
                entry: path.resolve(__dirname, entryPath),
                name: safeName,
                fileName: () => `${tag}.js`,
                formats: ['iife'],
            },
            outDir: path.resolve(__dirname, `../../dist/${tag}`),
            emptyOutDir: true,
        },
        resolve: {
            alias: {
                src: path.resolve(__dirname, '../../src'),
            },
        },
    });
}