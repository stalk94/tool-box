import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import writeFilePlugin from './server/vite-write';



export default defineConfig({
    root: 'src',
    publicDir: '../public',
    plugins: [react(), writeFilePlugin(), tsconfigPaths()],
    server: {
        port: 3001,
    }
});