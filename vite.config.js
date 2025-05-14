import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import writeFilePlugin from './server/vite-write';
import quickDbPlugin from './server/vite-db.js';
import path from 'path';


export default defineConfig({
    root: 'src',
    publicDir: '../public',
    plugins: [react(), writeFilePlugin(), quickDbPlugin(), tsconfigPaths()],
    server: {
        port: 3001,
    },
    resolve: {
        alias: {
            '@bloc': path.resolve(__dirname, 'src/bloc'),
            '@components': path.resolve(__dirname, 'src/components'),
            '@lib': path.resolve(__dirname, 'src'),
            '@system': path.resolve(__dirname, 'src/app'),
        }
    },
    define: {
        'process.env.NODE_ENV': JSON.stringify('production'),
        'process.env': '{}'
    }
});