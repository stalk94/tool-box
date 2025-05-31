import React from 'react';
import { componentMap } from '../modules/helpers/registry';
import { ComponentSerrialize, Component } from '../type';


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

// используется для json редактора
export const serrialize = (component: Component, parent?: string|number): ComponentSerrialize => {
    const rawProps = { ...component.props };
    const type = rawProps['data-type'];
    const id = rawProps['data-id'] ?? Date.now();

    delete rawProps.ref;
    const cleanedProps = serializeJSX(rawProps);

    return {
        id,
        parent: parent,
        props: {
            ...cleanedProps,
            'data-id': id,
            'data-type': type,
        }
    };
}
export const desserealize = (component: ComponentSerrialize, data?: Record<string, any>) => {
    if(component) {
        const { props, parent } = component;
        const type = props["data-type"];
        //console.log(component)
        const Component = componentMap[type];
        Component.displayName = type;
        Component.parent = parent ?? data?.parent;


        if (!Component) {
            console.warn(`Компонент типа "${type}" не найден в реестре`);
            return null;
        }

        return (
            <Component
                {...props}
                {...data}
            />
        );
    }
}


/** преобразователь в относительные размеры (%) */
export function getRelativeStylePercent(style, parentWidth, parentHeight) {
    return {
        ...style,
        position: 'absolute',
        top: (style.y / parentHeight) * 100 + '%',
        left: (style.x / parentWidth) * 100 + '%',
        width: typeof style.width === 'number'
            ? (style.width / parentWidth) * 100 + '%'
            : style.width,
        height: typeof style.height === 'number'
            ? (style.height / parentHeight) * 100 + '%'
            : style.height,
        zIndex: style.y,
    };
}