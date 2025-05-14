import ReactDOMServer from 'react-dom/server';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react';
import prettier from 'prettier/standalone';
import parserBabel from 'prettier/plugins/babel';
import pluginEstree from 'prettier/plugins/estree';
import * as parserTypescript from 'prettier/plugins/typescript';



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
function debugComponentTree(node: React.ReactElement) {
    console.log('type:', node.type);
    console.log('type.name:', node.type?.name);
    console.log('type.displayName:', node.type?.displayName);
    console.log('type.render?.name:', node.type?.render?.name);
    console.log('type.type?.render?.name:', node.type?.type?.render?.name);
}
function childTypeName(type: any): string {
    if (typeof type === 'string') return type;
    if (typeof type === 'function' && type.name) return type.name;
    return 'div';
}
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
