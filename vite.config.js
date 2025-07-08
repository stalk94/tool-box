import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import writeFilePlugin from './server/vite-write';
import quickDbPlugin from './server/vite-db.js';
import viteBuild from './server/vite-build.js';
import viteSource from './server/vite-source.js';
import viteSafeTw from './server/vite-tw-safe.js';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';


export default defineConfig({
    root: 'src',
    publicDir: '../public',
    plugins: [react(), tailwindcss(), viteSafeTw(), viteSource(), writeFilePlugin(), viteBuild(), quickDbPlugin(), tsconfigPaths()],
    server: {
        port: 3001
    },
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: 'src/index.html'
        }
    },
    resolve: {
        alias: {
            src: path.resolve(__dirname, 'src'),
            '@bloc': path.resolve(__dirname, 'src/bloc'),
            '@components': path.resolve(__dirname, 'src/components'),
            '@lib': path.resolve(__dirname, 'src'),
            '@system': path.resolve(__dirname, 'src/app')
        }
    },
    define: {
        'process.env.NODE_ENV': JSON.stringify('production'),
        'process.env': '{}'
    },
});