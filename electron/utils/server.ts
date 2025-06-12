import express from 'express';
import path from 'path';
import { app } from 'electron';
import ngrok from 'ngrok';
import fs from 'fs';


export function startLocalServer(port = 3456, authToken?: string) {
	const server = express();

	const publicDir = path.join(app.getPath('userData'), 'public');
	const pageDir = path.join(app.getPath('userData'), 'page');
	server.use('/', express.static(publicDir));

	server.get('*', (req, res)=> {
		const route = req.path === '/' ? '/index' : req.path;
		const htmlFilePath = path.join(pageDir, `${route}.html`);

		if (fs.existsSync(htmlFilePath)) {
			return res.sendFile(htmlFilePath);
		}

		res.status(404).send('Not found');
	});

	server.listen(port, () => {
		if(authToken) {
			ngrok
				.authtoken(authToken)
				.then(() => ngrok.connect({ addr: port }))
				.then((url) => process.emit('ngrock', url))
				.catch((e) => console.error('error ngrock: ', e));
		}
		console.log(`📦 Local file server running at http://localhost:${port}/`);
	});
}