import EventEmitterNode from "./emiter";
import { APIEndpoints } from "./global.js";


export async function send<T extends keyof APIEndpoints>(
    path: T, 
    data: APIEndpoints[T]['request'],
    metod: APIEndpoints[T]['method'],
    token?: string                          // !додумать
): Promise<APIEndpoints[T]['response']> {
    const dataServer = {
        method: metod ?? 'POST',
        //credentials: 'same-origin',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    }
    if(metod !== 'GET') dataServer.body = JSON.stringify(data);

    const request = await fetch(`/${path}`, dataServer);
    return request.json();
}

export function base64toBlob(base64: string): Blob {
    const [meta, content] = base64.split(',');
    const mimeMatch = meta.match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream';

    const binary = atob(content);
    const array = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
        array[i] = binary.charCodeAt(i);
    }

    return new Blob([array], { type: mime });
}


// ошибки глобального обьекта
window.onerror =(message, source, lineno, colno, error)=> {
    source = source.replace(/^https?:\/\/[^/]+/, "").replace(/\?.*$/, "");
    let position = `${lineno}:${colno}`;

    const data = {
        name: error.name,
        message: String(message),
        position,
        source,
        stack: error.stack
    }
    
    send('error', { time: new Date().toUTCString(), type: 'global', ...data }, 'POST');
}
window.addEventListener("unhandledrejection", (event)=> {
    console.error("❌⏳ error: ", event.reason);
    send('error', { time: new Date().toUTCString(), type:'promise', reason:event.reason }, 'POST');
    
    event.preventDefault();
});
// глобальный эмиттер как в node js
window.EventEmitter = new EventEmitterNode();

