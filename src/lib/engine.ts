import { APIEndpoints } from "../types/global.js";
import EventEmiter from "./emiter";


window.gurl = import.meta.env.DEV ? 'http://localhost:3000/' : document.baseURI;
window.languages = ['GB', 'RU', 'CN', 'DE'];
export const EVENT = new EventEmiter();



export async function send<T extends keyof APIEndpoints>(
    url: T, 
    data: APIEndpoints[T]['request'],
    metod: APIEndpoints[T]['method']
): Promise<APIEndpoints[T]['response']> {
    const dataServer = {
        method: metod ?? 'POST',
        credentials: 'same-origin',
        headers: {
            'Authorization': `Bearer ${window.token}`,
            'Content-Type': 'application/json'
        }
    }
    if(metod!=='GET') dataServer.body = JSON.stringify(data);

    const request = await fetch(window.gurl + url, dataServer);
    return request.json();
}


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