import express from 'express';
import path from 'path';
import fs from 'fs';

const server = express();
const config = JSON.parse(fs.readFileSync('./project.json', { encoding: 'utf-8' }));
server.use(express.static('./public'));
server.use(express.static('dist/client'));

const getData = (route) => {
    let result;
    if(route === '/index') result = config.home;
    else result = config.pages[route];

    return {
        html: result.html,
        styles: `<style>${config.style}</style>`,
        meta: {
            theme: config.theme,
            data: result
        }
    }
}

server.get('*', (req, res) => {
    const route = req.path === '/' ? '/index' : req.path;
    const htmlFilePath = path.join('./pages', route + '.html');

    if (fs.existsSync(htmlFilePath)) {
        return res.sendFile(htmlFilePath);
    }
    else {
        const { html, styles, meta } = getData(route);

        const render =`
            <html>
                <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>
                    <link rel="preconnect" href="https://fonts.googleapis.com" />
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"/>
                    ${styles}
                </head>
                <body>
                    <script>
                        globalThis.__DATA__ = ${JSON.stringify(meta).replace(/</g, '\\u003c')};
                    </script>
                    
                    <div class="root">${html}</div>
        
                    <script type="module" src="/main.js"></script>
                </body>
            </html>
        `;
        res.setHeader('Content-Type', 'text/html');
        res.send(render);
    }

    res.status(404).send('Not found');
});

server.listen(80, () => console.log('start server'));