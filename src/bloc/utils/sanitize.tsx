import { Box } from '@mui/material';
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
    
    
    const deepSerialize = (value: any): any => {
        if (React.isValidElement(value)) {
            return serializeJSX(value);
        }
        if (Array.isArray(value)) {
            return value.map(deepSerialize);
        }
        if (typeof value === 'object' && value !== null) {
            const result: Record<string, any> = {};

            for (const [k, v] of Object.entries(value)) {
                result[k] = deepSerialize(v);
            }
            return result;
        }
        return value;
    }

    if (React.isValidElement(node)) {
        const type = typeof node.type === 'string' ? node.type : getName();
        const rawProps = { ...node.props };
        const props = deepSerialize(rawProps); // 👈 сериализуем все поля

        return {
            $$jsx: true,
            type,
            props
        };
    } 
    else if (
        typeof node === 'string' ||
        typeof node === 'number' ||
        node === null
    ) {
        return node;
    }

    return node;
}
export function deserializeJSX(node: any, maps?: Record<string, any>): any {
    if (node === null || typeof node === 'string' || typeof node === 'number') {
        return node;
    }

    if (typeof node === 'object' && node.$$jsx) {
        const { type, props } = node;
        const resolvedProps = { ...props };
       
        const getType =()=> {
            if(maps && maps[type]) return maps[type];
            else if(!maps) return type;
            else {
                console.warn('🚨 type компонента не найден в переданной карте!!');
                return type;
            }
        }

        if (props.children) {
            if (Array.isArray(props.children)) {
                resolvedProps.children = props.children.map(child => deserializeJSX(child, maps));
            } 
            else {
                resolvedProps.children = deserializeJSX(props.children, maps);
            }
        }
        
        return React.createElement(getType(), resolvedProps);
    }

    return node;
}