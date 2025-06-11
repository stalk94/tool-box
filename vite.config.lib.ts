import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import path from 'path';



export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            src: path.resolve(__dirname, 'src'),
        },
    },
    build: {
        copyPublicDir: false,
        lib: {
            entry: 'src/bloc/modules/export/web-component.wc.tsx',
            name: 'MyBlock',
            fileName: () => 'my-block.js',
            formats: ['iife'], // важно: самодостаточный .js
        },
        rollupOptions: {
            external: [], // можно пусто — всё внутрь
        },
    },
});