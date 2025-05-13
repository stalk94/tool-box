import { toJSXProps } from './Inputs';
export { formatJsx } from './utils';
import { rendeHtml } from '../tip-tap';


export function htmlToJsx(html: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const root = doc.body;

    return Array.from(root.childNodes)
        .map(node => convertNodeToJsx(node))
        .join('\n');
}
function convertNodeToJsx(node: Node): string {
    if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent || '';
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return '';

    const el = node as HTMLElement;
    const tag = el.tagName.toLowerCase();
    const children = Array.from(el.childNodes).map(convertNodeToJsx).join('');

    const props = Array.from(el.attributes)
        .map(attr => {
            if (attr.name === 'class') return `className="${attr.value}"`;
            if (attr.name === 'style') return `style={${cssStringToObject(attr.value)}}`;
            return `${attr.name}="${attr.value}"`;
        })
        .join(' ');

    return `<${tag}${props ? ' ' + props : ''}>${children}</${tag}>`;
}
function cssStringToObject(styleStr: string): string {
    const entries = styleStr
        .split(';')
        .map(line => line.trim())
        .filter(Boolean)
        .map(line => {
            const [key, value] = line.split(':').map(s => s.trim());
            const camelKey = key.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
            return `${camelKey}: "${value.replace(/"/g, '\\"')}"`;
        });

    return `{ ${entries.join(', ')} }`;
}


export function exportText(
    text,
    style: React.CSSProperties,
) {
    const toObjectLiteral = (obj) => {
        return Object.entries(obj || {})
            .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
            .join(', ');
    }


    return (`
        import React from 'react';


        export default function Text() {
            return (
                <div
                    style={{ ${toObjectLiteral(style)} }}
                >
                    ${ htmlToJsx(rendeHtml(text)) }
                </div>
            );
        }
    `);
}
export function exportTypography(
    text,
    sx,
    style: React.CSSProperties,
    otherProps
) {
    const toObjectLiteral = (obj) => {
        return Object.entries(obj || {})
            .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
            .join(', ');
    }


    return (`
        import React from 'react';
        import { Typography } from '@mui/material';


        export default function TypographyWrap() {
            return (
                <Typography
                    sx={{ ${toObjectLiteral(sx)} }}
                    style={{ ${toObjectLiteral(style)} }}
                    ${ toJSXProps(otherProps) }
                >
                    ${ text }
                </Typography>
            );
        }
    `);
}