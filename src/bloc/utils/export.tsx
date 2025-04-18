import { writeFile } from '../../app/plugins';
import { cellsContent, renderState } from '../context';


export const generateJSX = (type: string, propsRaw: Record<string, any> = {}, indent = 2): string => {
    const props = propsRaw || {};
    const spaces = ' '.repeat(indent);
    const attrs = Object.entries(props)
        .filter(([key]) => key !== 'children')
        .map(([key, value]) => {
            if (typeof value === 'string') return `${key}="${value}"`;
            if (typeof value === 'boolean' || typeof value === 'number') return `${key}={${value}}`;
            if (typeof value === 'object') return `${key}={${JSON.stringify(value)}}`;
            return '';
        })
        .join(' ');

    const children = props.children;
    const hasChildren = !!children && (Array.isArray(children) ? children.length > 0 : true);

    if (!hasChildren) {
        return `${spaces}<${type} ${attrs} />`;
    }

    const childrenCode = Array.isArray(children)
        ? children.map(child =>
            typeof child === 'object' && child?.props
                ? generateJSX(child.type?.name || 'div', child.props, indent + 2)
                : `${' '.repeat(indent + 2)}${child}`
        ).join('\n')
        : typeof children === 'object' && children?.props
            ? generateJSX(children.type?.name || 'div', children.props, indent + 2)
            : `${' '.repeat(indent + 2)}${children}`;

    return `${spaces}<${type} ${attrs}>
${childrenCode}
${spaces}</${type}>`;
};

export const exportAsJSX = async (name: string) => {
  const layout = renderState.get({ noproxy: true });
  const cells = cellsContent.get({ noproxy: true });

  const renderedBlocks = layout.map(cell => {
    const comps = cells[cell.i] ?? [];
    const children = comps.map(c =>
      generateJSX(c.props?.['data-type'] || 'div', c.props || {})
    ).join('\n');

    return `  <div data-id="${cell.i}">\n${children}\n  </div>`;
  });

  const output = `import React from 'react';

export default function Page() {
  return (
    <div>
${renderedBlocks.join('\n\n')}
    </div>
  );
}`;

  await writeFile('/exports/jsx', `${name}.tsx`, output);
};