import { renderWithPuppeteer } from './puppeter';


export default function vitePlugin() {
    return {
        name: 'vite-plugin-ssr',
        configureServer(server) {
            server.middlewares.use('/ssr', async (req, res) => {
                if (req.method !== 'POST') {
                    res.writeHead(405, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Method Not Allowed' }));
                    return;
                }
                let body = req.body;

                try {
                    const { componentPath, props = {} } = body;

                    if (!componentPath) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Missing componentPath' }));
                        return;
                    }

                    // 🧠 Тут запускаем Puppeteer как раньше
                    const html = await renderWithPuppeteer(componentPath, props);
                    console.log(html)

                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(html);
                }
                catch (e) {
                    console.error('Render failed:', e);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: e.message }));
                }
            });
        }
    };
}