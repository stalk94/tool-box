import { JSONContent } from '@tiptap/react';
import { rendeHtml } from '../tip-tap';


export function toJsx(json: JSONContent|string|undefined|null) {
    if(typeof json === 'object') {
        const html = rendeHtml(json);
        return <div dangerouslySetInnerHTML={{ __html: html }} />;
    }
    else return json;
}