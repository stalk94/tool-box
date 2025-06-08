import { JSONContent } from '@tiptap/react';
import { rendeHtml } from '../tip-tap';


export function toJsx(json: JSONContent|string|undefined|null) {
    if(typeof json === 'object') {
        const html = rendeHtml(json);
        return <div dangerouslySetInnerHTML={{ __html: html }} />;
    }
    else return json;
}


/////////////////////////////////////////////////////////////////////////////////////
//              auto detect types
/////////////////////////////////////////////////////////////////////////////////////
export type FieldType = 'string'| 'url' | 'number' | 'boolean' | 'date' | 'object' | 'array' | 'unknown';

export function detectFieldType(values: any[]): FieldType {
    for (let value of values) {
        if (value === null || value === undefined) continue;

        if (typeof value === 'boolean') return 'boolean';
        // Чистый массив
        if (Array.isArray(value)) return 'array';
        // Валидный URL
        if (typeof value === 'string') {
            try {
                const url = new URL(value);
                if (url.protocol === 'http:' || url.protocol === 'https:') return 'url';
            } 
            catch { /* not a valid URL */ }
        }
        if (!isNaN(Number(value))) return 'number';
        // Объект
        if (typeof value === 'object') return 'object';
        // Строка по дефолту
        return 'string';
    }
    
    return 'unknown';
}