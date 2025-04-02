import fs from 'fs';
import path from 'path';


export default function writeFilePlugin() {
    return {
        name: 'vite-plugin-write',
        configureServer(server) {
            server.middlewares.use('/write-file', async (req, res) => {
                if (req.method !== 'POST') {
                    res.statusCode = 405;
                    res.end('Method Not Allowed');
                    return;
                }

                let body = '';
                req.on('data', (chunk) => (body += chunk));
                req.on('end', () => {
                    try {
                        const { folder = 'public', filename, content } = JSON.parse(body);

                        if (!filename || !content) {
                            res.statusCode = 400;
                            res.end('Invalid request');
                            return;
                        }

                        const dirPath = path.join(process.cwd(), folder);
                        const filePath = path.join(dirPath, filename);

                        // Создаём папку, если её нет
                        if (!fs.existsSync(dirPath)) {
                            fs.mkdirSync(dirPath, { recursive: true });
                        }

                        // Записываем файл
                        fs.writeFileSync(filePath, content, 'utf8');

                        res.end(`File written successfully to ${filePath}`);
                    } 
                    catch (error) {
                        console.error('Error writing file:', error);
                        res.statusCode = 500;
                        res.end('Error writing file');
                    }
                });
            });
        },
    };
}