import { defineConfig } from 'vite';
import path from 'path';


export default defineConfig({
    build: {
        outDir: 'dist-electron',
        emptyOutDir: false,
        minify: false,
        copyPublicDir: false,
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, 'electron/main.ts'),
                preload: path.resolve(__dirname, 'electron/preload.ts'),
            },
            output: {
                entryFileNames: '[name].cjs', // main.cjs, preload.cjs
            },
            external: ['electron', 'fs', 'path'], // системные модули
        },
        lib: {
            entry: path.resolve(__dirname, 'electron/main.ts'), // нужно, иначе Vite будет ругаться
            formats: ['cjs'],
        },
    },
});