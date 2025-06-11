import express from 'express';
import cors from 'cors';
import { writeComponentBuildFiles } from './export/generator';
import { buildWebComponent } from './export/vite-runer';


const app = express();
app.use(cors());
app.use(express.json());

app.post('/build', async (req, res) => {
    const { tag, schema, theme } = req.body;

    if (!tag || !schema) {
        return res.status(400).json({ ok: false, error: 'tag and schema are required' });
    }

    try {
        writeComponentBuildFiles(tag, schema, theme || 'darkTheme', tag);
        await buildWebComponent(tag);
        res.json({ ok: true, path: `/dist/${tag}/${tag}.js` });
    }
    catch (err) {
        console.error('Build error:', err);
        res.status(500).json({ ok: false, error: String(err) });
    }
});

app.listen(3002, () => {
    console.log('🚀 Build API running at http://localhost:3002');
});