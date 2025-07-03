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

// !
export async function exportProject(config: Config, isStatic?: boolean) {
    const publicPath = path.join(app.getPath('userData'), 'public');
    const folderPath = path.join(app.getPath('temp'), 'exported');
    const zipPath = path.join(app.getPath('desktop'), 'export.zip');
    fs.rmSync(folderPath, { recursive: true, force: true });
    fs.mkdirSync(folderPath, { recursive: true });
    
    fs.cpSync(publicPath, folderPath, { recursive: true });
    fs.writeFileSync(path.join(folderPath, 'project.json'), JSON.stringify(config));
    fs.writeFileSync(path.join(folderPath, 'index.js'), fs.readFileSync('../boirlplate/index.js', {encoding: 'utf-8'}));

    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    archive.pipe(output);
    archive.directory(folderPath, false);
    await archive.finalize();

    shell.showItemInFolder(zipPath);
}