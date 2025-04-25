import type { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { url } = req.query;

    if (typeof url !== 'string') {
        return res.status(400).json({ error: 'Missing or invalid "url" query parameter' });
    }

    try {
        const response = await fetch(url);
        const contentType = response.headers.get('content-type') || 'image/png';
        const buffer = await response.arrayBuffer();

        res.setHeader('Content-Type', contentType);
        res.setHeader('Cache-Control', 'public, max-age=86400');
        res.setHeader('Access-Control-Allow-Origin', '*'); // 💡 CORS-safe
        res.status(200).send(Buffer.from(buffer));
    }
    catch (e) {
        res.status(500).json({ error: 'Failed to fetch image', details: String(e) });
    }
}