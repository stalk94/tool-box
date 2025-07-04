import DATA from './project.json';


export const config = {
  runtime: 'edge',
}


function getData(route) {
    let result;
    if (route === '/index') result = config.home;
    else result = config.pages[route] || { html: "<h1>404</h1>" };

    return {
        html: result.html,
        styles: `<style>${config.style}</style>`
    };
}

export async function GET(request) {
    const url = new URL(request.url);
    const route = url.pathname === '/' ? '/index' : url.pathname;
    const { html, styles } = getData(route);

    const fullHtml = `
        <!DOCTYPE html>
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
                <div class="root">${html}</div>
                <script type="module" src="/main.js"></script>
            </body>
        </html>
    `;

    return new Response(fullHtml, {
        headers: { 'Content-Type': 'text/html' }
    });
}