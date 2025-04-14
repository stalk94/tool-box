import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import writeFilePlugin from './server/vite-write';



export default defineConfig({
    plugins: [react(), writeFilePlugin(), tsconfigPaths()],

});