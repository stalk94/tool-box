import React from 'react';


function renderChildren(node: any) {
    return node.content?.map((child, i) => (
        <NodeRenderer key={i} node={child} />
    ));
}
function getStyle(node: any): React.CSSProperties {
    const style: React.CSSProperties = {};

    if (node.attrs?.color) style.color = node.attrs.color;
    if (node.attrs?.fontSize) style.fontSize = node.attrs.fontSize;
    if (node.attrs?.fontFamily) style.fontFamily = node.attrs.fontFamily;
    if (node.attrs?.textAlign) style.textAlign = node.attrs.textAlign;

    
    if (node.marks) {
        for (const mark of node.marks) {
            if (mark.type === 'textStyle' && mark.attrs?.color) {
                style.color = mark.attrs.color;
            }
            if (mark.type === 'fontSize' && mark.attrs?.size) {
                style.fontSize = mark.attrs.size;
            }
            if (mark.type === 'fontFamily' && mark.attrs?.family) {
                style.fontFamily = mark.attrs.family;
            }
            if (mark.type === 'bold') {
                style.fontWeight = 'bold';
            }
            if (mark.type === 'italic') {
                style.fontStyle = 'italic';
            }
            if (mark.type === 'underline') {
                style.textDecoration = 'underline';
            }
            if (mark.type === 'strike') {
                style.textDecoration = 'line-through';
            }
        }
    }
    return style;
}
function classNamesFromMarks(marks: any[] = []) {
    console.log(marks)
    return [
        marks.some((m) => m.type === 'bold') && 'bold',
        marks.some((m) => m.type === 'italic') && 'italic',
        marks.some((m) => m.type === 'underline') && 'underline',
        marks.some((m) => m.type === 'strike') && 'strike',
    ]
        .filter(Boolean)
        .join(' ');
}


// ! store должен определятся динамически так как в продакшен другая система storages
function LiveVariable({ name, rowIndex, db, autoIndex }: { name: string; rowIndex: number|'auto' }) {
    const store = {};

    
    return (
        <span className="variable-node" title={`{{${name}}}`}>
            { rowIndex === 'auto' 
                ? store[db]?.value?.[(autoIndex ?? 0)]?.[name]
                : store[db]?.value?.[rowIndex]?.[name]
            }
        </span>
    );
}


function NodeRenderer({ node, autoIndex }: { node: any, autoIndex?:number }) {
    if (node.type === 'paragraph') {
        return <p style={getStyle(node)}>{renderChildren(node)}</p>;
    }

    if (node.type === 'heading') {
        const Tag = `h${node.attrs.level || 1}` as keyof React.JSX.IntrinsicElements;
        return <Tag style={getStyle(node)}>{renderChildren(node)}</Tag>;
    }

    if (node.type === 'text') {
        return (
            <span
                style={getStyle(node)}
                className={classNamesFromMarks(node.marks)}
            >
                {node.text}
            </span>
        );
    }

    if (node.type === 'variable') {
        console.log(node.attrs)
        return (
            <LiveVariable 
                name={node.attrs.name} 
                rowIndex={node.attrs.rowIndex} 
                db={node.attrs.db} 
                autoIndex={autoIndex}
            />
        );
    }

    if (node.type === 'link') {
        const href = node.attrs.href;
        return (
            <a href={href} target="_blank" rel="noreferrer" style={getStyle(node)}>
                { renderChildren(node) }
            </a>
        );
    }

    return null;
}


export default function TiptapJSONRenderer({ value,  className, autoIndex }: { value: any, className?: string, autoIndex?:number }) {
    return (
        <div className={className}>
            {value.content?.map((node, i) => (
                <NodeRenderer key={i} node={node} autoIndex={autoIndex} />
            ))}
        </div>
    );
}