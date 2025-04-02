import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
//import tailwindcss from '@tailwindcss/vite';
import writeFilePlugin from './server/vite-write';



export default defineConfig({
    plugins: [react(), writeFilePlugin()],
    resolve: {
        alias: {
          '@': '/src',
        },
    },
});