import bodyParser from 'body-parser';
import { writeComponentBuildFiles } from './export/generator';
import { buildWebComponent } from './export/vite-runer';



export default function vitePluginBuild() {
    return {
        name: 'vite-plugin-build',
        configureServer(server) {
            server.middlewares.use(bodyParser.json());

            server.middlewares.use('/build', async (req, res) => {
                if (req.method === 'POST') {
                    const { tag, schema, theme } = req.body;

                    try {
                        const entryPath = await writeComponentBuildFiles(tag, schema, theme || 'darkTheme');
                        await buildWebComponent(tag, entryPath);

                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ ok: true, path: `/dist/${tag}/${tag}.js` }));
                    } 
                    catch (err) {
                        console.error('Build error:', err);
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ ok: false, error: String(err) }));
                    }
                }
            });
        },
    };
}