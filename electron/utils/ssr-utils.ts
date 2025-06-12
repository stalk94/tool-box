import path from 'path';

type RouteEntry = {
    filePath: string;
    routePattern: RegExp;
    paramNames: string[];
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