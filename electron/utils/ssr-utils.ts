import { app, dialog, shell } from 'electron';
import path from 'path';
import archiver from 'archiver';
import fs from 'fs';


type RouteEntry = {
    filePath: string;
    routePattern: RegExp;
    paramNames: string[];
}
type PageData = {
    header?: PageData
    body: PageData
    footer?: PageData
    meta: {
        title?: string
        description?: string
        path: string
    }
}
type Config = {
    theme: any
    home: {
        data: PageData
        html: string
    }
    pages: {
        [key: string]: {
            data: PageData
            html: string
        }
    }
}


function createRoutePattern(file: string): RouteEntry {
    // Пример: posts/[slug].html → /posts/:slug
    const parts = file
        .replace(/\.html$/, '')
        .split(path.sep)
        .map((part) => {
            if (part.startsWith('[...')) {
                return `(?<${part.slice(4, -1)}>.+?)`; // [...slug]
            }
            if (part.startsWith('[')) {
                return `(?<${part.slice(1, -1)}>[^/]+)`; // [slug]
            }
            return part;
        });

    const regexStr = '^/' + parts.join('/') + '$';
    return {
        filePath: file,
        routePattern: new RegExp(regexStr),
        paramNames: [...file.matchAll(/\[([\.]{3})?(.+?)\]/g)].map((m) => m[2]),
    };
}

/////////////////////////////////////////////////////////////////////////////
//          BUILD PROJECT
/////////////////////////////////////////////////////////////////////////////
const getTsConfig = () => {
    return JSON.stringify({
        "compilerOptions": {
            "module": "ESNext",
            "moduleResolution": "Bundler",
            "target": "ES2020",
            "esModuleInterop": true,
            "resolveJsonModule": true,
            "allowImportingTsExtensions": true
        }
    }, null, 2);
}
const getPackage = (isEdge?: boolean) => {
    if (isEdge) return JSON.stringify({
        "name": "project",
        "version": "1.0.0",
        "type": "module",
    }, null, 2);
    else return JSON.stringify({
        "name": "project",
        "version": "1.0.0",
        "type": "module",
        "scripts": {
            "dev": "vite",
            "build": "vite build",
            "start": "node index.js"
        },
        "dependencies": {
            "react": "^18.0.0",
            "react-dom": "^18.0.0",
            "express": "^4.21.1"
        },
        "devDependencies": {
            "vite": "^5.0.0",
            "typescript": "^5.0.0"
        }
    }, null, 2);
}
// ! 
export async function exportProject(config: Config, isEdge?: boolean) {
    const publicPath = path.join(app.getPath('userData'), 'public');
    const folderPath = path.join(app.getPath('temp'), 'exported');
    const zipPath = path.join(app.getPath('desktop'), 'export.zip');

    fs.rmSync(folderPath, { recursive: true, force: true });
    fs.mkdirSync(folderPath, { recursive: true });
    fs.cpSync(publicPath, folderPath, { recursive: true });
    fs.writeFileSync(path.join(folderPath, 'project.json'), JSON.stringify(config, null, 2));

    if (isEdge) {
        fs.writeFileSync(path.join(folderPath, 'index.js'), fs.readFileSync('../boirlplate/edge.js', {encoding: 'utf-8'}));
        fs.writeFileSync(path.join(folderPath, 'tsconfig.json'), fs.readFileSync(getTsConfig(), {encoding: 'utf-8'}));
        fs.writeFileSync(path.join(folderPath, 'package.json'), fs.readFileSync(getPackage(isEdge), {encoding: 'utf-8'}));
    }
    else {
        fs.writeFileSync(path.join(folderPath, 'index.js'), fs.readFileSync('../boirlplate/index.js', {encoding: 'utf-8'}));
        fs.writeFileSync(path.join(folderPath, 'tsconfig.json'), fs.readFileSync(getTsConfig(), {encoding: 'utf-8'}));
        fs.writeFileSync(path.join(folderPath, 'package.json'), fs.readFileSync(getPackage(), {encoding: 'utf-8'}));
    }

    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    archive.pipe(output);
    archive.directory(folderPath, false);
    await archive.finalize();

    shell.showItemInFolder(zipPath);
}