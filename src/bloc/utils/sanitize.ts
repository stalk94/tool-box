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