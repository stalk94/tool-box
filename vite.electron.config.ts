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
            external: [ 
                'electron',
                'express',
                'fs',
                'path',
                'url',
                'lowdb',
                'lowdb/node',
                'lowdb/lib/adapters/JSONFile.js',
                'lowdb/lib/adapters/node/JSONFile.js',
                'lowdb/lib/adapters/node/TextFile.js',
                'steno',
                'lodash',
                'ngrok',
                'dotenv'
            ], // системные модули
        },
        lib: {
            entry: path.resolve(__dirname, 'electron/main.ts'), // нужно, иначе Vite будет ругаться
            formats: ['cjs'],
        },
    },
});