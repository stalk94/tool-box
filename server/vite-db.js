import { QuickDB } from 'quick.db';
import bodyParser from 'body-parser';


const db = new QuickDB();


export default function vitePluginQuickDB() {
    return {
        name: 'vite-plugin-quickdb',
        configureServer(server) {
            server.middlewares.use(bodyParser.json());

            server.middlewares.use('/write', async (req, res) => {
                if (req.method === 'POST') {
                    const { key, value } = req.body;
                    await db.set(key, value);
                    res.end('ok');
                }
            });

            server.middlewares.use('/read', async (req, res) => {
                const url = new URL(req.url, `http://${req.headers.host}`);
                const key = url.searchParams.get('key');
                const data = await db.get(key || '');
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
            });
        },
    };
}