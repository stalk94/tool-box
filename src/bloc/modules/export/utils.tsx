import ReactDOMServer from 'react-dom/server';
import React from 'react';
import { createRoot } from 'react-dom/client';
import prettier from 'prettier/standalone';
import { JSONContent } from '@tiptap/react';
import pluginEstree from 'prettier/plugins/estree';
import * as parserTypescript from 'prettier/plugins/typescript';
import { rendeHtml } from '../tip-tap';



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
/** преобразует html строковый в literal */
export function htmlToJsx(html: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const root = doc.body;

    return Array.from(root.childNodes)
        .map(node => convertNodeToJsx(node))
        .join('\n');
}

/** prettier форматирование */
export function formatJsx(code: string): Promise<string> {
    return prettier.format(code, {
        parser: 'typescript',
        plugins: [parserTypescript, pluginEstree],

        // 👉 Настройки форматирования:
        semi: true,                     // ставить ; в конце
        singleQuote: true,             // одинарные кавычки
        tabWidth: 4,                   // ширина отступа (в пробелах)
        useTabs: false,                // использовать табы вместо пробелов
        trailingComma: 'none',         // запятые в конце объектов/массивов
        bracketSpacing: true,          // пробелы между скобками: { foo: bar }
        jsxBracketSameLine: false,     // перенос > в JSX
        printWidth: 80,                // максимальная ширина строки
        arrowParens: 'avoid',          // скобки у стрелочных функций
    });
}
/** для преобразования object в литерал */
export const toObjectLiteral = (obj: any): string => {
    if (typeof obj !== 'object' || obj === null) return '{}';

    return Object.entries(obj)
        .map(([key, value]) => {
            const validKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `'${key}'`;
            return `${validKey}: ${toLiteral(value)}`;
        })
        .join(', ');
}
/** обший случай применения на любой тип его преоюразование в литерал */
export const toLiteral = (value: any): string => {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';

    if (typeof value === 'object' && value !== null && '__raw' in value) {
        return value.__raw;
    }
    if (typeof value === 'string') {
        //return '`' + value.replace(/`/g, '\\`') + '`';
        return(JSON.stringify(value))
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
        return String(value);
    }

    if (Array.isArray(value)) {
        return `[${value.map(v => toLiteral(v)).join(', ')}]`;
    }

    if (typeof value === 'object') {
        return `{ ${toObjectLiteral(value)} }`;
    }

    return 'undefined'; // fallback
}
/** для преобразования props в литерал */
export function toJSXProps(obj: Record<string, any>): string {
    return Object.entries(obj || {})
        .map(([key, value]) => {
            if (typeof value === 'string') {
                return `${key}="${value}"`; // строки — в кавычки
            } 
            else if (typeof value === 'boolean') {
                return value ? key : ''; // disabled={false} → пропуск
            } 
            else {
                return `${key}={${JSON.stringify(value)}}`; // всё остальное — через {}
            }
        })
        .filter(Boolean)
        .join(' ');
}
/** преобразованиe в литерал data tip-tap editor */
export const exportTipTapValue = (data: JSONContent | string) => {
    if(typeof data === 'string') return (`<span>${data}</span>`)
    else return htmlToJsx(rendeHtml(data));
}



////////////////////////////////////////////////////////////////////////////
//   experemental
////////////////////////////////////////////////////////////////////////////

function getTypeNameFromReactComponent(node: React.ReactElement): string {
    const type = node.type;

    if (typeof type === 'string') return type;

    const resolvedType =
        type?.type?.render ||  // memo(forwardRef)
        type?.render ||        // forwardRef
        type?.type ||          // memo
        type;

    let name =
        type?.displayName ||
        resolvedType?.displayName ||
        resolvedType?.name ||
        resolvedType?.constructor?.name;

    // Clean up "ForwardRef(ComponentName)" → "ComponentName"
    if (name?.includes('(')) {
        const match = name.match(/\(?([A-Za-z0-9_]+)\)?$/);
        name = match?.[1];
    }

    return name || 'div';
}
const isReactElement = (value: any): value is React.ReactElement => {
    return typeof value === 'object' && value !== null && '$$typeof' in value;
}


/**
 * Пркобразует рекурсивно children в jsx literal
 * @param children 
 * @param indent 
 * @returns 
 */
export function renderJsonToLiteral(children: any, indent = 4): string {
    const pad = ' '.repeat(indent);

    if (typeof children === 'string' || typeof children === 'number' || typeof children === 'boolean') {
        return `${pad}${children}`;
    }
    if (Array.isArray(children)) {
        return children
            .map(child => renderJsonToLiteral(child, indent))
            .join('\n');
    }
    console.log(isReactElement(children))

    if (isReactElement(children)) {
        const type = getTypeNameFromReactComponent(children);
        const props = children.props || {};

        const childCode = renderJsonToLiteral(props.children, indent + 2);

        const attrs = Object.entries(props)
            .filter(([k]) => k !== 'children')
            .map(([k, v]) => {
                if (typeof v === 'string') return `${k}="${v}"`;
                if (typeof v === 'number' || typeof v === 'boolean') return `${k}={${v}}`;

                if (isReactElement(v)) {
                    try {
                        const html = ReactDOMServer.renderToStaticMarkup(v).trim();
                        return `${k}={<div dangerouslySetInnerHTML={{ __html: \`${html}\` }} />}`;
                    } 
                    catch (e) {
                        const jsx = renderJsonToLiteral(v, 0).trim();
                        return `${k}={${jsx}}`;
                    }
                }

                return `${k}={${JSON.stringify(v)}}`;
            }).join(' ');

        return `${pad}<${type}${attrs ? ' ' + attrs : ''}>${childCode ? `\n${childCode}\n${pad}` : ''}</${type}>`;
    }


    return '';
}


export function jsxJsonToString(node: any): string {
    if (typeof node === 'string') return node;
    if (!node || node.$$jsx !== true || typeof node.type !== 'string') return '';

    const { type, props = {} } = node;

    const attrs = Object.entries(props)
        .filter(([key]) => key !== 'children')
        .map(([key, val]) => {
            return `${key}={${JSON.stringify(val)}}`;
        })
        .join(' ');

    const children = props.children;

    const childrenStr = Array.isArray(children)
        ? children.map(child => {
            return typeof child === 'object' && child.$$jsx
                ? jsxJsonToString(child)
                : child;
        }).join('')
        : (typeof children === 'object' && children?.$$jsx
            ? jsxJsonToString(children)
            : (children ?? ''));

    return `<${type}${attrs ? ' ' + attrs : ''}>${childrenStr}</${type}>`;
}

export function renderComponentSsr(element: React.ReactElement) {
    try {
        const html = ReactDOMServer.renderToStaticMarkup(element);
        return html.trim();
    }
    catch (e) {
        console.warn('[SSR-render] Ошибка при рендере компонента:', e);
        return null;
    }
}

export async function renderComponentSsrPrerender(element: React.ReactElement): Promise<string> {
    return new Promise((resolve) => {
        const container = document.createElement('div');
        createRoot(container).render(element);
        

        setTimeout(() => {
            resolve(container.innerHTML);
        }, 700);
    });
}
