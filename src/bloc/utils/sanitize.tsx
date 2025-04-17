import React from 'react';


export function sanitizeProps<T extends Record<string, any>>(props: T): T {
    return JSON.parse(
        JSON.stringify(props, (key, value) => {
            if (typeof value === 'function') return undefined;
            if (typeof value === 'symbol') return undefined;
            if (React.isValidElement(value)) return undefined;
            return value;
        })
    );
}


export function serializeJSX(node: any): any {
    const pType =(type: string | undefined)=> {
        if(type) return type.replace(/[0-9]/g, "");
    }
    const getName =()=> {
        const dataType = node.props['data-type'];
        const typeName = pType(node?.type?.name);
        const renederName = pType(node?.type?.render?.name);
        const displayName = pType(node?.type?.displayName);

        return (dataType ?? ((displayName ?? (typeName ?? renederName))) ?? 'Anonymous');
    }
    

    if (React.isValidElement(node)) {
        const type = typeof node.type === 'string'
            ? node.type
            : getName();
        
        const props = { ...node.props };

        // рекурсивная обработка children
        if (props.children) {
            if (Array.isArray(props.children)) {
                props.children = props.children.map((child) => serializeJSX(child));
            } 
            else {
                props.children = serializeJSX(props.children);
            }
        }

        return {
            $$jsx: true,
            type,
            props
        }
    } 
    else if (typeof node === 'string' || typeof node === 'number' || node === null) {
        return node;
    }

    return node;
}
export function deserializeJSX(node: any): any {
    if (node === null || typeof node === 'string' || typeof node === 'number') {
        return node;
    }

    if (typeof node === 'object' && node.$$jsx) {
        const { type, props } = node;
        const resolvedProps = { ...props };

        if (props.children) {
            if (Array.isArray(props.children)) {
                resolvedProps.children = props.children.map(deserializeJSX);
            } 
            else {
                resolvedProps.children = deserializeJSX(props.children);
            }
        }

        return React.createElement(type, resolvedProps);
    }

    return node;
}
