import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import path from 'path';


export default defineConfig({
    plugins: [
        react(), dts({
            tsconfigPath: path.resolve(__dirname, 'src/tsconfig.json'),
            outputDir: 'dist',
            include: ['src'],
            skipDiagnostics: true,
            logDiagnostics: false,
        })
    ],
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'), // ← файл библиотеки
            name: 'kitui-react',
            formats: ['es', 'cjs'],
            fileName: (format) => `index.${format}.js`
        },
        rollupOptions: {
            external: [
                'react', 'react-dom', 'primereact',
            ],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM'
                }
            }
        }
    }
});